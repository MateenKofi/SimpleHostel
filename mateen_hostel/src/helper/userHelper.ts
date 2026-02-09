import prisma from "../utils/prisma";
import HttpException from "../utils/http-error";
import { HttpStatus } from "../utils/http-status";
import type { Hostel, Prisma, User } from "@prisma/client";
import { Role } from "@prisma/client";
import { updateUserSchema, userSchema } from "../zodSchema/userSchema";
import { hashPassword } from "../utils/bcrypt";
import cloudinary from "../utils/cloudinary";
import { generatePassword } from "../utils/generatepass";
import { sendEmail } from "../utils/nodeMailer";
import { jwtDecode } from "jwt-decode";
import { UserPayload } from "../utils/jsonwebtoken";
import { formatPrismaError } from "../utils/formatPrisma";
import { generateAdminWelcomeEmail } from "../services/generateAdminEmail";
import { generateResetPasswordEmail } from "../services/generateResetPasswword";
import { toUserDto, toInternalUserDto } from "../utils/dto";

interface UserPicture {
  readonly imageUrl?: string;
  readonly imageKey?: string;
}

interface CreateUserPayload extends Partial<User> {
  readonly name?: string;
  readonly phoneNumber?: string;
}

const userInclude = {
  hostel: true,
  adminProfile: {
    include: {
      hostel: true,
    },
  },
  staffProfile: {
    include: {
      hostel: true,
    },
  },
  residentProfile: {
    include: {
      hostel: true,
      room: true,
    },
  },
  superAdminProfile: true,
} satisfies Prisma.UserInclude;

type UserWithProfiles = Prisma.UserGetPayload<{ include: typeof userInclude }>;

interface UserWithHostel extends User {
  readonly hostel: Hostel | null;
  readonly adminProfile?: {
    id: string;
    hostelId: string | null;
    position: string | null;
    hostel: Hostel | null;
  } | null;
  readonly staffProfile?: {
    id: string;
    hostelId: string | null;
    hostel: Hostel | null;
  } | null;
  readonly residentProfile?: {
    id: string;
    hostelId: string | null;
    roomId: string | null;
    studentId: string | null;
    course: string | null;
    roomNumber: string | null;
    status: string;
    checkInDate: Date | null;
    checkOutDate: Date | null;
    hostel: Hostel | null;
    room: any | null;
  } | null;
  readonly superAdminProfile?: {
    id: string;
    phoneNumber: string | null;
  } | null;
}

export type SafeUser = Omit<UserWithHostel, "password">;

// Use toUserDto from ../utils/dto for standardized output

function ensureActiveUser(user: UserWithProfiles | null): UserWithProfiles {
  if (!user || user.deletedAt) {
    throw new HttpException(HttpStatus.NOT_FOUND, "User not found");
  }
  return user;
}

async function ensureEmailAvailable(email: string): Promise<void> {
  const existingUser = await prisma.user.findFirst({
    where: {
      email,
      deletedAt: null,
    },
  });
  if (existingUser) {
    throw new HttpException(HttpStatus.CONFLICT, "Email already exists");
  }
}

function resolveAvatar(picture?: UserPicture, fallback?: string | null): string | undefined {
  if (picture?.imageUrl && picture.imageUrl.trim().length > 0) {
    return picture.imageUrl;
  }
  if (fallback && fallback.trim().length > 0) {
    return fallback;
  }
  return undefined;
}

function splitManagerName(name: string): { name: string } {
  return { name };
}

async function buildUserUpdateData(
  userData: Partial<User> & { phoneNumber?: string | null },
  picture?: UserPicture,
): Promise<Prisma.UserUpdateInput> {
  const data: Prisma.UserUpdateInput = {};
  if (userData.name !== undefined) data.name = userData.name;
  if (userData.email !== undefined) data.email = userData.email;
  if (userData.phone !== undefined) data.phone = userData.phone;
  else if (userData.phoneNumber !== undefined) data.phone = userData.phoneNumber;
  if (userData.gender !== undefined) data.gender = (userData.gender as string)?.toLowerCase() as any;
  if (userData.accountStatus !== undefined) data.accountStatus = (userData.accountStatus as string)?.toLowerCase() as any;
  if (userData.avatar !== undefined) data.avatar = userData.avatar;
  if (userData.imageUrl !== undefined) data.imageUrl = userData.imageUrl;
  if (userData.imageKey !== undefined) data.imageKey = userData.imageKey;
  if (picture?.imageUrl) {
    data.avatar = picture.imageUrl;
    data.imageUrl = picture.imageUrl;
  }
  if (picture?.imageKey) {
    data.imageKey = picture.imageKey;
  }
  if (userData.password) {
    data.password = await hashPassword(userData.password);
    data.changedPassword = true;
  }
  return data;
}

