const escapeHtml = (value = "") => {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export const otpEmailTemplate = (otp) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <title>AI Chatbot - OTP Verification</title>
    </head>

    <body style="
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: Arial, Helvetica, sans-serif;
      color: #333333;
    ">

      <div style="
        max-width: 700px;
        margin: 30px auto;
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0,0,0,0.08);
      ">

        <!-- Header -->
        <div style="
          background: #111827;
          padding: 30px;
          text-align: center;
        ">

          <h1 style="
            margin: 0;
            color: #ffffff;
            font-size: 28px;
          ">
            AI Chatbot
          </h1>

          <p style="
            margin: 10px 0 0;
            color: #d1d5db;
            font-size: 15px;
          ">
            Secure Account Verification
          </p>

        </div>


        <!-- Main Content -->
        <div style="padding: 35px;">

          <h2 style="
            margin-top: 0;
            color: #111827;
            font-size: 24px;
          ">
            Hello 👋
          </h2>

          <p style="
            font-size: 16px;
            line-height: 1.7;
          ">
            We received a request to verify your account.
            Please use the One-Time Password (OTP) below to
            continue.
          </p>


          <!-- OTP Box -->
          <div style="
            margin: 30px 0;
            padding: 25px;
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            text-align: center;
          ">

            <p style="
              margin: 0 0 15px;
              font-size: 14px;
              color: #6b7280;
            ">
              Your One-Time Password
            </p>

            <div style="
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              color: #111827;
              text-align: center;
              margin: 10px 0;
            ">
              ${otp}
            </div>

            <p style="
              margin: 15px 0 0;
              font-size: 14px;
              color: #6b7280;
            ">
              This OTP is valid for
              <strong style="color: #111827;">
                10 minutes
              </strong>.
            </p>

          </div>


          <!-- Security Notice -->
          <div style="
            margin: 25px 0;
            padding: 20px;
            background: #fff7ed;
            border-left: 4px solid #f97316;
            border-radius: 6px;
          ">

            <h3 style="
              margin-top: 0;
              color: #9a3412;
              font-size: 18px;
            ">
              🔒 Security Notice
            </h3>

            <p style="
              margin-bottom: 0;
              font-size: 14px;
              line-height: 1.6;
              color: #7c2d12;
            ">
              Never share this OTP with anyone.
              Our team will never ask you for your OTP,
              password, or other security credentials.
            </p>

          </div>


          <!-- Didn't Request -->
          <p style="
            font-size: 15px;
            line-height: 1.6;
            color: #4b5563;
          ">
            If you didn't request this OTP, you can safely
            ignore this email. No changes will be made to
            your account.
          </p>


          <!-- Regards -->
          <p style="
            margin-top: 30px;
            margin-bottom: 0;
            font-size: 15px;
            line-height: 1.6;
          ">
            Regards,<br />
            <strong>AI Chatbot Team</strong>
          </p>

        </div>


        <!-- Footer -->
        <div style="
          background: #f9fafb;
          padding: 20px;
          text-align: center;
          border-top: 1px solid #e5e7eb;
        ">

          <p style="
            margin: 0;
            font-size: 13px;
            color: #6b7280;
          ">
            This is an automated email. Please do not reply
            directly to this email.
          </p>

        </div>

      </div>

    </body>
    </html>
  `;
};

export const clientWelcomeEmailTemplate = ({
  fullName,
  businessName,
  email,
  password,
  slug,
}) => {
  // Actual script
  const widgetScript = `<script
  src="https://my-ai-chatbot-project.vercel.app/widget.js"
  data-client-id="${slug}">
