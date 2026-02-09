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
function deleteDuplicates() {
    return __awaiter(this, void 0, void 0, function* () {
        const idsToDelete = [
            'cmjtigdz60008quxowa006mgr',
            'cmjtg4ajc000d12o6lsnavc2e',
            'cmjteo17j000212o6hhnej1v2'
        ];
        try {
            const result = yield prisma.payment.deleteMany({
                where: {
                    id: { in: idsToDelete }
                }
            });
            console.log(`Deleted ${result.count} duplicate payments.`);
        }
        catch (error) {
            console.error("Error deleting payments:", error);
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
deleteDuplicates();
