/*
  Warnings:

  - The `status` column on the `Payout` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."PayoutStatus" AS ENUM ('PAID', 'CANCELLED');

-- AlterTable
ALTER TABLE "public"."Payout" DROP COLUMN "status",
ADD COLUMN     "status" "public"."PayoutStatus" NOT NULL DEFAULT 'PAID';
