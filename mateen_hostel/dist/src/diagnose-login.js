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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("./utils/prisma"));
const bcrypt_1 = require("./utils/bcrypt");
function diagnose() {
    return __awaiter(this, void 0, void 0, function* () {
        const email = "wotoliy458@izeao.com";
        const password = "password";
        console.log(`Checking user: ${email}`);
        const user = yield prisma_1.default.user.findUnique({
            where: { email },
        });
        if (!user) {
            console.log("User NOT found in database.");
            return;
        }
        console.log("User found!");
        console.log(`ID: ${user.id}`);
        console.log(`Role: ${user.role}`);
        console.log(`DeletedAt: ${user.deletedAt}`);
        if (!user.password) {
            console.log("CRITICAL: User has NO password field in DB.");
        }
        else {
            console.log(`Password hash length: ${user.password.length}`);
            console.log(`Password starts with: ${user.password.substring(0, 10)}...`);
            const isMatch = yield (0, bcrypt_1.compare)(password, user.password);
            console.log(`Manual comparison with 'password': ${isMatch}`);
        }
    });
}
diagnose()
    .catch(console.error)
    .finally(() => prisma_1.default.$disconnect());
