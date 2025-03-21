// lib/email.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "your_smtp_host",
  port: 587,
  secure: false,
  auth: {
    user: "your_email",
    pass: "your_email_password",
  },
});

export async function sendNewMessageNotification(
  to: string,
  conversationId: string
) {
  const mailOptions = {
    from: "your_email",
    to,
    subject: "New Message Received",
    html: `<p>A new message has been received in conversation ${conversationId}. <a href="https://your-vercel-app-name.vercel.app/dashboard">View it here</a></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to} for conversation ${conversationId}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
