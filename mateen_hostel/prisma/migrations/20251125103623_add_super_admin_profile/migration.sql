-- CreateTable
CREATE TABLE "SuperAdminProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "department" TEXT,
    "title" TEXT,
    "role" TEXT,
    "middleName" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "nationality" TEXT,
    "religion" TEXT,
    "maritalStatus" TEXT,
    "ghanaCardNumber" TEXT,
    "phoneNumber" TEXT,
    "residence" TEXT,
    "qualification" TEXT,
    "dateOfAppointment" TIMESTAMP(3),
    "passportUrl" TEXT,
    "passportKey" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SuperAdminProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SuperAdminProfile_userId_key" ON "SuperAdminProfile"("userId");

-- AddForeignKey
ALTER TABLE "SuperAdminProfile" ADD CONSTRAINT "SuperAdminProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
