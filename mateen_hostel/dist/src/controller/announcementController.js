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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAnnouncementController = exports.updateAnnouncementController = exports.addAnnouncementController = void 0;
const announcementHelper = __importStar(require("../helper/announcementHelper"));
const http_status_1 = require("../utils/http-status");
const formatPrisma_1 = require("../utils/formatPrisma");
const announcementSchema_1 = require("../zodSchema/announcementSchema");
const http_error_1 = __importDefault(require("../utils/http-error"));
const addAnnouncementController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const announcementData = announcementSchema_1.createAnnouncementSchema.parse(req.body);
        const hostelId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.hostelId;
        if (!hostelId) {
            throw new http_error_1.default(http_status_1.HttpStatus.FORBIDDEN, "You must be assigned to a hostel to create announcements");
        }
        const newAnnouncement = yield announcementHelper.addAnnouncement(hostelId, announcementData);
        res.status(http_status_1.HttpStatus.CREATED).json({
            message: "Announcement created successfully",
            data: newAnnouncement,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.addAnnouncementController = addAnnouncementController;
const updateAnnouncementController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { announcementId } = req.params;
        const announcementData = announcementSchema_1.updateAnnouncementSchema.parse(req.body);
        const hostelId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.hostelId;
        if (!hostelId) {
            throw new http_error_1.default(http_status_1.HttpStatus.FORBIDDEN, "You must be assigned to a hostel to update announcements");
        }
        const updatedAnnouncement = yield announcementHelper.updateAnnouncement(announcementId, hostelId, announcementData);
        res.status(http_status_1.HttpStatus.OK).json({
            message: "Announcement updated successfully",
            data: updatedAnnouncement,
        });
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.updateAnnouncementController = updateAnnouncementController;
const deleteAnnouncementController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { announcementId } = req.params;
        const hostelId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.hostelId;
        if (!hostelId) {
            throw new http_error_1.default(http_status_1.HttpStatus.FORBIDDEN, "You must be assigned to a hostel to delete announcements");
        }
        const result = yield announcementHelper.deleteAnnouncement(announcementId, hostelId);
        res.status(http_status_1.HttpStatus.OK).json(result);
    }
    catch (error) {
        const err = (0, formatPrisma_1.formatPrismaError)(error);
        res.status(err.status).json({ message: err.message });
    }
});
exports.deleteAnnouncementController = deleteAnnouncementController;