export const createUser = async (
  userData: CreateUserPayload,
  picture?: UserPicture,
) => {
  try {
    const validateUser = userSchema.safeParse(userData);
    if (!validateUser.success) {
      const errors = validateUser.error.issues.map(
        ({ message, path }) => `${path}: ${message}`,
      );
      throw new HttpException(HttpStatus.BAD_REQUEST, errors.join(". "));
    }

    const normalizedEmail = userData.email?.trim().toLowerCase();
    const { password, name } = userData;
    if (!normalizedEmail || !password) {
      throw new HttpException(HttpStatus.BAD_REQUEST, "Email and password are required");
    }
    if (!name) {
      throw new HttpException(HttpStatus.BAD_REQUEST, "Name is required");
    }
    const normalizedPhone = userData.phone ?? userData.phoneNumber ?? null;
    const avatar = resolveAvatar(picture, userData.avatar);
    // Check for existing non-deleted user
    const findUser = await prisma.user.findFirst({
      where: {
        email: normalizedEmail,
        deletedAt: null,
      },
    });
    if (findUser) {
      throw new HttpException(HttpStatus.CONFLICT, "Email already exists");
    }

    const hashedPassword = await hashPassword(password);
    const userRecord: Prisma.UserCreateInput = {
      email: normalizedEmail,
      password: hashedPassword,
      name,
      role: userData.role ?? Role.admin,
      gender: userData.gender ?? null,
      phone: normalizedPhone,
    };

    // Attach role-specific profiles
    if (userData.role === Role.staff) {
      userRecord.staffProfile = {
        create: {
          hostelId: userData.hostelId ?? undefined,
        },
      };
    } else if (userData.role === Role.resident) {
      userRecord.residentProfile = {
        create: {
          hostelId: userData.hostelId ?? undefined,
        },
      };
    } else if (userData.role === Role.super_admin) {
      // Super admins do not belong to any hostel; create a profile without hostel linkage
      userRecord.superAdminProfile = {
        create: {
          phoneNumber: normalizedPhone ?? undefined,
        },
      };
    }

    if (avatar) {
      userRecord.avatar = avatar;
    }
    const resolvedImageUrl = picture?.imageUrl ?? userData.imageUrl ?? undefined;
    if (resolvedImageUrl) {
      userRecord.imageUrl = resolvedImageUrl;
    }
    const resolvedImageKey = picture?.imageKey ?? userData.imageKey ?? undefined;
    if (resolvedImageKey) {
      userRecord.imageKey = resolvedImageKey;
    }
    if (userData.accountStatus) {
      userRecord.accountStatus = userData.accountStatus;
    }
    const newUser = await prisma.user.create({
      data: userRecord,
    });
    const { password: storedPassword, ...restOfUser } = newUser;
    return restOfUser as any;
  } catch (error) {
    throw formatPrismaError(error);
  }
};

export const getUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      where: {
        deletedAt: null,
      },
      include: userInclude,
    });
    return users.map((u) => toUserDto(u as any));
  } catch (error) {
    throw formatPrismaError(error);
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id, deletedAt: null }, // Only get non-deleted users
      include: userInclude,
    });
    if (!user) {
      throw new HttpException(HttpStatus.NOT_FOUND, "User not found.");
    }

    return toUserDto(user as any);
  } catch (error) {
    throw formatPrismaError(error);
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findFirst({
      where: {
        email: normalizedEmail,
        deletedAt: null, // Only get non-deleted users
      },
      include: userInclude,
    });
    if (!user) {
      return null;
    }
    return toUserDto(user as any);
  } catch (error) {
    throw formatPrismaError(error);
  }
};

/**
 * Retrieves a user by email INCLUDING the password.
 * This should ONLY be used for internal authentication logic (e.g., login verification).
 * DO NOT return the result of this function directly in an API response.
 */
export const getUserByEmailWithPassword = async (email: string) => {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findFirst({
      where: {
        email: normalizedEmail,
        deletedAt: null,
      },
      include: userInclude,
    });
    if (!user) {
      return null;
    }
    return toInternalUserDto(user as any);
  } catch (error) {
    throw formatPrismaError(error);
  }
};

export const deleteUser = async (id: string) => {
  try {
    const findUser = await getUserById(id);
    if (!findUser) {
      throw new HttpException(HttpStatus.NOT_FOUND, "User does not exist");
    }

    // Instead of deleting, mark the user as soft deleted
    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: "User soft deleted successfully" };
  } catch (error) {
    throw formatPrismaError(error);
  }
};

