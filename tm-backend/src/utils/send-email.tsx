import nodemailer from "nodemailer";
import { NODE_ENV } from "../constants";

const isProduction = NODE_ENV === "production";

const devTransporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // e.g., smtp.gmail.com
  port: Number(process.env.EMAIL_PORT), // e.g., 587
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // email password or app password
  },
});

export const sendResetPasswordEmail = async (email: string, url: string) => {
  const subject = "Password Reset Request";
  const htmlContent = `
    <p>You requested a password reset.</p>
    <p>Click the link below to reset your password:</p>
    <a href="${url}" target="_blank">${url}</a>
    <p>If you did not request this, please ignore this email.</p>
    <p>This link will expire in 15 minutes.</p>
  `;

  try {
    if (isProduction) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      const { data, error } = await resend.emails.send({
        from: process.env.RESEND_SENDER_EMAIL!,
        to: [email],
        subject,
        html: htmlContent,
      });

      if (error) throw error;
      console.log(`Email sent via Resend. ID: ${data?.id}`);

      console.log(`Password reset email sent to ${email} via SendGrid`);
    } else {
      await devTransporter.sendMail({
        from: `"Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject,
        html: htmlContent,
      });
      console.log(`Password reset email sent to ${email} via Nodemailer`);
    }
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Could not send reset password email");
  }
};
