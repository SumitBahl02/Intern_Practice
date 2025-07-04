import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/**
 * Resets user passwords to default values for development/testing
 */
async function resetUserPasswords(): Promise<void> {
  console.log("Resetting user passwords...");

  try {
    // Update user@example.com password to 'user123'
    const userPassword = await bcrypt.hash("user123", 10);
    await prisma.user.update({
      where: { email: "user@example.com" },
      data: { password: userPassword },
    });

    // Update admin@example.com password to 'admin123'
    const adminPassword = await bcrypt.hash("admin123", 10);
    await prisma.user.update({
      where: { email: "admin@example.com" },
      data: { password: adminPassword },
    });

    console.log("SUCCESS: User passwords reset successfully!");
    console.log("User login: user@example.com / user123");
    console.log("Admin login: admin@example.com / admin123");
  } catch (error) {
    console.error("ERROR: Failed to reset passwords:", error);
    throw error;
  }
}

resetUserPasswords()
  .catch((e) => {
    console.error("FATAL: Error resetting passwords:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
