const nodemailer = require("nodemailer");

const sendEmailNotification = async (messageData) => {
  const { name, email, subject, message } = messageData;

  const smtpEmail = process.env.SMTP_EMAIL;
  const smtpPassword = process.env.SMTP_PASSWORD;
  const adminEmail = process.env.ADMIN_EMAIL || "khuntjainish48@gmail.com";

  if (!smtpEmail || !smtpPassword) {
    console.warn("⚠️ SMTP credentials missing in .env. Skipping email notification.");
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpEmail,
        pass: smtpPassword,
      },
    });

    const mailOptions = {
      from: `"${name}" <${smtpEmail}>`,
      to: adminEmail,
      replyTo: email,
      subject: `Portfolio Contact: ${subject || "No Subject"}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #06b6d4; color: white; padding: 1.5rem; text-align: center;">
            <h2 style="margin: 0;">New Contact Form Inquiry</h2>
          </div>
          <div style="padding: 1.5rem;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Subject:</strong> ${subject || "N/A"}</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 1.5rem 0;" />
            <p><strong>Message:</strong></p>
            <div style="background-color: #f9f9f9; padding: 1rem; border-radius: 6px; border: 1px solid #f0f0f0; font-style: italic;">
              "${message}"
            </div>
          </div>
          <div style="background-color: #f4f4f4; color: #888; text-align: center; padding: 1rem; font-size: 0.8rem;">
            Sent from Jainish Khunt MERN Portfolio Application
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ Email notification sent successfully: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("🔴 Failed to send email notification via SMTP:", error.message);
    return false;
  }
};

module.exports = sendEmailNotification;
