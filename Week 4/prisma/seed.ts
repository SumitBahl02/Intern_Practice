import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // Create regular user
  const userPassword = await bcrypt.hash("user123", 10);
  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      name: "John Doe",
      password: userPassword,
      role: "USER",
    },
  });

  // Create sample project
  const project = await prisma.project.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "E-commerce Platform",
      description:
        "Online shopping platform with user authentication and payment processing",
      status: "ACTIVE",
      userId: admin.id,
    },
  });

  // Create sample tasks
  await prisma.task.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: "Setup Authentication",
      description: "Implement JWT authentication system",
      status: "COMPLETED",
      priority: "HIGH",
      userId: admin.id,
      projectId: project.id,
    },
  });

  await prisma.task.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: "Create Product Catalog",
      description: "Build product management system",
      status: "IN_PROGRESS",
      priority: "MEDIUM",
      userId: user.id,
      projectId: project.id,
    },
  });

  console.log("SUCCESS: Database seeded successfully!");
  console.log("Admin login: admin@example.com / admin123");
  console.log("User login: user@example.com / user123");
}

main()
  .catch((e) => {
    console.error("ERROR: Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
