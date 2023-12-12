/*
  Warnings:

  - The values [ORDERED,OUTFORDELIVERY,DELIVERED,CALCELED] on the enum `ORDERSTATUS` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `OrderLine` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `menuId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderSeq` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ORDERSTATUS_new" AS ENUM ('PENDING', 'COOKING', 'COMPLETE');
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "ORDERSTATUS_new" USING ("status"::text::"ORDERSTATUS_new");
ALTER TYPE "ORDERSTATUS" RENAME TO "ORDERSTATUS_old";
ALTER TYPE "ORDERSTATUS_new" RENAME TO "ORDERSTATUS";
DROP TYPE "ORDERSTATUS_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "OrderLine" DROP CONSTRAINT "OrderLine_addonId_fkey";

-- DropForeignKey
ALTER TABLE "OrderLine" DROP CONSTRAINT "OrderLine_menuId_fkey";

-- DropForeignKey
ALTER TABLE "OrderLine" DROP CONSTRAINT "OrderLine_orderId_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "addonId" INTEGER,
ADD COLUMN     "menuId" INTEGER NOT NULL,
ADD COLUMN     "orderSeq" TEXT NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL;

-- DropTable
DROP TABLE "OrderLine";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_addonId_fkey" FOREIGN KEY ("addonId") REFERENCES "Addon"("id") ON DELETE SET NULL ON UPDATE CASCADE;
