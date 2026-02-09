"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAlphanumericCode = void 0;
const generateAlphanumericCode = (length = 10) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};
exports.generateAlphanumericCode = generateAlphanumericCode;
