"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function listPayments() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const payments = yield prisma.payment.findMany({
                where: {
                    residentProfileId: 'cmjtajq6o000114ipmxjs5r5f', // From the user's JSON
                    calendarYearId: 'cmjtdau47000711tdd4hzont3', // From the user's JSON
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
        }
        catch (error) {
            console.error("Error:", error);
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
listPayments();
