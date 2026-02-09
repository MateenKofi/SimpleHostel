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
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const PAYSTACK_BASE_URL = "https://api.paystack.co";
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_KEY || "";
if (!PAYSTACK_SECRET_KEY) {
    throw new Error("PAYSTACK_SECRET_KEY is not set in the environment variables");
}
const paystack = {
    initializeTransaction: (email, amount) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            const response = yield axios_1.default.post(`${PAYSTACK_BASE_URL}/transaction/initialize`, { email, amount: Math.ceil(amount * 100) }, {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                },
            });
            return response.data;
        }
        catch (error) {
            const err = error;
            throw new Error(`Paystack initialization error: ${((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || err.message}`);
        }
    }),
    verifyTransaction: (reference) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            const response = yield axios_1.default.get(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                },
            });
            return response.data;
        }
        catch (error) {
            const err = error;
            throw new Error(`Paystack verification error: ${((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || err.message}`);
        }
    }),
    verifyWebhookSignature: (body, signature) => {
        const hmac = crypto_1.default.createHmac("sha512", PAYSTACK_SECRET_KEY);
        const computedSignature = hmac.update(body).digest("hex");
        return computedSignature === signature;
    },
};
exports.default = paystack;
