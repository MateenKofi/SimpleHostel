"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePassword = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generatePassword = () => {
    return crypto_1.default.randomBytes(8).toString("hex"); // 8 bytes => 16 characters
};
exports.generatePassword = generatePassword;
