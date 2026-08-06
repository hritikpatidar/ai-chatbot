export const otpEmailTemplate = (otp) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border:1px solid #ddd; border-radius:8px; overflow:hidden;">
      
      <div style="background:#2563eb;padding:20px;text-align:center;color:#fff;">
        <h2>AI Chatbot</h2>
      </div>

      <div style="padding:30px;">
        <h3>Hello 👋</h3>

        <p>Your One Time Password (OTP) is:</p>

        <div style="
          font-size:32px;
          font-weight:bold;
          letter-spacing:8px;
          color:#2563eb;
          text-align:center;
          margin:25px 0;
        ">
          ${otp}
        </div>

        <p>
          This OTP will expire in
          <strong>10 minutes</strong>.
        </p>

        <p>
          If you didn't request this OTP, please ignore this email.
        </p>

        <br>

        <p>
          Regards,<br>
          <strong>AI Chatbot Team</strong>
        </p>
      </div>

    </div>
  `;
};