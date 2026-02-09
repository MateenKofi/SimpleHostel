import prisma from "../utils/prisma";
import HttpException from "../utils/http-error";
import { HttpStatus } from "../utils/http-status";
import { Gender, Prisma, Role } from "@prisma/client";
import { StaffSchema, StaffRequestDto, updateStaffSchema, UpdateStaffRequestDto } from "../zodSchema/staffSchema";
import cloudinary from "../utils/cloudinary";
import { formatPrismaError } from "../utils/formatPrisma";
import { generateAdminWelcomeEmail } from "../services/generateAdminEmail";
import { sendEmail } from "../utils/nodeMailer";
import { generatePassword } from "../utils/generatepass";
import { hashPassword } from "../utils/bcrypt";
import { toStaffDto } from "../utils/dto";

interface StaffPicture {
  readonly passportUrl?: string;
  readonly passportKey?: string;
}

const genderLookup: Record<string, Gender> = {
  MALE: Gender.male,
  FEMALE: Gender.female,
  OTHER: Gender.other,
  male: Gender.male,
  female: Gender.female,
  other: Gender.other,
};

function parseDateInput(value?: string): Date | undefined {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function normalizeGenderInput(value?: string): Gender | undefined {
  if (!value) return undefined;
  return genderLookup[value] ?? genderLookup[value.toUpperCase()];
}

function resolveUserRole(value?: string): Role {
  return value?.toLowerCase() === Role.admin ? Role.admin : Role.staff;
}

function buildStaffProfileCreateData(staffData: StaffRequestDto, userId: string, picture?: StaffPicture): Prisma.StaffProfileUncheckedCreateInput {
  return {
    userId,
    hostelId: staffData.hostelId,
    department: undefined,
    title: undefined,
    role: staffData.role,
    middleName: staffData.middleName ?? undefined,
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
    passportUrl: picture?.passportUrl ?? undefined,
    passportKey: picture?.passportKey ?? undefined,
  };
}

function buildStaffProfileUpdateData(staffData: UpdateStaffRequestDto, picture?: StaffPicture): Prisma.StaffProfileUpdateInput {
  const data: Prisma.StaffProfileUpdateInput = {};
  if (staffData.role) data.role = staffData.role;
  if (staffData.middleName !== undefined) data.middleName = staffData.middleName;
  if (staffData.dateOfBirth) data.dateOfBirth = parseDateInput(staffData.dateOfBirth);
  if (staffData.nationality) data.nationality = staffData.nationality;
  if (staffData.religion) data.religion = staffData.religion;
  if (staffData.maritalStatus) data.maritalStatus = staffData.maritalStatus;
  if (staffData.ghanaCardNumber) data.ghanaCardNumber = staffData.ghanaCardNumber;
  if (staffData.phoneNumber) data.phoneNumber = staffData.phoneNumber;
  if (staffData.residence) data.residence = staffData.residence;
  if (staffData.qualification) data.qualification = staffData.qualification;
  if (staffData.block) data.block = staffData.block;
  if (staffData.dateOfAppointment) data.dateOfAppointment = parseDateInput(staffData.dateOfAppointment);
  if (staffData.hostelId) {
    data.hostel = {
      connect: {
        id: staffData.hostelId,
      },
    };
  }
  if (picture?.passportUrl && picture.passportKey) {
    data.passportUrl = picture.passportUrl;
    data.passportKey = picture.passportKey;
  }
  return data;
}

export const addStaff = async (staffData: StaffRequestDto, picture?: StaffPicture) => {
  try {
    const validateStaff = StaffSchema.safeParse(staffData);
    if (!validateStaff.success) {
      const errors = validateStaff.error.issues.map(({ message, path }) => `${path}: ${message}`);
      throw new HttpException(HttpStatus.BAD_REQUEST, errors.join(". "));
    }
    const existingUser = await prisma.user.findFirst({ where: { email: staffData.email, deletedAt: null } });
    if (existingUser) {
      throw new HttpException(HttpStatus.CONFLICT, "Staff already registered with this email");
    }
    const generatedPassword = generatePassword();
    const hashedPassword = await hashPassword(generatedPassword);
    const role = resolveUserRole(staffData.role);
    const gender = normalizeGenderInput(staffData.gender);
    const createdStaff = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: staffData.email,
          name: `${staffData.firstName} ${staffData.lastName}`,
          password: hashedPassword,
          role,
          phone: staffData.phoneNumber ?? undefined,
          gender,
        },
      });
      const staffProfile = await tx.staffProfile.create({
        data: buildStaffProfileCreateData(staffData, user.id, picture),
        include: { user: true, hostel: true },
      });
      return staffProfile;
    });
    if (role === Role.admin) {
      try {
        const htmlContent = generateAdminWelcomeEmail(staffData.email, generatedPassword);
        await sendEmail(staffData.email, "Your Hostel Admin Account", htmlContent);
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
      }
    }
    return toStaffDto(createdStaff as any);
  } catch (error) {
    throw formatPrismaError(error);
  }
};

