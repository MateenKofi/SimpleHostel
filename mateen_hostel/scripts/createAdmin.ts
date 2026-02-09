import prisma from "../src/utils/prisma";
import { hashPassword } from "../src/utils/bcrypt";
import { Role } from "@prisma/client";

/**
 * Script to create an admin user
 * Run with: npx tsx scripts/createAdmin.ts
 */

async function createAdminUser() {
  const email = "xasojar971@bipochub.com";
  const password = "password123";
  const name = "Fuse Admin";
  const phone = "0200000001";

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      if (existingUser.deletedAt) {
        // Restore soft-deleted user
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            deletedAt: null,
            password: await hashPassword(password),
          },
        });
        console.log(`✅ User ${email} restored and password updated.`);
      } else {
        console.log(`❌ User ${email} already exists and is active.`);
      }
      return;
    }

    // Create new admin user
    const hashedPassword = await hashPassword(password);

    await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone,
        role: Role.admin,
        adminProfile: {
          create: {
            position: "Administrator",
          },
        },
      },
    });

    console.log(`✅ Admin user created successfully!`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
