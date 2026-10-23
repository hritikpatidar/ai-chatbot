import mongoose from "mongoose";
import SupportTicket from "../models/SupportTicket.js";
import Client from "../models/Client.js";


import env from "../config/env.js";
import transporter from "../config/mail.js";
import { supportTicketConfirmationEmailTemplate, supportTicketCreatedEmailTemplate, supportTicketReplyEmailTemplate } from "../helpers/emailTemplate.js";
import User from "../models/User.js";

const sendTemplateEmail = async (to, template) => {
    if (!to) {
        throw new Error("Email recipient is not configured");
    }

    if (!template?.subject || !template?.html) {
        throw new Error("Invalid email template");
    }

    const info = await transporter.sendMail({
        from: `"AI Chatbot" <${env.MAIL_USER}>`,
        to,
        subject: template.subject,
        html: template.html,
    });

    return info;
};

// CLIENT: Create a support ticket.
export const createSupportTicket = async (req, res) => {
    try {
        const { email, subject, description, planName } = req.body;

        // Set this using your client-auth middleware.
        const clientId = req.user?.id;

        if (!clientId || !mongoose.isValidObjectId(clientId)) {
            return res.status(401).json({
                success: false,
                message: "Authenticated client not found",
            });
        }

        if (
            typeof subject !== "string" ||
            !subject.trim() ||
            subject.trim().length > 200
        ) {
            return res.status(400).json({
                success: false,
                message: "Subject is required and must be under 200 characters",
            });
        }

        if (
            typeof description !== "string" ||
            !description.trim() ||
            description.trim().length > 10000
        ) {
            return res.status(400).json({
                success: false,
                message: "Description is required and must be under 10000 characters",
            });
        }

        // Never trust planName from the request body for priority.
        const client = await User.findById(clientId).lean();
        const ClientBusiness = await Client.findById(client.clientId).lean();

        if (!client) {
            return res.status(404).json({
                success: false,
                message: "Client not found",
            });
        }

        const actualPlan = ClientBusiness.active_plan || "Basic";
        const priority = actualPlan === "Pro" ? "High" : "Low";
        const clientName = client.fullName || "Client";

        const ticket = await SupportTicket.create({
            clientId: client._id,
            clientEmail: email,
            clientName,
            subject: subject.trim(),
            description: description.trim(),
            planName: actualPlan,
            priority,
            status: "Open",
        });

        // Ticket remains saved even if an email provider is temporarily down.
        const emailResults = await Promise.allSettled([
            sendTemplateEmail(
                env.ADMIN_SUPPORT_EMAIL,
                supportTicketCreatedEmailTemplate({
                    ticketNumber: ticket.ticketNumber,
                    clientName,
                    clientEmail: email,
                    subject: ticket.subject,
                    description: ticket.description,
                    planName: actualPlan,
                    priority,
                })
            ),
            sendTemplateEmail(
                email,
                supportTicketConfirmationEmailTemplate({
                    ticketNumber: ticket.ticketNumber,
                    clientName,
                    subject: ticket.subject,
                    planName: actualPlan,
                    priority,
                })
            ),
        ]);

        const emailsSent = emailResults.every(
            (result) => result.status === "fulfilled"
        );

        if (!emailsSent) {
            console.error(
                "Support ticket email delivery issue:",
                emailResults
                    .filter((result) => result.status === "rejected")
                    .map((result) => result.reason?.message)
            );
        }

        return res.status(201).json({
            success: true,
            message: emailsSent
                ? "Support ticket created and email notifications sent"
                : "Support ticket created, but an email notification could not be sent",
            ticket,
            emailsSent,
        });
    } catch (error) {
        console.error("createSupportTicket:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create support ticket",
        });
    }
};

// CLIENT: Get only the logged-in client's tickets.
export const getMySupportTickets = async (req, res) => {
    try {
        const clientId = req.user?.id;

        if (!clientId) {
            return res.status(401).json({
                success: false,
                message: "Authenticated client not found",
            });
        }

        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
        const [tickets, total] = await Promise.all([
            SupportTicket.find({ clientId })
                .sort({ updatedAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            SupportTicket.countDocuments({ clientId }),
        ]);

        return res.status(200).json({
            success: true,
            tickets,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("getMySupportTickets:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch support tickets",
        });
    }
};

// ADMIN: List all tickets with filters and pagination.
export const getAllSupportTickets = async (req, res) => {
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));

        const filter = {};
        const allowedStatuses = [
            "Open",
            "In Progress",
            "Resolved",
            "Closed",
        ];

        if (req.query.status && allowedStatuses.includes(req.query.status)) {
            filter.status = req.query.status;
        }

        if (["Low", "High"].includes(req.query.priority)) {
            filter.priority = req.query.priority;
        }

        if (req.query.search?.trim()) {
            const search = req.query.search.trim().slice(0, 100);
            const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            filter.$or = [
                { ticketNumber: { $regex: escaped, $options: "i" } },
                { clientEmail: { $regex: escaped, $options: "i" } },
                { subject: { $regex: escaped, $options: "i" } },
            ];
        }

        const [tickets, total] = await Promise.all([
            SupportTicket.find(filter)
                .sort({ priority: -1, createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            SupportTicket.countDocuments(filter),
        ]);

        return res.status(200).json({
            success: true,
            tickets,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("getAllSupportTickets:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch tickets",
        });
    }
};

// ADMIN: Get one ticket.
export const getSupportTicketById = async (req, res) => {
    try {
        const ticket = await SupportTicket.findById(req.params.id).lean();
        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }

        return res.status(200).json({
            success: true,
            ticket,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch ticket",
        });
    }
};

// ADMIN: Reply to the client by email.
export const replyToSupportTicket = async (req, res) => {
    try {
        const { message, status } = req.body;

        if (
            typeof message !== "string" ||
            !message.trim() ||
            message.trim().length > 10000
        ) {
            return res.status(400).json({
                success: false,
                message: "Reply is required and must be under 10000 characters",
            });
        }

        const allowedStatuses = [
            "Open",
            "In Progress",
            "Resolved",
            "Closed",
        ];

        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ticket status",
            });
        }

        const ticket = await SupportTicket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }

        const nextStatus = status || "In Progress";

        // Send email first. Do not save a reply that was not sent.
        await sendTemplateEmail(
            ticket.clientEmail,
            supportTicketReplyEmailTemplate({
                ticketNumber: ticket.ticketNumber,
                clientName: ticket.clientName,
                subject: ticket.subject,
                reply: message.trim(),
                status: nextStatus,
            })
        );

        ticket.replies.push({
            sender: "admin",
            message: message.trim(),
        });

        ticket.status = nextStatus;
        ticket.lastReplyAt = new Date();

        await ticket.save();

        return res.status(200).json({
            success: true,
            message: "Reply sent to client successfully",
            ticket,
        });
    } catch (error) {
        console.error("replyToSupportTicket:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to send reply email",
        });
    }
};

// ADMIN: Update status without sending a reply.
export const updateSupportTicketStatus = async (req, res) => {
    try {
        const allowedStatuses = [
            "Open",
            "In Progress",
            "Resolved",
            "Closed",
        ];

        const { status } = req.body;

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ticket status",
            });
        }

        const ticket = await SupportTicket.findByIdAndUpdate(
            req.params.id,
            { $set: { status } },
            { new: true, runValidators: true }
        );

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Ticket status updated",
            ticket,
        });
    } catch (error) {
        console.error("updateSupportTicketStatus:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update ticket status",
        });
    }
};