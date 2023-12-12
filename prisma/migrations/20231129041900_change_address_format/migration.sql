/*
  Warnings:

  - You are about to drop the column `address` on the `Company` table. All the data in the column will be lost.
  - Added the required column `city` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `township` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "address",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL,
ADD COLUMN     "township" TEXT NOT NULL;