</script>`;

  // Escape script so email clients display it as text
  const displayWidgetScript = escapeHtml(widgetScript);

  const chatbotWebsiteUrl = "https://my-ai-chatbot-project.vercel.app/";

  return {
    subject: `Welcome to AI Chatbot - ${businessName}`,

    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>Welcome to AI Chatbot</title>
      </head>

      <body style="
        margin: 0;
        padding: 0;
        background-color: #f4f6f8;
        font-family: Arial, Helvetica, sans-serif;
        color: #333333;
      ">

        <div style="
          max-width: 700px;
          margin: 30px auto;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        ">

          <!-- Header -->
          <div style="
            background: #111827;
            padding: 30px;
            text-align: center;
          ">

            <h1 style="
              margin: 0;
              color: #ffffff;
              font-size: 28px;
            ">
              AI Chatbot
            </h1>

            <p style="
              margin: 10px 0 0;
              color: #d1d5db;
              font-size: 15px;
            ">
              Client Account Setup
            </p>

          </div>


          <!-- Main Content -->
          <div style="padding: 35px;">

            <h2 style="
              margin-top: 0;
              color: #111827;
              font-size: 24px;
            ">
              Welcome ${escapeHtml(fullName)} 👋
            </h2>

            <p style="
              font-size: 16px;
              line-height: 1.7;
            ">
              Your AI Chatbot client account for
              <strong>${escapeHtml(businessName)}</strong>
              has been successfully created.
            </p>

            <p style="
              font-size: 16px;
              line-height: 1.7;
            ">
              You can use the credentials below to log in to your
              client dashboard and manage your chatbot configuration.
            </p>


            <!-- Login Details -->
            <div style="
              margin: 25px 0;
              padding: 22px;
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 10px;
            ">

              <h3 style="
                margin-top: 0;
                color: #111827;
                font-size: 18px;
              ">
                🔐 Login Credentials
              </h3>

              <p style="margin: 10px 0;">
                <strong>Name:</strong>
                ${escapeHtml(fullName)}
              </p>

              <p style="margin: 10px 0;">
                <strong>Email:</strong>
                ${escapeHtml(email)}
              </p>

              <p style="margin: 10px 0;">
                <strong>Password:</strong>
                ${escapeHtml(password)}
              </p>

            </div>


            <!-- AI Chatbot Website -->
            <div style="
              margin: 25px 0;
              padding: 22px;
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 10px;
            ">

              <h3 style="
                margin-top: 0;
                color: #111827;
                font-size: 18px;
              ">
                🌐 AI Chatbot Dashboard
              </h3>

              <p style="
                font-size: 15px;
                line-height: 1.6;
                margin-bottom: 18px;
              ">
                You can access the AI Chatbot platform using the
                button below.
              </p>

              <a
                href="${chatbotWebsiteUrl}"
                target="_blank"
                style="
                  display: inline-block;
                  padding: 12px 22px;
                  background-color: #111827;
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 7px;
                  font-size: 15px;
                  font-weight: bold;
                "
              >
                Open AI Chatbot
              </a>

              <p style="
                margin-top: 18px;
                margin-bottom: 0;
                font-size: 13px;
                color: #6b7280;
                word-break: break-all;
              ">
                ${chatbotWebsiteUrl}
              </p>

            </div>


            <!-- Widget Script -->
            <div style="
              margin: 25px 0;
              padding: 22px;
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 10px;
            ">

              <h3 style="
                margin-top: 0;
                color: #111827;
                font-size: 18px;
              ">
                🤖 Add AI Chatbot to Your Website
              </h3>

              <p style="
                font-size: 15px;
                line-height: 1.6;
              ">
                Copy and paste the following script before the
                closing <strong>&lt;/body&gt;</strong> tag of your website.
              </p>


              <!-- Script Code -->
              <div style="
                background-color: #111827;
                color: #f9fafb;
                padding: 18px;
                border-radius: 8px;
                font-family: 'Courier New', Courier, monospace;
                font-size: 13px;
                line-height: 1.7;
                overflow-x: auto;
                border: 1px solid #374151;
              ">

                <pre style="
                  margin: 0;
                  padding: 0;
                  color: #f9fafb;
                  background: transparent;
                  font-family: 'Courier New', Courier, monospace;
                  font-size: 13px;
                  line-height: 1.7;
                  white-space: pre-wrap;
                  word-break: break-word;
                ">${displayWidgetScript}</pre>

              </div>


              <p style="
                margin-top: 15px;
                margin-bottom: 0;
                font-size: 14px;
                color: #6b7280;
              ">
                Your unique client ID is:
                <strong>${escapeHtml(slug)}</strong>
              </p>

            </div>


            <!-- Installation Instructions -->
            <div style="
              margin: 25px 0;
              padding: 20px;
              background: #eff6ff;
              border-left: 4px solid #2563eb;
              border-radius: 6px;
            ">

              <h3 style="
                margin-top: 0;
                color: #1e3a8a;
                font-size: 18px;
              ">
                📌 Next Steps
              </h3>

              <ol style="
                padding-left: 20px;
                line-height: 1.8;
                color: #374151;
              ">

                <li>
                  Login to your AI Chatbot dashboard.
                </li>

                <li>
                  Configure your chatbot settings.
                </li>

                <li>
                  Add FAQs, products or services.
                </li>

                <li>
                  Copy the chatbot script provided above.
                </li>

                <li>
                  Paste the script into your website before the
                  closing <strong>&lt;/body&gt;</strong> tag.
                </li>

                <li>
                  Save your website and open it in the browser.
                </li>

                <li>
                  Your AI chatbot will then be available on your website.
                </li>

              </ol>

            </div>


            <!-- Security Notice -->
            <div style="
              margin: 25px 0;
              padding: 20px;
              background: #fff7ed;
              border-left: 4px solid #f97316;
              border-radius: 6px;
            ">

              <h3 style="
                margin-top: 0;
                color: #9a3412;
                font-size: 18px;
              ">
                🔒 Security Notice
              </h3>

              <p style="
                margin-bottom: 0;
                font-size: 14px;
                line-height: 1.6;
                color: #7c2d12;
              ">
                Please keep your login credentials secure and do not
                share your password with unauthorized persons.
              </p>

            </div>


            <!-- Support -->
            <p style="
              font-size: 15px;
              line-height: 1.6;
            ">
              If you need any assistance with your chatbot setup,
              please contact our support team.
            </p>


            <p style="
              margin-top: 30px;
              margin-bottom: 0;
            ">
              Regards,<br />
              <strong>AI Chatbot Team</strong>
            </p>

          </div>


          <!-- Footer -->
          <div style="
            background: #f9fafb;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
          ">

            <p style="
              margin: 0;
              font-size: 13px;
              color: #6b7280;
            ">
              This is an automated email. Please do not reply directly
              to this email.
            </p>

          </div>

        </div>

      </body>
      </html>
    `,
  };
};


