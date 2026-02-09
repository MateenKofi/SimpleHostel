
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fixPayment() {
    const paymentId = "cmk1xxjir00038ble8ubjozk0";

    try {
        const payment = await prisma.payment.findUnique({
            where: { id: paymentId },
            include: {
                room: true,
                residentProfile: true
            }
        });

        if (!payment) {
            console.log("Payment not found");
            return;
        }

        if (!payment.residentProfileId || !payment.calendarYearId || !payment.room) {
            console.log("Missing necessary relations on payment");
            return;
        }

        // 1. Fix the amount precision
        const correctAmount = 666.59; // Rounded from 666.593999... as per user request

        // 2. Recalculate amountPaid for this Academic Year only
        // Find all OTHER confirmed payments for this resident + calendar year
        const otherPayments = await prisma.payment.findMany({
            where: {
                residentProfileId: payment.residentProfileId,
                calendarYearId: payment.calendarYearId,
                status: "confirmed",
                id: { not: paymentId } // Exclude current one
            },
            select: { amount: true }
        });

        const otherTotal = otherPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
        const totalPaid = Number((otherTotal + correctAmount).toFixed(2));

        // 3. Recalculate Balance Owed
        const roomPrice = payment.room.price;
        const debt = roomPrice - totalPaid;
        let balanceOwed = 0;

        // Logic from paymentHelper.ts: strict about balance calc
        if (debt > 0) {
            // If they still owe money
            balanceOwed = Number(debt.toFixed(2));
        }

        console.log("Correction Details:");
        console.log(`Original Amount: ${payment.amount} -> New Amount: ${correctAmount}`);
        console.log(`Original AmountPaid: ${payment.amountPaid} -> New AmountPaid: ${totalPaid}`);
        console.log(`Original BalanceOwed: ${payment.balanceOwed} -> New BalanceOwed: ${balanceOwed}`);

        // 4. Update the record
        const updated = await prisma.payment.update({
            where: { id: paymentId },
            data: {
                amount: correctAmount,
                amountPaid: totalPaid,
                balanceOwed: balanceOwed
            }
        });

        console.log("Payment record updated successfully:", updated);

    } catch (error) {
        console.error("Error fixing payment:", error);
    } finally {
        await prisma.$disconnect();
    }
}

fixPayment();
