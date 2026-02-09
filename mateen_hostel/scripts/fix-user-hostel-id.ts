import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixUserHostelId() {
    const userId = 'cmjtajq6n000014ipojrfjqge';
    const residentProfileId = 'cmjtajq6o000114ipmxjs5r5f';
    const hostelId = 'cmjtcu51x000011tdbh8cc19z';

    try {
        console.log(`Fixing data for User: ${userId}`);

        // Update User
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { hostelId },
        });
        console.log('✅ User updated with hostelId:', updatedUser.hostelId);

        // Update ResidentProfile
        const updatedProfile = await prisma.residentProfile.update({
            where: { id: residentProfileId },
            data: { hostelId },
        });
        console.log('✅ ResidentProfile updated with hostelId:', updatedProfile.hostelId);

    } catch (error) {
        console.error('❌ Error fixing user data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

fixUserHostelId();