export const ticketCreatedEmailTemplate = ({
  fullName,
  ticketId,
  subject,
  description,
  status,
}) => {
  const statusLabel = {
    open: "Open",
    pending: "Pending",
    in_progress: "In Progress",
    resolved: "Resolved",
    closed: "Closed",
  };

  const priorityLabel = {
    low: "Low",
    medium: "Medium",
    high: "High",
    urgent: "Urgent",
  };

  const currentStatus = statusLabel[status] || status || "Open";

  return {
    subject: `Support Ticket Created - #${ticketId}`,

    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />

        <title>Support Ticket Created</title>
      </head>

      <body
        style="
          margin: 0;
          padding: 0;
          background-color: #f4f6f8;
          font-family: Arial, Helvetica, sans-serif;
          color: #333333;
        "
      >

        <div
          style="
            max-width: 700px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
          "
        >

          <!-- Header -->
          <div
            style="
              background: #111827;
              padding: 30px;
              text-align: center;
            "
          >

            <h1
              style="
                margin: 0;
                color: #ffffff;
                font-size: 28px;
              "
            >
              AI Chatbot
            </h1>

            <p
              style="
                margin: 10px 0 0;
                color: #d1d5db;
                font-size: 15px;
              "
            >
              Support Ticket Confirmation
            </p>

          </div>

          <!-- Main Content -->
          <div style="padding: 35px;">

            <h2
              style="
                margin-top: 0;
                color: #111827;
                font-size: 24px;
              "
            >
              Hello ${fullName} 👋
            </h2>

            <p
              style="
                font-size: 16px;
                line-height: 1.7;
              "
            >
              Your support ticket has been successfully created.
              Our support team will review your request and get back
              to you as soon as possible.
            </p>

            <!-- Success Message -->
            <div
              style="
                margin: 25px 0;
                padding: 20px;
                background: #ecfdf5;
                border-left: 4px solid #10b981;
                border-radius: 6px;
              "
            >

              <h3
                style="
                  margin-top: 0;
                  color: #065f46;
                  font-size: 18px;
                "
              >
                ✅ Ticket Created Successfully
              </h3>

              <p
                style="
                  margin-bottom: 0;
                  font-size: 14px;
                  line-height: 1.6;
                  color: #064e3b;
                "
              >
                Please keep your ticket ID for future reference.
                You can use this ID when communicating with our
                support team.
              </p>

            </div>

            <!-- Ticket Details -->
            <div
              style="
                margin: 25px 0;
                padding: 22px;
                background: #f9fafb;
                border: 1px solid #e5e7eb;
                border-radius: 10px;
              "
            >

              <h3
                style="
                  margin-top: 0;
                  color: #111827;
                  font-size: 18px;
                "
              >
                🎫 Ticket Details
              </h3>

              <p style="margin: 10px 0;">
                <strong>Ticket ID:</strong>
                #${ticketId}
              </p>

              <p style="margin: 10px 0;">
                <strong>Subject:</strong>
                ${subject}
              </p>

              <p style="margin: 10px 0;">
                <strong>Status:</strong>

                <span
                  style="
                    display: inline-block;
                    margin-left: 5px;
                    padding: 5px 12px;
                    background: #111827;
                    color: #ffffff;
                    border-radius: 20px;
                    font-size: 13px;
                    font-weight: bold;
                  "
                >
                  ${currentStatus}
                </span>
              </p>
            </div>

            <!-- Description -->
            <div
              style="
                margin: 25px 0;
                padding: 22px;
                background: #f9fafb;
                border: 1px solid #e5e7eb;
                border-radius: 10px;
              "
            >

              <h3
                style="
                  margin-top: 0;
                  color: #111827;
                  font-size: 18px;
                "
              >
                📝 Your Request
              </h3>

              <p
                style="
                  margin-bottom: 0;
                  font-size: 15px;
                  line-height: 1.7;
                  color: #374151;
                  white-space: pre-line;
                "
              >
                ${description || "No description provided."}
              </p>

            </div>

            <!-- Next Steps -->
            <div
              style="
                margin: 25px 0;
                padding: 20px;
                background: #eff6ff;
                border-left: 4px solid #2563eb;
                border-radius: 6px;
              "
            >

              <h3
                style="
                  margin-top: 0;
                  color: #1e3a8a;
                  font-size: 18px;
                "
              >
                📌 What Happens Next?
              </h3>

              <ol
                style="
                  padding-left: 20px;
                  margin-bottom: 0;
                  line-height: 1.8;
                  color: #374151;
                "
              >

                <li>
                  Our support team will review your ticket.
                </li>

                <li>
                  We may contact you if additional information is required.
                </li>

                <li>
                  You will receive an email when your ticket status changes.
                </li>

                <li>
                  You can continue to track your ticket from your dashboard.
                </li>

              </ol>

            </div>

            <!-- Support -->
            <p
              style="
                font-size: 15px;
                line-height: 1.6;
              "
            >
              If you have any additional information regarding this issue,
              please update your ticket from your dashboard or contact
              our support team.
            </p>

            <p
              style="
                margin-top: 30px;
                margin-bottom: 0;
              "
            >
              Regards,<br />
              <strong>AI Chatbot Support Team</strong>
            </p>

          </div>

          <!-- Footer -->
          <div
            style="
              background: #f9fafb;
              padding: 20px;
              text-align: center;
              border-top: 1px solid #e5e7eb;
            "
          >

            <p
              style="
                margin: 0;
                font-size: 13px;
                color: #6b7280;
              "
            >
              This is an automated email. Please do not reply directly
              to this email.
            </p>

          </div>

        </div>

      </body>
      </html>
    `,
  };
};


export const ticketStatusUpdateEmailTemplate = ({
  fullName,
  ticketId,
  subject,
  status,
  previousStatus,
}) => {
  const statusLabel = {
    open: "Open",
    in_progress: "In Progress",
    resolved: "Resolved",
    closed: "Closed",
  };

  const currentStatus = statusLabel[status] || status;
  const oldStatus = statusLabel[previousStatus] || previousStatus;

  return {
    subject: `Ticket #${ticketId} Status Updated - ${currentStatus}`,

    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>Ticket Status Updated</title>
      </head>

      <body
        style="
          margin: 0;
          padding: 0;
          background-color: #f4f6f8;
          font-family: Arial, Helvetica, sans-serif;
          color: #333333;
        "
      >

        <div
          style="
            max-width: 700px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
          "
        >

          <!-- Header -->
          <div
            style="
              background: #111827;
              padding: 30px;
              text-align: center;
            "
          >
            <h1
              style="
                margin: 0;
                color: #ffffff;
                font-size: 28px;
              "
            >
              AI Chatbot
            </h1>

            <p
              style="
                margin: 10px 0 0;
                color: #d1d5db;
                font-size: 15px;
              "
            >
              Support Ticket Update
            </p>
          </div>

          <!-- Main Content -->
          <div style="padding: 35px;">

            <h2
              style="
                margin-top: 0;
                color: #111827;
                font-size: 24px;
              "
            >
              Hello ${fullName} 👋
            </h2>

            <p
              style="
                font-size: 16px;
                line-height: 1.7;
              "
            >
              Your support ticket has been updated by our support team.
              Please find the latest ticket information below.
            </p>

            <!-- Ticket Details -->
            <div
              style="
                margin: 25px 0;
                padding: 22px;
                background: #f9fafb;
                border: 1px solid #e5e7eb;
                border-radius: 10px;
              "
            >

              <h3
                style="
                  margin-top: 0;
                  color: #111827;
                  font-size: 18px;
                "
              >
                🎫 Ticket Details
              </h3>

              <p style="margin: 10px 0;">
                <strong>Ticket ID:</strong>
                #${ticketId}
              </p>

              <p style="margin: 10px 0;">
                <strong>Subject:</strong>
                ${subject}
              </p>

              <p style="margin: 10px 0;">
                <strong>Previous Status:</strong>
                ${oldStatus}
              </p>

              <p style="margin: 10px 0;">
                <strong>Current Status:</strong>

                <span
                  style="
                    display: inline-block;
                    margin-left: 5px;
                    padding: 5px 12px;
                    background: #111827;
                    color: #ffffff;
                    border-radius: 20px;
                    font-size: 13px;
                    font-weight: bold;
                  "
                >
                  ${currentStatus}
                </span>
              </p>

            </div>

            <!-- Status Message -->
            <div
              style="
                margin: 25px 0;
                padding: 20px;
                background: #eff6ff;
                border-left: 4px solid #2563eb;
                border-radius: 6px;
              "
            >

              <h3
                style="
                  margin-top: 0;
                  color: #1e3a8a;
                  font-size: 18px;
                "
              >
                📢 Ticket Status Updated
              </h3>

              <p
                style="
                  margin-bottom: 0;
                  font-size: 14px;
                  line-height: 1.6;
                  color: #374151;
                "
              >
                Your ticket status has been changed from
                <strong>${oldStatus}</strong>
                to
                <strong>${currentStatus}</strong>.
                Our team will continue to assist you based on the current
                status of your request.
              </p>

            </div>

            <!-- Support -->
            <p
              style="
                font-size: 15px;
                line-height: 1.6;
              "
            >
              If you have any additional information regarding this ticket,
              please update the ticket from your dashboard or contact our
              support team.
            </p>

            <p
              style="
                margin-top: 30px;
                margin-bottom: 0;
              "
            >
              Regards,<br />
              <strong>AI Chatbot Support Team</strong>
            </p>

          </div>

          <!-- Footer -->
          <div
            style="
              background: #f9fafb;
              padding: 20px;
              text-align: center;
              border-top: 1px solid #e5e7eb;
            "
          >

            <p
              style="
                margin: 0;
                font-size: 13px;
                color: #6b7280;
              "
            >
              This is an automated email. Please do not reply directly
              to this email.
            </p>

          </div>

        </div>

      </body>
      </html>
    `,
  };
};


export const subscriptionPurchaseEmailTemplate = ({
  fullName,
  businessName,
  planName,
  amount,
  currency = "GBP",
  billingInterval = "month",
  subscriptionId,
  invoiceId,
  invoiceUrl,
  invoicePdf,
}) => {
  return {
    subject: `Subscription Activated - ${planName} | AI Chatbot`,

    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />

        <title>Subscription Activated</title>
      </head>

      <body
        style="
          margin: 0;
          padding: 0;
          background-color: #f4f6f8;
          font-family: Arial, Helvetica, sans-serif;
          color: #333333;
        "
      >

        <div
          style="
            max-width: 700px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
          "
        >

          <!-- Header -->
          <div
            style="
              background: #111827;
              padding: 30px;
              text-align: center;
            "
          >

            <h1
              style="
                margin: 0;
                color: #ffffff;
                font-size: 28px;
              "
            >
              AI Chatbot
            </h1>

            <p
              style="
                margin: 10px 0 0;
                color: #d1d5db;
                font-size: 15px;
              "
            >
              Subscription Confirmation
            </p>

          </div>

          <!-- Main Content -->
          <div style="padding: 35px;">

            <h2
              style="
                margin-top: 0;
                color: #111827;
                font-size: 24px;
              "
            >
              Hello ${fullName} 👋
            </h2>

            <p
              style="
                font-size: 16px;
                line-height: 1.7;
              "
            >
              Your AI Chatbot subscription has been successfully
              activated.
              Thank you for choosing AI Chatbot for your business.
            </p>

            <!-- Success Message -->
            <div
              style="
                margin: 25px 0;
                padding: 20px;
                background: #ecfdf5;
                border-left: 4px solid #10b981;
                border-radius: 6px;
              "
            >

              <h3
                style="
                  margin-top: 0;
                  color: #065f46;
                  font-size: 18px;
                "
              >
                ✅ Subscription Activated Successfully
              </h3>

              <p
                style="
                  margin-bottom: 0;
                  font-size: 14px;
                  line-height: 1.6;
                  color: #064e3b;
                "
              >
                Your subscription is now active and you can start
                using the features included in your selected plan.
              </p>

            </div>

            <!-- Subscription Details -->
            <div
              style="
                margin: 25px 0;
                padding: 22px;
                background: #f9fafb;
                border: 1px solid #e5e7eb;
                border-radius: 10px;
              "
            >

              <h3
                style="
                  margin-top: 0;
                  color: #111827;
                  font-size: 18px;
                "
              >
                💳 Subscription Details
              </h3>

              <p style="margin: 10px 0;">
                <strong>Business:</strong>
                ${businessName || "N/A"}
              </p>

              <p style="margin: 10px 0;">
                <strong>Plan:</strong>
                ${planName}
              </p>

              <p style="margin: 10px 0;">
                <strong>Amount:</strong>
                ${currency} ${amount}
              </p>

              <p style="margin: 10px 0;">
                <strong>Billing:</strong>
                ${billingInterval}
              </p>

              ${subscriptionId
                ? `
                            <p style="margin: 10px 0;">
                              <strong>Subscription ID:</strong>
                              ${subscriptionId}
                            </p>
                          `
                : ""
              }

              ${invoiceId
                ? `
                            <p style="margin: 10px 0;">
                              <strong>Invoice ID:</strong>
                              ${invoiceId}
                            </p>
                          `
                : ""
              }

            </div>

            ${
              invoiceUrl
                ? `
                  <div
                    style="
                      margin: 30px 0;
                      text-align: center;
                    "
                  >
                    <a
                      href="${invoiceUrl}"
                      target="_blank"
                      style="
                        display: inline-block;
                        padding: 13px 25px;
                        background-color: #111827;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 7px;
                        font-size: 15px;
                        font-weight: bold;
                      "
                    >
                      View Invoice
                    </a>
                  </div>
                `
                : ""
            }

            ${
              invoicePdf
                ? `
                  <div
                    style="
                      margin: 15px 0;
                      text-align: center;
                    "
                  >
                    <a
                      href="${invoicePdf}"
                      target="_blank"
                      style="
                        display: inline-block;
                        padding: 13px 25px;
                        background-color: #2563eb;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 7px;
                        font-size: 15px;
                        font-weight: bold;
                      "
                    >
                      Download Invoice PDF
                    </a>
                  </div>
                `
                : ""
            }

            <!-- Features -->
            <div
              style="
                margin: 25px 0;
                padding: 20px;
                background: #eff6ff;
                border-left: 4px solid #2563eb;
                border-radius: 6px;
              "
            >

              <h3
                style="
                  margin-top: 0;
                  color: #1e3a8a;
                  font-size: 18px;
                "
              >
                🚀 What's Next?
              </h3>

              <ol
                style="
                  padding-left: 20px;
                  margin-bottom: 0;
                  line-height: 1.8;
                  color: #374151;
                "
              >

                <li>
                  Login to your AI Chatbot dashboard.
                </li>

                <li>
                  Configure your chatbot according to your business.
                </li>

                <li>
                  Add your FAQs, products and services.
                </li>

                <li>
                  Start using the features available in your plan.
                </li>

              </ol>

            </div>

            <p
              style="
                font-size: 15px;
                line-height: 1.6;
              "
            >
              If you have any questions regarding your subscription,
              billing, or plan features, please contact our support team.
            </p>

            <p
              style="
                margin-top: 30px;
                margin-bottom: 0;
              "
            >
              Regards,<br />
              <strong>AI Chatbot Team</strong>
            </p>

          </div>

          <!-- Footer -->
          <div
            style="
              background: #f9fafb;
              padding: 20px;
              text-align: center;
              border-top: 1px solid #e5e7eb;
            "
          >

            <p
              style="
                margin: 0;
                font-size: 13px;
                color: #6b7280;
              "
            >
              This is an automated email. Please do not reply directly
              to this email.
            </p>

          </div>

        </div>

      </body>
      </html>
    `,
  };
};


