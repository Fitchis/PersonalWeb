import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/verify?token=${token}`;
  await resend.emails.send({
    from: "onboarding@resend.dev", // Development only
    to: "fitchisbox@gmail.com", // Use a verified sender from Resend
    // to: email, // Uncomment this line in production
    subject: "Verify your email",
    html: `
      <h2>Verify your email</h2>
      <p>Click the link below to verify your account:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
      <p>This link will expire in 24 hours.</p>
    `,
  });
}
