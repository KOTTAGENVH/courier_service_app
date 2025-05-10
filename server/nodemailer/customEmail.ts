import nodemailer, { Transporter } from "nodemailer";

interface CustomEmailProps {
  email: string;
  subject: string;
  body: string;
}

export const customEmail = async (
  { email, subject, body }: CustomEmailProps
): Promise<boolean> => {
  console.log("sending email");
  try {
    const senderEmail = process.env.EMAIL!;
    const password = process.env.PASS!;

    // Create a transporter with Gmail service
    const mailTransporter: Transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: senderEmail,
        pass: password,
      },
    });

    const mailDetails = {
      from: senderEmail,
      to: email,
      subject,
      text: body,
    };

    await mailTransporter.sendMail(mailDetails);
    console.log("Email sent successfully");
    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error sending email:", error.message);
    } else {
      console.error("Unknown error sending email");
    }
    return false;
  }
};