export const updateUser = async (
  id: string,
  UserData: Partial<User>,
  picture?: { imageUrl: string; imageKey: string },
) => {
  try {
    const validateUser = updateUserSchema.safeParse(UserData);
    if (!validateUser.success) {
      const errors = validateUser.error.issues.map(
        ({ message, path }) => `${path}: ${message}`,
      );
      throw new HttpException(HttpStatus.BAD_REQUEST, errors.join(". "));
    }
    const findUser = await prisma.user.findUnique({ where: { id } });
    if (!findUser) {
      throw new HttpException(HttpStatus.NOT_FOUND, "User not found");
    }

    if (picture?.imageKey && findUser.imageKey) {
      await cloudinary.uploader.destroy(findUser.imageKey);
    }

    const data = await buildUserUpdateData(UserData, picture);
    const updatedUser = await prisma.user.update({
      where: { id },
      data,
    });
    const { password: _, ...restOfUpdate } = updatedUser;
    return restOfUpdate as any;
  } catch (error) {
    console.error("Update User Error (Helper):", error);
    throw formatPrismaError(error);
  }
};

export const verifyAndcreateHostelUser = async (hostelId: string) => {
  try {
    const hostel = await prisma.hostel.findUnique({ where: { id: hostelId } });
    if (!hostel) {
      throw new HttpException(HttpStatus.NOT_FOUND, "Hostel not found");
    }
    // 2. Check if the hostel manager email already exists
    const { email, isVerified } = hostel;
    const findUser = await prisma.user.findFirst({
      where: { email, deletedAt: null },
    });
    if (findUser || isVerified) {
      throw new HttpException(
        HttpStatus.CONFLICT,
        "Email already exists or is verified",
      );
    }

    await prisma.hostel.update({
      where: { id: hostelId },
      data: { isVerified: true },
    });

    // 3. Generate a password for the user
    const generatedPassword = generatePassword();
    const hashedPassword = await hashPassword(generatedPassword);
    const managerNames = splitManagerName(hostel.manager);

    // 4. Create the user account
    // Normalize email to lowercase for consistency with login
    const normalizedEmail = email.trim().toLowerCase();
    const newUser = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name: managerNames.name,
        phone: hostel.phone,
        role: Role.admin,
        adminProfile: {
          create: {
            hostelId: hostel.id,
            position: "Manager",
          },
        },
      },
    });

    // 5. Send the generated credentials to the email
    const htmlContent = generateAdminWelcomeEmail(email, generatedPassword);
    await sendEmail(email, "Your Hostel Admin Account", htmlContent);

    // 6. Return the user without password
    const { password: _, ...restOfUser } = newUser;
    return restOfUser as any;
  } catch (error) {
    throw formatPrismaError(error);
  }
};

export const getUserProfileHelper = async (authHeader: string) => {
  try {
    if (!authHeader) {
      throw new HttpException(HttpStatus.FORBIDDEN, "No token provided");
    }

    const token = authHeader.split(" ")[1]; // Extract the token from 'Bearer <token>'
    if (!token) {
      throw new HttpException(HttpStatus.FORBIDDEN, "Invalid token format");
    }

    let decoded: UserPayload & { exp: number };
    try {
      decoded = jwtDecode<UserPayload & { exp: number }>(token); // Decode the token
    } catch (error) {
      throw new HttpException(HttpStatus.UNAUTHORIZED, "Invalid token");
    }

    const currentTime = Date.now() / 1000;
    if (decoded?.exp < currentTime) {
      throw new HttpException(HttpStatus.UNAUTHORIZED, "Token expired");
    }

    // Fetch the user profile from DB using the user ID
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new HttpException(HttpStatus.NOT_FOUND, "User not found");
    }

    return user; // Return the found user
  } catch (error) {
    throw formatPrismaError(error);
  }
};

export const getAllUsersForHostel = async (hostelId: string) => {
  try {
    const Users = await prisma.user.findMany({
      where: {
        hostel: {
          is: {
            id: hostelId,
            deletedAt: null,
          },
        },
        deletedAt: null,
      },
      include: {
        hostel: true,
      },
    });

    return Users.map((u) => toUserDto(u as any));
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  if (!email) {
    throw new HttpException(HttpStatus.BAD_REQUEST, "Email is required");
  }
  try {
    const user = await prisma.user.findFirst({
      where: { email, deletedAt: null },
    });

    if (!user) {
      throw new HttpException(HttpStatus.NOT_FOUND, "User not found");
    }

    const newPassword = generatePassword();
    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, changedPassword: false },
    });

    const htmlContent = generateResetPasswordEmail(email, newPassword);
    await sendEmail(email, "Password Reset", htmlContent);

    return { message: "Password reset successfully. Check your email." };
  } catch (error) {
    throw formatPrismaError(error);
  }
};