export const subscriptionPlanChangedEmailTemplate = ({
  fullName,
  oldPlanName,
  newPlanName,
  changeType,
  amount,
  currency = "GBP",
  billingInterval = "month",
  subscriptionId,
  invoiceId,
  invoiceUrl,
  invoicePdf,
}) => {
  const isUpgrade = changeType === "upgrade";

  const changeTitle = isUpgrade
    ? "Subscription Upgraded Successfully"
    : "Subscription Downgraded Successfully";

  const changeIcon = isUpgrade ? "🚀" : "🔄";

  return {
    subject: `${changeTitle} - ${newPlanName} | AI Chatbot`,

    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>${changeTitle}</title>
      </head>

      <body
        style="
          margin: 0;
          padding: 0;
          background-color: #f4f6f8;
          font-family: Arial, Helvetica, sans-serif;
          color: #333333;
        "
      >

        <div
          style="
            max-width: 700px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
          "
        >

          <!-- Header -->
          <div
            style="
              background: #111827;
              padding: 30px;
              text-align: center;
            "
          >
            <h1
              style="
                margin: 0;
                color: #ffffff;
                font-size: 28px;
              "
            >
              AI Chatbot
            </h1>

            <p
              style="
                margin: 10px 0 0;
                color: #d1d5db;
                font-size: 15px;
              "
            >
              Subscription Plan Update
            </p>
          </div>

          <!-- Main Content -->
          <div style="padding: 35px;">

            <h2
              style="
                margin-top: 0;
                color: #111827;
                font-size: 24px;
              "
            >
              Hello ${fullName} 👋
            </h2>

            <p
              style="
                font-size: 16px;
                line-height: 1.7;
              "
            >
              Your AI Chatbot subscription plan has been successfully
              changed.
            </p>

            <!-- Success -->
            <div
              style="
                margin: 25px 0;
                padding: 20px;
                background: ${
                  isUpgrade ? "#ecfdf5" : "#eff6ff"
                };
                border-left: 4px solid ${
                  isUpgrade ? "#10b981" : "#2563eb"
                };
                border-radius: 6px;
              "
            >

              <h3
                style="
                  margin-top: 0;
                  color: ${
                    isUpgrade ? "#065f46" : "#1e3a8a"
                  };
                  font-size: 18px;
                "
              >
                ${changeIcon} ${changeTitle}
              </h3>

              <p
                style="
                  margin-bottom: 0;
                  font-size: 14px;
                  line-height: 1.6;
                  color: #374151;
                "
              >
                Your subscription has been changed from
                <strong>${oldPlanName}</strong>
                to
                <strong>${newPlanName}</strong>.
              </p>

            </div>

            <!-- Plan Change -->
            <div
              style="
                margin: 25px 0;
                padding: 22px;
                background: #f9fafb;
                border: 1px solid #e5e7eb;
                border-radius: 10px;
              "
            >

              <h3
                style="
                  margin-top: 0;
                  color: #111827;
                  font-size: 18px;
                "
              >
                📋 Plan Change Details
              </h3>

              <p style="margin: 10px 0;">
                <strong>Previous Plan:</strong>
                ${oldPlanName}
              </p>

              <p style="margin: 10px 0;">
                <strong>New Plan:</strong>
                ${newPlanName}
              </p>

              <p style="margin: 10px 0;">
                <strong>Change Type:</strong>

                <span
                  style="
                    display: inline-block;
                    margin-left: 5px;
                    padding: 5px 12px;
                    background: ${
                      isUpgrade ? "#dcfce7" : "#dbeafe"
                    };
                    color: ${
                      isUpgrade ? "#166534" : "#1e40af"
                    };
                    border-radius: 20px;
                    font-size: 13px;
                    font-weight: bold;
                  "
                >
                  ${
                    isUpgrade
                      ? "Upgrade"
                      : "Downgrade"
                  }
                </span>
              </p>

              <p style="margin: 10px 0;">
                <strong>Amount:</strong>
                ${currency} ${amount}
              </p>

              <p style="margin: 10px 0;">
                <strong>Billing:</strong>
                ${billingInterval}
              </p>

            </div>

            <!-- Payment Details -->
            ${
              invoiceId || subscriptionId
                ? `
                  <div
                    style="
                      margin: 25px 0;
                      padding: 22px;
                      background: #f9fafb;
                      border: 1px solid #e5e7eb;
                      border-radius: 10px;
                    "
                  >

                    <h3
                      style="
                        margin-top: 0;
                        color: #111827;
                        font-size: 18px;
                      "
                    >
                      💳 Payment Details
                    </h3>

                    ${
                      subscriptionId
                        ? `
                          <p style="margin: 10px 0;">
                            <strong>Subscription ID:</strong>
                            ${subscriptionId}
                          </p>
                        `
                        : ""
                    }

                    ${
                      invoiceId
                        ? `
                          <p style="margin: 10px 0;">
                            <strong>Invoice ID:</strong>
                            ${invoiceId}
                          </p>
                        `
                        : ""
                    }

                  </div>
                `
                : ""
            }

            <!-- Invoice -->
            ${
              invoiceUrl
                ? `
                  <div
                    style="
                      margin: 30px 0;
                      text-align: center;
                    "
                  >
                    <a
                      href="${invoiceUrl}"
                      target="_blank"
                      style="
                        display: inline-block;
                        padding: 13px 25px;
                        background-color: #111827;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 7px;
                        font-size: 15px;
                        font-weight: bold;
                      "
                    >
                      View Invoice
                    </a>
                  </div>
                `
                : ""
            }

            ${
              invoicePdf
                ? `
                  <div
                    style="
                      margin: 15px 0 30px;
                      text-align: center;
                    "
                  >
                    <a
                      href="${invoicePdf}"
                      target="_blank"
                      style="
                        display: inline-block;
                        padding: 13px 25px;
                        background-color: #2563eb;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 7px;
                        font-size: 15px;
                        font-weight: bold;
                      "
                    >
                      Download Invoice PDF
                    </a>
                  </div>
                `
                : ""
            }

            <!-- Next Steps -->
            <div
              style="
                margin: 25px 0;
                padding: 20px;
                background: #eff6ff;
                border-left: 4px solid #2563eb;
                border-radius: 6px;
              "
            >

              <h3
                style="
                  margin-top: 0;
                  color: #1e3a8a;
                  font-size: 18px;
                "
              >
                📌 What's Next?
              </h3>

              <p
                style="
                  margin-bottom: 0;
                  font-size: 14px;
                  line-height: 1.6;
                  color: #374151;
                "
              >
                ${
                  isUpgrade
                    ? "Your new plan features are now available. You can continue using your AI Chatbot with the upgraded limits and features."
                    : "Your subscription has been moved to the new plan. Your account will continue according to the features and limits of the selected plan."
                }
              </p>

            </div>

            <p
              style="
                font-size: 15px;
                line-height: 1.6;
              "
            >
              If you have any questions regarding your subscription
              or billing, please contact our support team.
            </p>

            <p
              style="
                margin-top: 30px;
                margin-bottom: 0;
              "
            >
              Regards,<br />
              <strong>AI Chatbot Team</strong>
            </p>

          </div>

          <!-- Footer -->
          <div
            style="
              background: #f9fafb;
              padding: 20px;
              text-align: center;
              border-top: 1px solid #e5e7eb;
            "
          >

            <p
              style="
                margin: 0;
                font-size: 13px;
                color: #6b7280;
              "
            >
              This is an automated email. Please do not reply directly
              to this email.
            </p>

          </div>

        </div>

      </body>
      </html>
    `,
  };
};


export const subscriptionCancellationEmailTemplate = ({
  fullName,
  businessName,
  planName,
  subscriptionId,
  cancellationDate,
  amount,
  currency = "GBP",
  billingInterval = "Monthly",
}) => {
  return {
    subject: `Subscription Cancelled - ${planName} | AI Chatbot`,

    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />

        <title>Subscription Cancelled</title>
      </head>

      <body
        style="
          margin: 0;
          padding: 0;
          background-color: #f4f6f8;
          font-family: Arial, Helvetica, sans-serif;
          color: #333333;
        "
      >

        <div
          style="
            max-width: 700px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
          "
        >

          <!-- Header -->
          <div
            style="
              background: #111827;
              padding: 30px;
              text-align: center;
            "
          >

            <h1
              style="
                margin: 0;
                color: #ffffff;
                font-size: 28px;
              "
            >
              AI Chatbot
            </h1>

            <p
              style="
                margin: 10px 0 0;
                color: #d1d5db;
                font-size: 15px;
              "
            >
              Subscription Cancellation
            </p>

          </div>

          <!-- Main Content -->
          <div style="padding: 35px;">

            <h2
              style="
                margin-top: 0;
                color: #111827;
                font-size: 24px;
              "
            >
              Hello ${fullName} 👋
            </h2>

            <p
              style="
                font-size: 16px;
                line-height: 1.7;
              "
            >
              We're confirming that your AI Chatbot subscription
              has been successfully cancelled.
            </p>

            <!-- Cancellation Success -->
            <div
              style="
                margin: 25px 0;
                padding: 20px;
                background: #fef2f2;
                border-left: 4px solid #ef4444;
                border-radius: 6px;
              "
            >

              <h3
                style="
                  margin-top: 0;
                  color: #991b1b;
                  font-size: 18px;
                "
              >
                ❌ Subscription Cancelled
              </h3>

              <p
                style="
                  margin-bottom: 0;
                  font-size: 14px;
                  line-height: 1.6;
                  color: #7f1d1d;
                "
              >
                Your subscription has been cancelled successfully.
                Your account will no longer have access to the
                subscription plan features.
              </p>

            </div>

            <!-- Subscription Details -->
            <div
              style="
                margin: 25px 0;
                padding: 22px;
                background: #f9fafb;
                border: 1px solid #e5e7eb;
                border-radius: 10px;
              "
            >

              <h3
                style="
                  margin-top: 0;
                  color: #111827;
                  font-size: 18px;
                "
              >
                📋 Cancelled Subscription Details
              </h3>

              <p style="margin: 10px 0;">
                <strong>Business:</strong>
                ${businessName || "N/A"}
              </p>

              <p style="margin: 10px 0;">
                <strong>Plan:</strong>
                ${planName || "N/A"}
              </p>

              <p style="margin: 10px 0;">
                <strong>Amount:</strong>
                ${currency} ${amount || 0}
              </p>

              <p style="margin: 10px 0;">
                <strong>Billing:</strong>
                ${billingInterval}
              </p>

              ${
                subscriptionId
                  ? `
                    <p style="margin: 10px 0;">
                      <strong>Subscription ID:</strong>
                      ${subscriptionId}
                    </p>
                  `
                  : ""
              }

              ${
                cancellationDate
                  ? `
                    <p style="margin: 10px 0;">
                      <strong>Cancellation Date:</strong>
                      ${cancellationDate}
                    </p>
                  `
                  : ""
              }

            </div>

            <!-- Account Information -->
            <div
              style="
                margin: 25px 0;
                padding: 20px;
                background: #eff6ff;
                border-left: 4px solid #2563eb;
                border-radius: 6px;
              "
            >

              <h3
                style="
                  margin-top: 0;
                  color: #1e3a8a;
                  font-size: 18px;
                "
              >
                ℹ️ What Happens Next?
              </h3>

              <ul
                style="
                  padding-left: 20px;
                  margin-bottom: 0;
                  line-height: 1.8;
                  color: #374151;
                "
              >

                <li>
                  Your current subscription has been cancelled.
                </li>

                <li>
                  Your subscription plan has been removed from your account.
                </li>

                <li>
                  You can purchase a new subscription whenever you need.
                </li>

                <li>
                  Your account can continue using features available
                  without an active subscription.
                </li>

              </ul>

            </div>

            <!-- Re-subscribe -->
            <div
              style="
                margin: 25px 0;
                padding: 20px;
                background: #f9fafb;
                border: 1px solid #e5e7eb;
                border-radius: 10px;
                text-align: center;
              "
            >

              <h3
                style="
                  margin-top: 0;
                  color: #111827;
                  font-size: 18px;
                "
              >
                🔄 Changed Your Mind?
              </h3>

              <p
                style="
                  font-size: 14px;
                  line-height: 1.6;
                  color: #4b5563;
                "
              >
                You can subscribe to a new AI Chatbot plan anytime
                from your dashboard.
              </p>

            </div>

            <p
              style="
                font-size: 15px;
                line-height: 1.6;
              "
            >
              If you cancelled your subscription by mistake or have
              any questions regarding your billing, please contact
              our support team.
            </p>

            <p
              style="
                margin-top: 30px;
                margin-bottom: 0;
              "
            >
              Regards,<br />
              <strong>AI Chatbot Team</strong>
            </p>

          </div>

          <!-- Footer -->
          <div
            style="
              background: #f9fafb;
              padding: 20px;
              text-align: center;
              border-top: 1px solid #e5e7eb;
            "
          >

            <p
              style="
                margin: 0;
                font-size: 13px;
                color: #6b7280;
              "
            >
              This is an automated email. Please do not reply directly
              to this email.
            </p>

          </div>

        </div>

      </body>
      </html>
    `,
  };
};


