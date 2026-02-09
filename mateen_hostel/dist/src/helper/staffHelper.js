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
exports.getAllStaffForHostel = exports.updateStaff = exports.deleteStaff = exports.getStaffById = exports.getAllStaffs = exports.addStaff = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const http_error_1 = __importDefault(require("../utils/http-error"));
const http_status_1 = require("../utils/http-status");
const client_1 = require("@prisma/client");
const staffSchema_1 = require("../zodSchema/staffSchema");
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const formatPrisma_1 = require("../utils/formatPrisma");
const generateAdminEmail_1 = require("../services/generateAdminEmail");
const nodeMailer_1 = require("../utils/nodeMailer");
const generatepass_1 = require("../utils/generatepass");
const bcrypt_1 = require("../utils/bcrypt");
const dto_1 = require("../utils/dto");
const genderLookup = {
    MALE: client_1.Gender.male,
    FEMALE: client_1.Gender.female,
    OTHER: client_1.Gender.other,
    male: client_1.Gender.male,
    female: client_1.Gender.female,
    other: client_1.Gender.other,
};
function parseDateInput(value) {
    if (!value)
        return undefined;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}
function normalizeGenderInput(value) {
    var _a;
    if (!value)
        return undefined;
    return (_a = genderLookup[value]) !== null && _a !== void 0 ? _a : genderLookup[value.toUpperCase()];
}
function resolveUserRole(value) {
    return (value === null || value === void 0 ? void 0 : value.toLowerCase()) === client_1.Role.admin ? client_1.Role.admin : client_1.Role.staff;
}
function buildStaffProfileCreateData(staffData, userId, picture) {
    var _a, _b, _c;
    return {
        userId,
        hostelId: staffData.hostelId,
        department: undefined,
        title: undefined,
        role: staffData.role,
        middleName: (_a = staffData.middleName) !== null && _a !== void 0 ? _a : undefined,
        dateOfBirth: parseDateInput(staffData.dateOfBirth),
        nationality: staffData.nationality,
        religion: staffData.religion,
        maritalStatus: staffData.maritalStatus,
        ghanaCardNumber: staffData.ghanaCardNumber,
        phoneNumber: staffData.phoneNumber,
        residence: staffData.residence,
        qualification: staffData.qualification,
        block: staffData.block,
        dateOfAppointment: parseDateInput(staffData.dateOfAppointment),
        passportUrl: (_b = picture === null || picture === void 0 ? void 0 : picture.passportUrl) !== null && _b !== void 0 ? _b : undefined,
        passportKey: (_c = picture === null || picture === void 0 ? void 0 : picture.passportKey) !== null && _c !== void 0 ? _c : undefined,
    };
}
function buildStaffProfileUpdateData(staffData, picture) {
    const data = {};
    if (staffData.role)
        data.role = staffData.role;
    if (staffData.middleName !== undefined)
        data.middleName = staffData.middleName;
    if (staffData.dateOfBirth)
        data.dateOfBirth = parseDateInput(staffData.dateOfBirth);
    if (staffData.nationality)
        data.nationality = staffData.nationality;
    if (staffData.religion)
        data.religion = staffData.religion;
    if (staffData.maritalStatus)
        data.maritalStatus = staffData.maritalStatus;
    if (staffData.ghanaCardNumber)
        data.ghanaCardNumber = staffData.ghanaCardNumber;
    if (staffData.phoneNumber)
        data.phoneNumber = staffData.phoneNumber;
    if (staffData.residence)
        data.residence = staffData.residence;
    if (staffData.qualification)
        data.qualification = staffData.qualification;
    if (staffData.block)
        data.block = staffData.block;
    if (staffData.dateOfAppointment)
        data.dateOfAppointment = parseDateInput(staffData.dateOfAppointment);
    if (staffData.hostelId) {
        data.hostel = {
            connect: {
                id: staffData.hostelId,
            },
        };
    }
    if ((picture === null || picture === void 0 ? void 0 : picture.passportUrl) && picture.passportKey) {
        data.passportUrl = picture.passportUrl;
        data.passportKey = picture.passportKey;
    }
    return data;
}
const addStaff = (staffData, picture) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateStaff = staffSchema_1.StaffSchema.safeParse(staffData);
        if (!validateStaff.success) {
            const errors = validateStaff.error.issues.map(({ message, path }) => `${path}: ${message}`);
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, errors.join(". "));
        }
        const existingUser = yield prisma_1.default.user.findFirst({ where: { email: staffData.email, deletedAt: null } });
        if (existingUser) {
            throw new http_error_1.default(http_status_1.HttpStatus.CONFLICT, "Staff already registered with this email");
        }
        const generatedPassword = (0, generatepass_1.generatePassword)();
        const hashedPassword = yield (0, bcrypt_1.hashPassword)(generatedPassword);
        const role = resolveUserRole(staffData.role);
        const gender = normalizeGenderInput(staffData.gender);
        const createdStaff = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const user = yield tx.user.create({
                data: {
                    email: staffData.email,
                    name: `${staffData.firstName} ${staffData.lastName}`,
                    password: hashedPassword,
                    role,
                    phone: (_a = staffData.phoneNumber) !== null && _a !== void 0 ? _a : undefined,
                    gender,
                },
            });
            const staffProfile = yield tx.staffProfile.create({
                data: buildStaffProfileCreateData(staffData, user.id, picture),
                include: { user: true, hostel: true },
            });
            return staffProfile;
        }));
        if (role === client_1.Role.admin) {
            try {
                const htmlContent = (0, generateAdminEmail_1.generateAdminWelcomeEmail)(staffData.email, generatedPassword);
                yield (0, nodeMailer_1.sendEmail)(staffData.email, "Your Hostel Admin Account", htmlContent);
            }
            catch (emailError) {
                console.error("Failed to send welcome email:", emailError);
            }
        }
        return (0, dto_1.toStaffDto)(createdStaff);
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.addStaff = addStaff;
const getAllStaffs = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const staffs = yield prisma_1.default.staffProfile.findMany({
            where: {
                deletedAt: null,
                hostel: {
                    is: {
                        deletedAt: null,
                    },
                },
            },
            include: {
                user: true,
                hostel: true,
            },
        });
        return staffs.map(staff => (0, dto_1.toStaffDto)(staff));
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getAllStaffs = getAllStaffs;
const getStaffById = (StaffId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Staff = yield prisma_1.default.staffProfile.findFirst({
            where: {
                id: StaffId,
                deletedAt: null,
                hostel: {
                    deletedAt: null,
                },
            },
            include: {
                user: true,
                hostel: true,
            },
        });
        if (!Staff) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Staff not found");
        }
        return (0, dto_1.toStaffDto)(Staff);
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getStaffById = getStaffById;
const deleteStaff = (StaffId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const findStaff = yield (0, exports.getStaffById)(StaffId);
        if (!findStaff) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Staff not found");
        }
        if (findStaff.passportKey) {
            yield cloudinary_1.default.uploader.destroy(findStaff.passportKey);
        }
        yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            yield tx.staffProfile.update({ where: { id: StaffId }, data: { deletedAt: new Date() } });
            yield tx.user.update({ where: { id: findStaff.userId }, data: { deletedAt: new Date() } });
        }));
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.deleteStaff = deleteStaff;
const updateStaff = (StaffId, StaffData, picture) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const validateStaff = staffSchema_1.updateStaffSchema.safeParse(StaffData);
        if (!validateStaff.success) {
            const errors = validateStaff.error.issues.map(({ message, path }) => `${path}: ${message}`);
            throw new http_error_1.default(http_status_1.HttpStatus.BAD_REQUEST, errors.join(". "));
        }
        const findStaff = yield prisma_1.default.staffProfile.findUnique({
            where: { id: StaffId },
            include: { user: true },
        });
        if (!findStaff) {
            throw new http_error_1.default(http_status_1.HttpStatus.NOT_FOUND, "Staff not found");
        }
        if ((picture === null || picture === void 0 ? void 0 : picture.passportKey) && findStaff.passportKey && picture.passportKey !== findStaff.passportKey) {
            yield cloudinary_1.default.uploader.destroy(findStaff.passportKey);
        }
        const userUpdateData = {};
        if (StaffData.firstName || StaffData.lastName) {
            const currentName = ((_a = findStaff.user.name) === null || _a === void 0 ? void 0 : _a.split(' ')) || [];
            const newFirstName = StaffData.firstName || currentName[0] || '';
            const newLastName = StaffData.lastName || currentName.slice(1).join(' ') || '';
            userUpdateData.name = `${newFirstName} ${newLastName}`.trim();
        }
        if (StaffData.email)
            userUpdateData.email = StaffData.email;
        if (StaffData.phoneNumber)
            userUpdateData.phone = StaffData.phoneNumber;
        if (StaffData.gender)
            userUpdateData.gender = normalizeGenderInput(StaffData.gender);
        if (StaffData.role)
            userUpdateData.role = resolveUserRole(StaffData.role);
        const profileData = buildStaffProfileUpdateData(StaffData, picture);
        const updatedStaff = yield prisma_1.default.staffProfile.update({
            where: { id: StaffId },
            data: Object.assign(Object.assign({}, profileData), { user: Object.keys(userUpdateData).length
                    ? { update: userUpdateData }
                    : undefined }),
            include: { user: true, hostel: true },
        });
        return (0, dto_1.toStaffDto)(updatedStaff);
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.updateStaff = updateStaff;
const getAllStaffForHostel = (hostelId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const staffs = yield prisma_1.default.staffProfile.findMany({
            where: { hostelId, deletedAt: null },
            include: { user: true },
        });
        return staffs.map(staff => (0, dto_1.toStaffDto)(staff));
    }
    catch (error) {
        throw (0, formatPrisma_1.formatPrismaError)(error);
    }
});
exports.getAllStaffForHostel = getAllStaffForHostel;
