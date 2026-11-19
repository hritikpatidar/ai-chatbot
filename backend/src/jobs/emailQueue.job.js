import env from "../config/env.js";
import transporter from "../config/mail.js";
import EmailJob from "../models/EmailJob.js";
import SupportTicket from "../models/SupportTicket.js";

const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 60 * 1000;
const RETRY_DELAYS_MS = [
  30 * 1000,
  2 * 60 * 1000,
  10 * 60 * 1000,
  30 * 60 * 1000,
];
const POLL_INTERVAL_MS = 3000;
const WORKER_CONCURRENCY = 3;

const processEmailJob = async () => {
  const now = new Date();
  const job = await EmailJob.findOneAndUpdate(
    {
      $or: [
        { status: "pending", nextAttemptAt: { $lte: now } },
        { status: "processing", lockUntil: { $lte: now } },
      ],
    },
    {
      $set: {
        status: "processing",
        lockUntil: new Date(now.getTime() + LOCK_DURATION_MS),
      },
      $inc: { attempts: 1 },
    },
    {
      returnDocument: "after",
      sort: { createdAt: 1 },
    },
  );

  if (!job) {
    return false;
  }

  try {
    const info = await transporter.sendMail({
      from: job.from,
      to: job.to,
      subject: job.subject,
      ...(job.html ? { html: job.html } : {}),
      ...(job.text ? { text: job.text } : {}),
      ...(job.inReplyTo ? { inReplyTo: job.inReplyTo } : {}),
      ...(job.references ? { references: job.references } : {}),
    });

    if (!info.accepted?.length) {
      throw new Error(
        `SMTP accepted no recipients: ${info.rejected?.join(", ") || "unknown"}`,
      );
    }

    await EmailJob.updateOne(
      { _id: job._id },
      {
        $set: {
          status: "sent",
          messageId: info.messageId || null,
          lastError: "",
          lockUntil: null,
        },
      },
    );

    if (
      job.purpose === "support-ticket-confirmation" &&
      job.supportTicketId &&
      info.messageId
    ) {
      await SupportTicket.updateOne(
        { _id: job.supportTicketId },
        { $set: { clientConfirmationMessageId: info.messageId } },
      );
    }
  } catch (error) {
    const terminal = job.attempts >= MAX_ATTEMPTS;
    const delay =
      RETRY_DELAYS_MS[job.attempts - 1] ||
      RETRY_DELAYS_MS[RETRY_DELAYS_MS.length - 1];
    await EmailJob.updateOne(
      { _id: job._id },
      {
        $set: {
          status: terminal ? "failed" : "pending",
          nextAttemptAt: new Date(Date.now() + delay),
          lockUntil: null,
          lastError: String(error.message || error).slice(0, 1000),
        },
      },
    );
    console.error("[email-queue] Delivery failed", {
      jobId: job._id.toString(),
      attempt: job.attempts,
      terminal,
      code: error.code || "UNKNOWN",
      responseCode: error.responseCode || null,
      message: error.message,
    });
  }

  return true;
};

let workerStarted = false;
let workerBusy = false;

export const startEmailQueueWorker = () => {
  if (workerStarted) {
    return;
  }
  workerStarted = true;

  if (!env.MAIL_HOST || !env.MAIL_PORT || !env.MAIL_USER || !env.MAIL_PASSWORD) {
    console.error(
      "[email-queue] SMTP configuration is incomplete. Set MAIL_HOST, MAIL_PORT, MAIL_USER, and MAIL_PASSWORD.",
    );
  }

  const poll = async () => {
    if (workerBusy) {
      return;
    }
    workerBusy = true;
    try {
      await Promise.all(
        Array.from({ length: WORKER_CONCURRENCY }, () =>
          processEmailJob().catch((error) => {
            console.error("[email-queue] Worker error:", error);
            return false;
          }),
        ),
      );
    } finally {
      workerBusy = false;
    }
  };

  setInterval(poll, POLL_INTERVAL_MS);
  void poll();
  console.log("[email-queue] Worker started");
};
