import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcrypt";

const adapter = new PrismaBetterSqlite3({
  url: "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash("password", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@dentpro.mn" },
    update: {},
    create: {
      email: "admin@dentpro.mn",
      name: "Админ",
      password: hashedPassword,
      role: "ADMIN",
      phone: "99001122",
    },
  });

  const doctor = await prisma.user.upsert({
    where: { email: "doctor@dentpro.mn" },
    update: {},
    create: {
      email: "doctor@dentpro.mn",
      name: "Д. Батболд",
      password: hashedPassword,
      role: "DOCTOR",
      phone: "99112233",
    },
  });

  console.log("Seed амжилттай:", { admin: admin.email, doctor: doctor.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
