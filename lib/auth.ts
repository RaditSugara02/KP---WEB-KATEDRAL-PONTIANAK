import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./db/schema";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
    // Skip email verification for local development
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url, token }, request) => {
      try {
        await resend.emails.send({
          from: "Katedral Santo Yosef <onboarding@resend.dev>",
          to: user.email,
          subject: "Reset Kata Sandi Akun Anda",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #3D2B1F;">Halo, ${user.name}</h2>
              <p>Kami menerima permintaan untuk mereset kata sandi akun Anda di Sistem Informasi Katedral Santo Yosef.</p>
              <p>Silakan klik tombol di bawah ini untuk membuat kata sandi baru:</p>
              <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #B8960C; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 20px 0;">Reset Kata Sandi</a>
              <p>Jika Anda tidak pernah meminta reset kata sandi, abaikan email ini.</p>
              <p style="color: #6B6560; font-size: 12px; margin-top: 40px;">Tuhan memberkati,<br>Sekretariat Paroki Katedral Santo Yosef</p>
            </div>
          `,
        });
      } catch (error) {
        console.error("Gagal mengirim email reset password:", error);
      }
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "credential", "email-password"],
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "COUPLE",
        input: false, // Don't allow user to set role during signup
      },
    },
  },
  session: {
    // Include role in session for easy access
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
});

export type Session = typeof auth.$Infer.Session;
