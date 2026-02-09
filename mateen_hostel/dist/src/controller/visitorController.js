"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.visitorForHostel = exports.checkoutVisitorController = exports.deleteVisitorController = exports.updateVisitorController = exports.getVisitorByIdController = exports.getAllVisitorsController = exports.addVisitorController = void 0;
const visitorHelper = __importStar(require("../helper/visitorHelper")); // Assuming your helper functions are in this file
const http_status_1 = require("../utils/http-status");
const formatPrisma_1 = require("../utils/formatPrisma");
// Add a Visitor
const addVisitorController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const visitorData = req.body; // Get visitor data from the request body
    try {
        const createdVisitor = yield visitorHelper.addVisitor(visitorData);
        res.status(http_status_1.HttpStatus.CREATED).json({
            message: "Visitor added successfully",
            data: createdVisitor,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.addVisitorController = addVisitorController;
// Get All Visitors
const getAllVisitorsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const visitors = yield visitorHelper.getAllVisitors();
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Visitors fetched successfully",
            data: visitors,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.getAllVisitorsController = getAllVisitorsController;
// Get Visitor by ID
const getVisitorByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { visitorId } = req.params;
    try {
        const visitor = yield visitorHelper.getVisitorById(visitorId);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Visitor fetched successfully",
            data: visitor,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.getVisitorByIdController = getVisitorByIdController;
// Update a Visitor
const updateVisitorController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { visitorId } = req.params;
    const visitorData = req.body; // Get visitor data from the request body
    try {
        const updatedVisitor = yield visitorHelper.updateVisitor(visitorId, visitorData);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Visitor updated successfully",
            data: updatedVisitor,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.updateVisitorController = updateVisitorController;
// Delete a Visitor
const deleteVisitorController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { visitorId } = req.params;
    try {
        const result = yield visitorHelper.deleteVisitor(visitorId);
        res.status(http_status_1.HttpStatus.OK).json({
            message: result.message,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.deleteVisitorController = deleteVisitorController;
// Checkout a Visitor
const checkoutVisitorController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { visitorId } = req.params;
    try {
        const checkedOutVisitor = yield visitorHelper.checkoutVisitor(visitorId);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Visitor checked out successfully",
            data: checkedOutVisitor,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.checkoutVisitorController = checkoutVisitorController;
const visitorForHostel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { hostelId } = req.params;
    try {
        const visitors = yield visitorHelper.getVisitorsForHostel(hostelId);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Visitors fetched successfully for the hostel",
            data: visitors,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error); // Ensure this function is used
        res.status(err.status).json({ message: err.message });
    }
});
exports.visitorForHostel = visitorForHostel;
