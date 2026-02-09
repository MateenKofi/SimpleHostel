import 'dotenv/config';
import { confirmPayment } from '../src/helper/paymentHelper';
import prisma from '../src/utils/prisma';

async function manualConfirm() {
    const reference = '3nd3nc81qe';
    console.log(`Attempting to manually confirm payment: ${reference}`);

    try {
        // 1. Check if payment exists
        const payment = await prisma.payment.findUnique({
            where: { reference }
        });

        if (!payment) {
            console.error('Payment not found in database!');
            return;
        }

        if (payment.status === 'confirmed') {
            console.log('Payment is already confirmed!');
            return;
        }

        // 2. Run confirmation logic (using local fixed code)
        const result = await confirmPayment(reference);
        console.log('✅ Confirmation Successful:', result);

    } catch (error) {
        console.error('❌ Confirmation Failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

manualConfirm();
