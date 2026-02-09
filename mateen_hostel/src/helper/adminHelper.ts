import prisma from "../utils/prisma";
import HttpException from "../utils/http-error";
import { HttpStatus } from "../utils/http-status";
import cloudinary from "../utils/cloudinary";

export const clearAllData = async () => {
  try {
    await prisma.$transaction(async (tx) => {
      const [roomImages, hostelImages, hostels, users] = await Promise.all([
        tx.roomImage.findMany(),
        tx.hostelImage.findMany(),
        tx.hostel.findMany(),
        tx.user.findMany(),
      ]);

      for (const hostelImage of hostelImages) {
        if (hostelImage.imageKey) {
          await cloudinary.uploader.destroy(hostelImage.imageKey);
        }
      }

      for (const hostel of hostels) {
        if (hostel.logoKey) {
          await cloudinary.uploader.destroy(hostel.logoKey);
        }
      }

      for (const roomImage of roomImages) {
        if (roomImage.imageKey) {
          await cloudinary.uploader.destroy(roomImage.imageKey);
        }
      }

      for (const user of users) {
        if (user.avatar) {
          await cloudinary.uploader.destroy(user.avatar);
        }
      }

      await tx.payment.deleteMany({});
      await tx.visitor.deleteMany({});
      await tx.historicalResident.deleteMany({});
      await tx.residentProfile.deleteMany({});
      await tx.roomImage.deleteMany({});
      await tx.room.deleteMany({});
      await tx.amenities.deleteMany({});
      await tx.calendarYear.deleteMany({});
      await tx.staffProfile.deleteMany({});
      await tx.adminProfile.deleteMany({});
      await tx.hostelImage.deleteMany({});
      await tx.hostel.deleteMany({});
      await tx.user.deleteMany({ where: { role: { not: "admin" } } });
    });

    return { message: "All data cleared successfully" };
  } catch (error) {
    throw new HttpException(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Failed to clear database",
    );
  }
};