export const getAllStaffs = async () => {
  try {
    const staffs = await prisma.staffProfile.findMany({
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
    return staffs.map(staff => toStaffDto(staff as any));
  } catch (error) {
    throw formatPrismaError(error);
  }
};

export const getStaffById = async (StaffId: string) => {
  try {
    const Staff = await prisma.staffProfile.findFirst({
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
      throw new HttpException(HttpStatus.NOT_FOUND, "Staff not found");
    }
    return toStaffDto(Staff as any);
  } catch (error) {
    throw formatPrismaError(error);
  }
};

export const deleteStaff = async (StaffId: string) => {
  try {
    const findStaff = await getStaffById(StaffId);
    if (!findStaff) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Staff not found");
    }
    if (findStaff.passportKey) {
      await cloudinary.uploader.destroy(findStaff.passportKey);
    }
    await prisma.$transaction(async (tx) => {
      await tx.staffProfile.update({ where: { id: StaffId }, data: { deletedAt: new Date() } });
      await tx.user.update({ where: { id: findStaff.userId }, data: { deletedAt: new Date() } });
    });
  } catch (error) {
    throw formatPrismaError(error);
  }
};

export const updateStaff = async (
  StaffId: string,
  StaffData: UpdateStaffRequestDto,
  picture?: StaffPicture,
) => {
  try {
    const validateStaff = updateStaffSchema.safeParse(StaffData);
    if (!validateStaff.success) {
      const errors = validateStaff.error.issues.map(({ message, path }) => `${path}: ${message}`);
      throw new HttpException(HttpStatus.BAD_REQUEST, errors.join(". "));
    }
    const findStaff = await prisma.staffProfile.findUnique({
      where: { id: StaffId },
      include: { user: true },
    });
    if (!findStaff) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Staff not found");
    }
    if (picture?.passportKey && findStaff.passportKey && picture.passportKey !== findStaff.passportKey) {
      await cloudinary.uploader.destroy(findStaff.passportKey);
    }
    const userUpdateData: Prisma.UserUpdateInput = {};
    if (StaffData.firstName || StaffData.lastName) {
      const currentName = findStaff.user.name?.split(' ') || [];
      const newFirstName = StaffData.firstName || currentName[0] || '';
      const newLastName = StaffData.lastName || currentName.slice(1).join(' ') || '';
      userUpdateData.name = `${newFirstName} ${newLastName}`.trim();
    }
    if (StaffData.email) userUpdateData.email = StaffData.email;
    if (StaffData.phoneNumber) userUpdateData.phone = StaffData.phoneNumber;
    if (StaffData.gender) userUpdateData.gender = normalizeGenderInput(StaffData.gender);
    if (StaffData.role) userUpdateData.role = resolveUserRole(StaffData.role);
    const profileData = buildStaffProfileUpdateData(StaffData, picture);
    const updatedStaff = await prisma.staffProfile.update({
      where: { id: StaffId },
      data: {
        ...profileData,
        user: Object.keys(userUpdateData).length
          ? { update: userUpdateData }
          : undefined,
      },
      include: { user: true, hostel: true },
    });
    return toStaffDto(updatedStaff as any);
  } catch (error) {
    throw formatPrismaError(error);
  }
};

export const getAllStaffForHostel = async (hostelId: string) => {
  try {
    const staffs = await prisma.staffProfile.findMany({
      where: { hostelId, deletedAt: null },
      include: { user: true },
    });
    return staffs.map(staff => toStaffDto(staff as any));
  } catch (error) {
    throw formatPrismaError(error);
  }
};
