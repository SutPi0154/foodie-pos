/*
  Warnings:

  - You are about to drop the `DisabledLoactionMenu` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `disabledLocationMenuCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DisabledLoactionMenu" DROP CONSTRAINT "DisabledLoactionMenu_locationId_fkey";

-- DropForeignKey
ALTER TABLE "DisabledLoactionMenu" DROP CONSTRAINT "DisabledLoactionMenu_menuId_fkey";

-- DropForeignKey
ALTER TABLE "disabledLocationMenuCategory" DROP CONSTRAINT "disabledLocationMenuCategory_locationId_fkey";

-- DropForeignKey
ALTER TABLE "disabledLocationMenuCategory" DROP CONSTRAINT "disabledLocationMenuCategory_menuCategoryId_fkey";

-- DropTable
DROP TABLE "DisabledLoactionMenu";

-- DropTable
DROP TABLE "disabledLocationMenuCategory";

-- CreateTable
CREATE TABLE "DisabledLocationMenuCategory" (
    "id" SERIAL NOT NULL,
    "locationId" INTEGER NOT NULL,
    "menuCategoryId" INTEGER NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DisabledLocationMenuCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DisabledLocationMenu" (
    "id" SERIAL NOT NULL,
    "locationId" INTEGER NOT NULL,
    "menuId" INTEGER NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DisabledLocationMenu_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DisabledLocationMenuCategory" ADD CONSTRAINT "DisabledLocationMenuCategory_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisabledLocationMenuCategory" ADD CONSTRAINT "DisabledLocationMenuCategory_menuCategoryId_fkey" FOREIGN KEY ("menuCategoryId") REFERENCES "MenuCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisabledLocationMenu" ADD CONSTRAINT "DisabledLocationMenu_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisabledLocationMenu" ADD CONSTRAINT "DisabledLocationMenu_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
