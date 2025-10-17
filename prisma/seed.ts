import { PrismaClient } from "@prisma/client";
import { runSeed } from "../src/lib/seed-utils";

const prisma = new PrismaClient();

const main = async () => {
  try {
    await runSeed(prisma);
  } catch (error) {
    console.error("Error during seeding:", error);
    throw error;
  }
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });