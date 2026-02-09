
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function listPayments() {
  try {
    const payments = await prisma.payment.findMany({
      where: {
        residentProfileId: 'cmjtajq6o000114ipmxjs5r5f', // From the user's JSON
        calendarYearId: 'cmjtdau47000711tdd4hzont3',   // From the user's JSON
        status: 'confirmed'
      },
      orderBy: { createdAt: 'desc' },
      select: { 
        id: true, 
        amount: true, 
        reference: true, 
        createdAt: true,
        amountPaid: true 
      }
    });

    console.log("Confirmed Payments for this Resident & Year:");
    console.table(payments);
    
    const total = payments.reduce((sum, p) => sum + p.amount, 0);
    console.log(`\nCalculated Total: ${total}`);

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

listPayments();
