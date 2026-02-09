
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function recalculateBalance() {
    const paymentId = "cmk1xxjir00038ble8ubjozk0";

    try {
        const payment = await prisma.payment.findUnique({
            where: { id: paymentId },
            include: {
                room: {
                    include: { hostel: true }
                },
                residentProfile: true
            }
        });

        if (!payment || !payment.room) {
            console.log("Payment or room not found");
            return;
        }

        // 1. Recalculate amountPaid for this Academic Year only
        const otherPayments = await prisma.payment.findMany({
            where: {
                residentProfileId: payment.residentProfileId,
                calendarYearId: payment.calendarYearId,
                status: "confirmed",
                id: { not: paymentId }
            },
            select: { amount: true }
        });

        const otherTotal = otherPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
        const totalPaid = Number((otherTotal + payment.amount).toFixed(2));

        // 2. Recalculate Balance Owed using DYNAMIC threshold
        const roomPrice = payment.room.price;
        const debt = roomPrice - totalPaid;
        let balanceOwed = 0;

        const hostelThreshold = payment.room.hostel.partialPaymentPercentage ?? 60;

        // Round percentage same as updated helper
        const rawPercentage = (totalPaid / roomPrice) * 100;
        const paymentPercentage = Number(rawPercentage.toFixed(2));

        console.log(`Debug: TotalPaid: ${totalPaid}, RoomPrice: ${roomPrice}, Debt: ${debt}`);
        console.log(`Debug: Threshold: ${hostelThreshold}%, LowPrecision: ${rawPercentage}%, Rounded: ${paymentPercentage}%`);

        if (debt > 0) {
            if (paymentPercentage >= hostelThreshold) {
                balanceOwed = Number(debt.toFixed(2));
            } else {
                console.log("Payment is below threshold, keeping balanceOwed as 0");
            }
        }

        console.log(`New BalanceOwed to set: ${balanceOwed}`);

        // 3. Update the record
        const updated = await prisma.payment.update({
            where: { id: paymentId },
            data: {
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

recalculateBalance();
