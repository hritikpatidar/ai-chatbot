import mongoose from "mongoose";
import SupportTicket from "../models/SupportTicket.js";
import Client from "../models/Client.js";


import { supportTicketConfirmationEmailTemplate, supportTicketCreatedEmailTemplate, supportTicketReplyEmailTemplate } from "../helpers/emailTemplate.js";
import User from "../models/User.js";
import { createAndSendNotification } from "../services/notification.service.js";
import { getAdminSettingsService } from "../services/adminSetting.service.js";
import { enqueueEmail } from "../services/emailQueue.service.js";

const enqueueTemplateEmail = async (to, template, options = {}) => {
    if (!template?.subject || !template?.html) {
        throw new Error("Invalid email template");
    }

    return enqueueEmail({
        to,
        subject: template.subject,
        html: template.html,
        ...options,
    });
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
        if (!client) {
            return res.status(404).json({
                success: false,
                message: "Client not found",
            });
        }

        const admin = await User.findOne({ email: "superadmin@gmail.com" }).lean();
        if (!admin) {
            return res.status(500).json({
                success: false,
                message: "Support administrator is not configured",
            });
        }

        const ClientBusiness = await Client.findById(client.clientId).lean();
        const adminSettings = await getAdminSettingsService(admin._id);

        if (!ClientBusiness) {
            return res.status(404).json({
                success: false,
                message: "Client business profile not found",
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
            replies: [
                {
                    sender: "client",
                    message: description.trim(),
                    sentAt: new Date(),
                },
            ],
            lastReplyAt: new Date(),
        });
        const emailResults = await Promise.allSettled([
            enqueueTemplateEmail(
                adminSettings.supportEmail,
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
            enqueueTemplateEmail(
                email,
                supportTicketConfirmationEmailTemplate({
                    ticketNumber: ticket.ticketNumber,
                    clientName,
                    subject: ticket.subject,
                    planName: actualPlan,
                    priority,
                }),
                {
                    supportTicketId: ticket._id,
                    purpose: "support-ticket-confirmation",
                },
            ),
        ]);
        emailResults.forEach((result) => {
            if (result.status === "rejected") {
                console.error("[support-ticket] Email could not be queued:", {
                    ticketId: ticket._id.toString(),
                    message: result.reason?.message || result.reason,
                });
            }
        });
        void createAndSendNotification({
            type: "supportTicket",
            clientId: null,
            adminId: admin._id,
            title: `New Support Ticket: ${ticket.ticketNumber}`,
            message: `${clientName} created a support ticket: "${ticket.subject}". Priority: ${ticket.priority}.`,
            webRoute: "/admin/support-tickets",
            screen: "",
            image: "https://api.naqshapp.com/naqshsvg.jpg",
            metadata: {
                ticketId: ticket._id.toString(),
                ticketNumber: ticket.ticketNumber,
                subject: ticket.subject,
                priority: ticket.priority,
                planName: ticket.planName,
                status: ticket.status,
            },
        }).catch((error) => {
            console.error("[support-ticket] Admin notification failed:", error);
        });

        const emailsQueued = emailResults.every(
            (result) => result.status === "fulfilled"
        );

        return res.status(201).json({
            success: true,
            message: emailsQueued
                ? "Support ticket created. Email notifications are queued for delivery."
                : "Support ticket created, but an email notification could not be queued.",
            ticket,
            emailsQueued,
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
        const originalMessageId = ticket.clientConfirmationMessageId;

        const nextStatus = status || "In Progress";

        // Queue the email before saving the reply so queue failures are surfaced.
        const emailJob = await enqueueTemplateEmail(
            ticket.clientEmail,
            supportTicketReplyEmailTemplate({
                ticketNumber: ticket.ticketNumber,
                clientName: ticket.clientName,
                subject: ticket.subject,
                reply: message.trim(),
                status: nextStatus,
            }),
            originalMessageId
                ? {
                    inReplyTo: originalMessageId,
                    references: originalMessageId,
                }
                : {},
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
            message: "Reply saved and email queued for delivery",
            emailQueued: Boolean(emailJob),
            ticket,
        });
    } catch (error) {
        console.error("replyToSupportTicket:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to save reply or queue email",
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