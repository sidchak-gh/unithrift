import nodemailer from "nodemailer";

// Lazy transporter creation to avoid initializing with bad/default values if not needed
const getTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Gmail App Password (16 chars)
    },
  });
};

const printOtpConsole = (to, otp) => {
  console.log("\n==================================================");
  console.log("📧  [MAILER] MOCK EMAIL SENT");
  console.log(`👉  Recipient: ${to}`);
  console.log(`🔑  OTP Code:  ${otp}`);
  console.log("==================================================\n");
};

export const sendOtpEmail = async (to, otp, name) => {
  const isPlaceholder = !process.env.EMAIL_PASS || process.env.EMAIL_PASS === "your_16_char_app_password";

  if (isPlaceholder) {
    console.warn("⚠️  [MAILER] Using mock email mode because EMAIL_PASS in server/.env is not configured.");
    printOtpConsole(to, otp);
    return;
  }

  const mailOptions = {
    from: `"UniThrift" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your UniThrift Verification Code",
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
        <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 32px 40px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">UniThrift</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 6px 0 0; font-size: 14px;">Campus Marketplace</p>
        </div>
        <div style="padding: 40px;">
          <h2 style="color: #1e293b; font-size: 20px; margin: 0 0 8px;">Hey ${name || "there"} 👋</h2>
          <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 28px;">
            Thanks for signing up! Use the code below to verify your email address. It expires in <strong>10 minutes</strong>.
          </p>
          <div style="background: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 10px; padding: 24px; text-align: center; margin-bottom: 28px;">
            <span style="font-size: 42px; font-weight: 800; letter-spacing: 12px; color: #4f46e5; font-family: monospace;">${otp}</span>
          </div>
          <p style="color: #94a3b8; font-size: 13px; margin: 0;">
            If you didn't create an account with UniThrift, you can safely ignore this email.
          </p>
        </div>
        <div style="background: #f1f5f9; padding: 16px 40px; text-align: center;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} UniThrift. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    const transporter = getTransporter();
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("❌  [MAILER] Failed to send email via SMTP:", error.message);
    console.warn("⚠️  [MAILER] Falling back to console OTP logging so registration can proceed.");
    printOtpConsole(to, otp);
  }
};
