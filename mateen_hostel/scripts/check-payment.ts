import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Check payment record for reference: zcc12ysy1o
 */
async function checkPayment() {
    try {
        const reference = 'zcc12ysy1o';
        console.log(`\n🔍 Checking payment with reference: ${reference}\n`);

        // 1. Find the payment record
        const payment = await prisma.payment.findUnique({
            where: { reference },
            include: {
                residentProfile: {
                    include: {
                        user: true,
                        room: true,
                    },
                },
                room: {
                    include: {
                        hostel: true,
                    },
                },
                calendarYear: true,
                historicalResident: true,
            },
        });

        if (!payment) {
            console.log('❌ Payment record NOT FOUND in database');
            console.log('\nPossible reasons:');
            console.log('1. Payment initialization failed');
            console.log('2. Payment was created with a different reference');
            console.log('3. Database connection issue during payment creation');
            return;
        }

        console.log('✅ Payment record FOUND\n');
        console.log('📋 Payment Details:');
        console.log('─'.repeat(60));
        console.log(`ID:                ${payment.id}`);
        console.log(`Reference:         ${payment.reference}`);
        console.log(`Amount:            GHS ${payment.amount}`);
        console.log(`Status:            ${payment.status}`);
        console.log(`Method:            ${payment.method || 'N/A'}`);
        console.log(`Amount Paid:       ${payment.amountPaid ? `GHS ${payment.amountPaid}` : 'N/A'}`);
        console.log(`Balance Owed:      ${payment.balanceOwed ? `GHS ${payment.balanceOwed}` : 'N/A'}`);
        console.log(`Created At:        ${payment.createdAt}`);
        console.log(`Updated At:        ${payment.updatedAt}`);
        console.log('─'.repeat(60));

        // 2. Check resident profile
        if (payment.residentProfile) {
            console.log('\n👤 Resident Profile:');
            console.log('─'.repeat(60));
            console.log(`Resident ID:       ${payment.residentProfile.id}`);
            console.log(`User Email:        ${payment.residentProfile.user?.email || 'N/A'}`);
            console.log(`User Name:         ${payment.residentProfile.user?.name || 'N/A'}`);
            console.log(`Room ID:           ${payment.residentProfile.roomId || 'Not assigned'}`);
            console.log(`Student ID:        ${payment.residentProfile.studentId || 'N/A'}`);
            console.log('─'.repeat(60));
        } else {
            console.log('\n⚠️  No resident profile linked to this payment');
        }

        // 3. Check room details
        if (payment.room) {
            console.log('\n🏠 Room Details:');
            console.log('─'.repeat(60));
            console.log(`Room Number:       ${payment.room.number}`);
            console.log(`Room Price:        GHS ${payment.room.price}`);
            console.log(`Room Type:         ${payment.room.type}`);
            console.log(`Room Status:       ${payment.room.status}`);
            console.log(`Current Residents: ${payment.room.currentResidentCount}/${payment.room.maxCap}`);
            console.log(`Hostel:            ${payment.room.hostel?.name || 'N/A'}`);
            console.log('─'.repeat(60));
        }

        // 4. Check calendar year
        if (payment.calendarYear) {
            console.log('\n📅 Calendar Year:');
            console.log('─'.repeat(60));
            console.log(`Name:              ${payment.calendarYear.name}`);
            console.log(`Active:            ${payment.calendarYear.isActive ? 'Yes' : 'No'}`);
            console.log(`Start Date:        ${payment.calendarYear.startDate}`);
            console.log(`End Date:          ${payment.calendarYear.endDate || 'N/A'}`);
            console.log('─'.repeat(60));
        }

        // 5. Payment status analysis
        console.log('\n📊 Payment Status Analysis:');
        console.log('─'.repeat(60));

        if (payment.status === 'confirmed') {
            console.log('✅ Payment is CONFIRMED');
            console.log(`   - Resident assigned to room: ${payment.residentProfile?.roomId ? 'Yes' : 'No'}`);
            console.log(`   - Total paid: GHS ${payment.amountPaid || payment.amount}`);
            console.log(`   - Balance owed: GHS ${payment.balanceOwed || 0}`);
        } else if (payment.status === 'pending') {
            console.log('⏳ Payment is PENDING verification');
            console.log('   - Payment may not have been verified with Paystack');
            console.log('   - Run verification endpoint to confirm payment');
        } else {
            console.log(`⚠️  Payment status: ${payment.status}`);
        }
        console.log('─'.repeat(60));

        // 6. Recommendations
        console.log('\n💡 Recommendations:');
        console.log('─'.repeat(60));

        if (payment.status === 'pending') {
            console.log('1. Call the payment confirmation endpoint:');
            console.log(`   POST /api/payment/confirm?reference=${reference}`);
            console.log('\n2. Or verify manually with Paystack API');
        } else if (payment.status === 'confirmed' && !payment.residentProfile?.roomId) {
            console.log('⚠️  Payment confirmed but resident not assigned to room');
            console.log('   - This may indicate a transaction failure during confirmation');
            console.log('   - Check the confirmation logic in paymentHelper.ts');
        }
        console.log('─'.repeat(60));

    } catch (error) {
        console.error('\n❌ Error checking payment:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

checkPayment()
    .then(() => {
        console.log('\n✅ Payment check completed\n');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Script failed:', error);
        process.exit(1);
    });
