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
exports.clearAllData = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const http_error_1 = __importDefault(require("../utils/http-error"));
const http_status_1 = require("../utils/http-status");
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const clearAllData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const [roomImages, hostelImages, hostels, users] = yield Promise.all([
                tx.roomImage.findMany(),
                tx.hostelImage.findMany(),
                tx.hostel.findMany(),
                tx.user.findMany(),
            ]);
            for (const hostelImage of hostelImages) {
                if (hostelImage.imageKey) {
                    yield cloudinary_1.default.uploader.destroy(hostelImage.imageKey);
                }
            }
            for (const hostel of hostels) {
                if (hostel.logoKey) {
                    yield cloudinary_1.default.uploader.destroy(hostel.logoKey);
                }
            }
            for (const roomImage of roomImages) {
                if (roomImage.imageKey) {
                    yield cloudinary_1.default.uploader.destroy(roomImage.imageKey);
                }
            }
            for (const user of users) {
                if (user.avatar) {
                    yield cloudinary_1.default.uploader.destroy(user.avatar);
                }
            }
            yield tx.payment.deleteMany({});
            yield tx.visitor.deleteMany({});
            yield tx.historicalResident.deleteMany({});
            yield tx.residentProfile.deleteMany({});
            yield tx.roomImage.deleteMany({});
            yield tx.room.deleteMany({});
            yield tx.amenities.deleteMany({});
            yield tx.calendarYear.deleteMany({});
            yield tx.staffProfile.deleteMany({});
            yield tx.adminProfile.deleteMany({});
            yield tx.hostelImage.deleteMany({});
            yield tx.hostel.deleteMany({});
            yield tx.user.deleteMany({ where: { role: { not: "admin" } } });
        }));
        return { message: "All data cleared successfully" };
    }
    catch (error) {
        throw new http_error_1.default(http_status_1.HttpStatus.INTERNAL_SERVER_ERROR, "Failed to clear database");
    }
});
exports.clearAllData = clearAllData;
