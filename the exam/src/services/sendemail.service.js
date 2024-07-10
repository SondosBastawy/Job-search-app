import nodeMailer from "nodemailer";

export const sendEmailService = async ({
  to = "",
  subject = "",
  textMessage = "",
  htmlMessage = "",
  attachments = [],
} = {}) => {
  // transporter configuration
  const transporter = nodeMailer.createTransport({
    host: "localhost",
    port: 587,
    secure: false,
    auth: {
      user: "sondosbastawy3@gmail.com",
      pass: "mezdufkmydhyjcgr",
    },
    service: "gmail",
    tls: {
      rejectUnauthorized: false,
    },
  });
  const info = await transporter.sendMail({
    from: "no-reply < sondosbastawy3@gmail.com >",
    to,
    subject,
    text: textMessage,
    html: htmlMessage,
    attachments,
  });
  return info;
};
