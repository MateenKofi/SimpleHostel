"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePayload = void 0;
const allowedFields_json_1 = __importDefault(require("../../allowedFields.json"));
const http_status_1 = require("../utils/http-status");
const validatePayload = (model) => {
    return (req, res, next) => {
        // Find model fields from allowedFields.json
        const modelFields = allowedFields_json_1.default.find((field) => field.modelName === model);
        // If model is not found, reject the request
        if (!modelFields) {
            res.status(http_status_1.HttpStatus.BAD_REQUEST).json({
                message: `Model "${model}" is not recognized.`,
            });
            return; // 🔥 Ensure no further execution
        }
        const payload = req.body;
        const dataFields = Object.keys(payload);
        // Find any fields that are not part of the allowed fields
        const unwantedFields = dataFields.filter((field) => !modelFields.fields.includes(field));
        // If there are unwanted fields, reject the request
        if (unwantedFields.length > 0) {
            res.status(http_status_1.HttpStatus.BAD_REQUEST).json({
                message: "Invalid request format. The following fields are not allowed:",
                fields: unwantedFields,
            });
            return;
        }
        next(); // ✅ Proceed if everything is fine
    };
};
exports.validatePayload = validatePayload;
