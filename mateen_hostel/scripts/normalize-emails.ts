import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * This script normalizes all existing emails in the database to lowercase
 * to fix the email case sensitivity issue that prevents login.
 */
async function normalizeEmails() {
    try {
        console.log('Starting email normalization...\n');

        // 1. Normalize hostel emails
        const hostels = await prisma.hostel.findMany({
            where: { deletedAt: null },
            select: { id: true, email: true },
        });

        console.log(`Found ${hostels.length} hostels to process`);

        for (const hostel of hostels) {
            const normalizedEmail = hostel.email.trim().toLowerCase();
            if (hostel.email !== normalizedEmail) {
                await prisma.hostel.update({
                    where: { id: hostel.id },
                    data: { email: normalizedEmail },
                });
                console.log(`✓ Updated hostel email: ${hostel.email} → ${normalizedEmail}`);
            }
        }

        // 2. Normalize user emails
        const users = await prisma.user.findMany({
            where: { deletedAt: null },
            select: { id: true, email: true },
        });

        console.log(`\nFound ${users.length} users to process`);

        for (const user of users) {
            const normalizedEmail = user.email.trim().toLowerCase();
            if (user.email !== normalizedEmail) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { email: normalizedEmail },
                });
                console.log(`✓ Updated user email: ${user.email} → ${normalizedEmail}`);
            }
        }

        console.log('\n✅ Email normalization completed successfully!');
    } catch (error) {
        console.error('❌ Error normalizing emails:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// normalizeEmails()
//     .then(() => {
//         console.log('\nYou can now log in with: muizzabdul658@gmail.com');
//         process.exit(0);
//     })
//     .catch((error) => {
//         console.error('Script failed:', error);
//         process.exit(1);
//     });
