-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PaymentMethod" ADD VALUE 'mobile_money';
ALTER TYPE "PaymentMethod" ADD VALUE 'qr';
ALTER TYPE "PaymentMethod" ADD VALUE 'eft';
ALTER TYPE "PaymentMethod" ADD VALUE 'bank_transfer';
