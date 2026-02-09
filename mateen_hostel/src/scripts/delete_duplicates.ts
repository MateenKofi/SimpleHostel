
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function deleteDuplicates() {
    const idsToDelete = [
        'cmjtigdz60008quxowa006mgr',
        'cmjtg4ajc000d12o6lsnavc2e',
        'cmjteo17j000212o6hhnej1v2'
    ];

    try {
        const result = await prisma.payment.deleteMany({
            where: {
                id: { in: idsToDelete }
            }
        });

        console.log(`Deleted ${result.count} duplicate payments.`);
    } catch (error) {
        console.error("Error deleting payments:", error);
    } finally {
        await prisma.$disconnect();
    }
}

deleteDuplicates();
