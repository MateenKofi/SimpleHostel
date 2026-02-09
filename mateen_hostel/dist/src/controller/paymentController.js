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
exports.fixOrphanedPaymentsController = exports.getPaymentByReferenceController = exports.getPaymentsForHostelController = exports.getPaymentByIdController = exports.getAllPaymentController = exports.initializeTopUpPaymentControler = exports.TopUpPaymentController = exports.handlePaymentConfirmation = exports.initiatePayment = void 0;
const http_status_1 = require("../utils/http-status");
const paymentHelper_1 = require("../helper/paymentHelper");
const formatPrisma_1 = require("../utils/formatPrisma");
const initiatePayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomId, residentId, initialPayment } = req.body;
        const paymentUrl = yield (0, paymentHelper_1.initializePayment)(roomId, residentId, initialPayment);
        res.status(201).json({
            message: "Payment initialized.",
            paymentUrl,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.initiatePayment = initiatePayment;
const handlePaymentConfirmation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reference } = req.query;
        const result = yield (0, paymentHelper_1.confirmPayment)(reference);
        res.status(200).json({
            message: "Payment confirmed.",
            data: result,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.handlePaymentConfirmation = handlePaymentConfirmation;
const TopUpPaymentController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reference } = req.query;
        const result = yield (0, paymentHelper_1.TopUpPayment)(reference);
        res.status(200).json({
            message: "Payment confirmed.",
            data: result,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.TopUpPaymentController = TopUpPaymentController;
const initializeTopUpPaymentControler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomId, residentId, initialPayment } = req.body;
        const paymentUrl = yield (0, paymentHelper_1.initializeTopUpPayment)(roomId, residentId, initialPayment);
        res.status(201).json({
            message: "Payment initialized.",
            paymentUrl,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.initializeTopUpPaymentControler = initializeTopUpPaymentControler;
const getAllPaymentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payments = yield (0, paymentHelper_1.getAllPayments)();
        res
            .status(http_status_1.HttpStatus.OK)
            .json({ message: "retrieved succesfully", data: payments });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.getAllPaymentController = getAllPaymentController;
const getPaymentByIdController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { paymentId } = req.params;
    try {
        const payments = yield (0, paymentHelper_1.getPaymentsById)(paymentId);
        res
            .status(http_status_1.HttpStatus.OK)
            .json({ message: "payment fetch successfully", data: payments });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.getPaymentByIdController = getPaymentByIdController;
const getPaymentsForHostelController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { hostelId } = req.params;
    try {
        const payments = yield (0, paymentHelper_1.getPaymentsForHostel)(hostelId);
        res
            .status(http_status_1.HttpStatus.OK)
            .json({ message: "payments fetch successfully", data: payments });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.getPaymentsForHostelController = getPaymentsForHostelController;
const getPaymentByReferenceController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { reference } = req.params;
    try {
        const payments = yield (0, paymentHelper_1.getPaymentsByReference)(reference);
        res
            .status(http_status_1.HttpStatus.OK)
            .json({ message: "payments fetch successfully", data: payments });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.getPaymentByReferenceController = getPaymentByReferenceController;
const fixOrphanedPaymentsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fixedPayments = yield (0, paymentHelper_1.fixOrphanedPayments)();
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Orphaned payments fixed successfully.",
            data: fixedPayments,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.fixOrphanedPaymentsController = fixOrphanedPaymentsController;
