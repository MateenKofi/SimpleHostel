"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStaffSchema = exports.StaffSchema = void 0;
const zod_1 = require("zod");
const staffRoleEnum = zod_1.z.enum([
    "HOSTEL_MANAGER",
    "WARDEN",
    "CHIEF_WARDEN"
]);
const genderEnum = zod_1.z.enum(["MALE", "FEMALE", "OTHER"]);
const maritalStatusEnum = zod_1.z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]);
const staffQualificationEnum = zod_1.z.enum(["WASCE", "BECE", "TVET", "BSC"]);
// Schema for creating a staff member
exports.StaffSchema = zod_1.z.object({
    role: zod_1.z
        .string({ required_error: "role is required" })
        .trim()
        .min(1, { message: "role can't be empty" }),
    hostelId: zod_1.z
        .string({ required_error: "Hostel ID is required" })
        .min(1, { message: "Hostel ID can't be empty" }),
    firstName: zod_1.z
        .string({ required_error: "First name is required" })
        .trim()
        .min(1, { message: "First name can't be empty" }),
    middleName: zod_1.z.string().trim().optional(),
    lastName: zod_1.z
        .string({ required_error: "Last name is required" })
        .trim()
        .min(1, { message: "Last name can't be empty" }),
    dateOfBirth: zod_1.z.string({ required_error: "Date is required" })
        .trim()
        .min(1, { message: "Date of appointment can't be empty" })
        .optional(),
    nationality: zod_1.z
        .string({ required_error: "Nationality is required" })
        .trim()
        .min(1, { message: "Nationality can't be empty" }),
    gender: genderEnum,
    religion: zod_1.z
        .string({ required_error: "Religion is required" })
        .trim()
        .min(1, { message: "Religion can't be empty" }),
    maritalStatus: maritalStatusEnum,
    ghanaCardNumber: zod_1.z
        .string({ required_error: "Ghana Card Number is required" })
        .trim()
        .min(1, { message: "Ghana Card Number can't be empty" }),
    phoneNumber: zod_1.z
        .string({ required_error: "Phone number is required" })
        .min(1, { message: "Phone number can't be empty" }),
    email: zod_1.z
        .string({ required_error: "Email is required" })
        .email({ message: "Email must be a valid email address" })
        .min(1, { message: "Email can't be empty" }),
    residence: zod_1.z
        .string({ required_error: "Residence is required" })
        .trim()
        .min(1, { message: "Residence can't be empty" }),
    qualification: zod_1.z
        .string({ required_error: "Qualification is required" })
        .trim()
        .min(1, { message: "Qualifucation can't be empty" }),
    block: zod_1.z
        .string({ required_error: "Block is required" })
        .trim()
        .min(1, { message: "Block can't be empty" }),
    dateOfAppointment: zod_1.z.string({ required_error: "Date is required" })
        .trim()
        .min(1, { message: "Date of appointment can't be empty" })
});
// Schema for updating a staff member (all fields are optional)
exports.updateStaffSchema = zod_1.z.object({
    name: zod_1.z
        .string({ required_error: "Staff name is required" })
        .trim()
        .min(1, { message: "Staff name can't be empty" })
        .optional(),
    role: zod_1.z
        .string({ required_error: "role is required" })
        .trim()
        .min(1, { message: "role can't be empty" })
        .optional(),
    hostelId: zod_1.z
        .string({ required_error: "Hostel ID is required" })
        .min(1, { message: "Hostel ID can't be empty" })
        .optional(),
    firstName: zod_1.z
        .string({ required_error: "First name is required" })
        .trim()
        .min(1, { message: "First name can't be empty" })
        .optional(),
    middleName: zod_1.z.string().trim().optional(),
    lastName: zod_1.z
        .string({ required_error: "Last name is required" })
        .trim()
        .min(1, { message: "Last name can't be empty" })
        .optional(),
    dateOfBirth: zod_1.z.string({ required_error: "Date is required" })
        .trim()
        .min(1, { message: "Date of appointment can't be empty" })
        .optional(),
    nationality: zod_1.z
        .string({ required_error: "Nationality is required" })
        .trim()
        .min(1, { message: "Nationality can't be empty" })
        .optional(),
    gender: genderEnum.optional(),
    religion: zod_1.z
        .string({ required_error: "Religion is required" })
        .trim()
        .min(1, { message: "Religion can't be empty" })
        .optional(),
    maritalStatus: maritalStatusEnum.optional(),
    ghanaCardNumber: zod_1.z
        .string({ required_error: "Ghana Card Number is required" })
        .trim()
        .min(1, { message: "Ghana Card Number can't be empty" })
        .optional(),
    phoneNumber: zod_1.z
        .string({ required_error: "Phone number is required" })
        .min(1, { message: "Phone number can't be empty" })
        .optional(),
    email: zod_1.z
        .string({ required_error: "Email is required" })
        .email({ message: "Email must be a valid email address" })
        .min(1, { message: "Email can't be empty" })
        .optional(),
    residence: zod_1.z
        .string({ required_error: "Residence is required" })
        .trim()
        .min(1, { message: "Residence can't be empty" })
        .optional(),
    qualification: zod_1.z
        .string({ required_error: "Qualification is required" })
        .trim()
        .min(1, { message: "Qualification can't be empty" })
        .optional(),
    block: zod_1.z
        .string({ required_error: "Block is required" })
        .trim()
        .min(1, { message: "Block can't be empty" })
        .optional(),
    dateOfAppointment: zod_1.z.string({ required_error: "Date is required" })
        .trim()
        .min(1, { message: "Date of appointment can't be empty" })
        .optional(),
});
