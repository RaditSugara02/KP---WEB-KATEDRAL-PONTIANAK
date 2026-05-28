import { config } from "dotenv";
config({ path: ".env.local" });

const { db } = require("../lib/db/index");
const { users, coupleProfiles, marriageApplications, requiredDocuments, stageHistory, notifications, sessions, accounts } = require("../lib/db/schema");
const { ne } = require("drizzle-orm");

async function main() {
  console.log("Menghapus semua data pendaftaran & profil...");
  try {
    await db.delete(stageHistory);
    await db.delete(requiredDocuments);
    await db.delete(marriageApplications);
    await db.delete(coupleProfiles);
    await db.delete(notifications);
    await db.delete(sessions);
    await db.delete(accounts);

    console.log("Menghapus akun non-admin...");
    const result = await db.delete(users).where(ne(users.role, "ADMIN")).returning();
    console.log(`Berhasil menghapus ${result.length} akun pengguna.`);
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
  }
  process.exit(0);
}

main();
