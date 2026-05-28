import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./db/schema";
import { sendMail, templateVerifikasi, templateResetSandi } from "./mailer";

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
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      try {
        await sendMail({
          to: user.email,
          subject: "Reset Kata Sandi Akun Anda – Katedral Santo Yosef",
          html: templateResetSandi(user.name, url),
        });
      } catch (error) {
        console.error("Gagal mengirim email reset password:", error);
      }
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      try {
        // Replace localhost with actual production URL if needed
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const fixedUrl = url.replace(/^https?:\/\/localhost(:\d+)?/, appUrl.replace(/\/$/, ""));
        await sendMail({
          to: user.email,
          subject: "Verifikasi Alamat Email Anda – Katedral Santo Yosef",
          html: templateVerifikasi(user.name, fixedUrl),
        });
      } catch (error) {
        console.error("Gagal mengirim email verifikasi:", error);
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
