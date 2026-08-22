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
