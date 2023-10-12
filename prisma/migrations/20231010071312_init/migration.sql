-- CreateEnum
CREATE TYPE "ORDERSTATUS" AS ENUM ('ORDERED', 'OUTFORDELIVERY', 'DELIVERED', 'CALCELED');

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "MenuCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disabledLocationMenuCategory" (
    "id" SERIAL NOT NULL,
    "locationId" INTEGER NOT NULL,
    "menuCategoryId" INTEGER NOT NULL,

    CONSTRAINT "disabledLocationMenuCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Menu" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "assetUrl" TEXT,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DisabledLoactionMenu" (
    "id" SERIAL NOT NULL,
    "locationId" INTEGER NOT NULL,
    "menuId" INTEGER NOT NULL,

    CONSTRAINT "DisabledLoactionMenu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuCategoryMenu" (
    "id" SERIAL NOT NULL,
    "menuId" INTEGER NOT NULL,
    "menuCategoryId" INTEGER NOT NULL,

    CONSTRAINT "MenuCategoryMenu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AddonCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AddonCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuAddonCategory" (
    "id" SERIAL NOT NULL,
    "addonCategoryId" INTEGER NOT NULL,
    "menuId" INTEGER NOT NULL,

    CONSTRAINT "MenuAddonCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Addon" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 0,
    "addonCategoryId" INTEGER NOT NULL,

    CONSTRAINT "Addon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "status" "ORDERSTATUS" NOT NULL,
    "totalPrice" INTEGER NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderLine" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "menuId" INTEGER NOT NULL,
    "addonId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "orderSeq" TEXT NOT NULL,

    CONSTRAINT "OrderLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Table" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "locationId" INTEGER NOT NULL,

    CONSTRAINT "Table_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuCategory" ADD CONSTRAINT "MenuCategory_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disabledLocationMenuCategory" ADD CONSTRAINT "disabledLocationMenuCategory_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disabledLocationMenuCategory" ADD CONSTRAINT "disabledLocationMenuCategory_menuCategoryId_fkey" FOREIGN KEY ("menuCategoryId") REFERENCES "MenuCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisabledLoactionMenu" ADD CONSTRAINT "DisabledLoactionMenu_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisabledLoactionMenu" ADD CONSTRAINT "DisabledLoactionMenu_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuCategoryMenu" ADD CONSTRAINT "MenuCategoryMenu_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuCategoryMenu" ADD CONSTRAINT "MenuCategoryMenu_menuCategoryId_fkey" FOREIGN KEY ("menuCategoryId") REFERENCES "MenuCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuAddonCategory" ADD CONSTRAINT "MenuAddonCategory_addonCategoryId_fkey" FOREIGN KEY ("addonCategoryId") REFERENCES "AddonCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuAddonCategory" ADD CONSTRAINT "MenuAddonCategory_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Addon" ADD CONSTRAINT "Addon_addonCategoryId_fkey" FOREIGN KEY ("addonCategoryId") REFERENCES "AddonCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderLine" ADD CONSTRAINT "OrderLine_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderLine" ADD CONSTRAINT "OrderLine_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderLine" ADD CONSTRAINT "OrderLine_addonId_fkey" FOREIGN KEY ("addonId") REFERENCES "Addon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Table" ADD CONSTRAINT "Table_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