export const subscriptionExpiredEmailTemplate = ({
  fullName,
  businessName,
  planName,
  expiredDate,
}) => {
  return {
    subject: `Your AI Chatbot Subscription Has Expired`,

    html: `
      <!DOCTYPE html>
      <html>

      <head>
        <meta charset="UTF-8" />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />

        <title>Subscription Expired</title>
      </head>

      <body
        style="
          margin: 0;
          padding: 0;
          background-color: #f4f6f8;
          font-family: Arial, Helvetica, sans-serif;
          color: #333333;
        "
      >

        <div
          style="
            max-width: 700px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
          "
        >

          <!-- Header -->
          <div
            style="
              background: #111827;
              padding: 30px;
              text-align: center;
            "
          >

            <h1
              style="
                margin: 0;
                color: #ffffff;
                font-size: 28px;
              "
            >
              AI Chatbot
            </h1>

            <p
              style="
                margin: 10px 0 0;
                color: #d1d5db;
                font-size: 15px;
              "
            >
              Subscription Expiration
            </p>

          </div>

          <!-- Main -->
          <div style="padding: 35px;">

            <h2
              style="
                margin-top: 0;
                color: #111827;
                font-size: 24px;
              "
            >
              Hello ${fullName} 👋
            </h2>

            <p
              style="
                font-size: 16px;
                line-height: 1.7;
              "
            >
              Your AI Chatbot subscription has expired.
            </p>

            <!-- Expired -->
            <div
              style="
                margin: 25px 0;
                padding: 20px;
                background: #fef2f2;
                border-left: 4px solid #ef4444;
                border-radius: 6px;
              "
            >

              <h3
                style="
                  margin-top: 0;
                  color: #991b1b;
                  font-size: 18px;
                "
              >
                ⏰ Subscription Expired
              </h3>

              <p
                style="
                  margin-bottom: 0;
                  font-size: 14px;
                  line-height: 1.6;
                  color: #7f1d1d;
                "
              >
                Your subscription period has ended and your
                subscription is no longer active.
              </p>

            </div>

            <!-- Details -->
            <div
              style="
                margin: 25px 0;
                padding: 22px;
                background: #f9fafb;
                border: 1px solid #e5e7eb;
                border-radius: 10px;
              "
            >

              <h3
                style="
                  margin-top: 0;
                  color: #111827;
                  font-size: 18px;
                "
              >
                📋 Subscription Details
              </h3>

              <p style="margin: 10px 0;">
                <strong>Business:</strong>
                ${businessName || "N/A"}
              </p>

              <p style="margin: 10px 0;">
                <strong>Plan:</strong>
                ${planName || "N/A"}
              </p>

              <p style="margin: 10px 0;">
                <strong>Expired On:</strong>
                ${expiredDate}
              </p>

            </div>

            <!-- CTA -->
            <div
              style="
                margin: 25px 0;
                padding: 20px;
                background: #eff6ff;
                border-left: 4px solid #2563eb;
                border-radius: 6px;
              "
            >

              <h3
                style="
                  margin-top: 0;
                  color: #1e3a8a;
                  font-size: 18px;
                "
              >
                🔄 Want to Continue?
              </h3>

              <p
                style="
                  font-size: 14px;
                  line-height: 1.6;
                  color: #374151;
                "
              >
                You can purchase a new subscription from your
                AI Chatbot dashboard and continue using our
                services.
              </p>

            </div>

            <p
              style="
                font-size: 15px;
                line-height: 1.6;
              "
            >
              If you have any questions regarding your subscription,
              billing, or plan, please contact our support team.
            </p>

            <p
              style="
                margin-top: 30px;
                margin-bottom: 0;
              "
            >
              Regards,<br />
              <strong>AI Chatbot Team</strong>
            </p>

          </div>

          <!-- Footer -->
          <div
            style="
              background: #f9fafb;
              padding: 20px;
              text-align: center;
              border-top: 1px solid #e5e7eb;
            "
          >

            <p
              style="
                margin: 0;
                font-size: 13px;
                color: #6b7280;
              "
            >
              This is an automated email. Please do not reply directly
              to this email.
            </p>

          </div>

        </div>

      </body>
      </html>
    `,
  };
};