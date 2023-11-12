// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/utils/db";
import { getQrCodeUrl, qrCodeImageUpload } from "@/utils/fileUpload";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  const { companyId, locationId } = req.query;
  const isOrderApp = companyId && locationId;
  if (method === "GET") {
    if (isOrderApp) {
      const location = await prisma.location.findMany({
        where: { companyId: Number(companyId), isArchived: false },
      });
      const locationIds = location.map((item) => item.id);
      const menuCategory = await prisma.menuCategory.findMany({
        where: { companyId: Number(companyId), isArchived: false },
      });
      const menuCategoryIds = menuCategory.map((item) => item.id);
      const menuCategoryMenu = await prisma.menuCategoryMenu.findMany({
        where: { menuCategoryId: { in: menuCategoryIds }, isArchived: false },
      });
      const menuIds = menuCategoryMenu.map((item) => item.menuId);
      const menu = await prisma.menu.findMany({
        where: { id: { in: menuIds }, isArchived: false },
      });
      const menuAddonCategory = await prisma.menuAddonCategory.findMany({
        where: { menuId: { in: menuIds }, isArchived: false },
      });
      const addonCategoryIds = menuAddonCategory.map(
        (item) => item.addonCategoryId
      );

      const addonCategory = await prisma.addonCategory.findMany({
        where: {
          id: { in: addonCategoryIds },
          isArchived: false,
        },
      });
      const addon = await prisma.addon.findMany({
        where: {
          addonCategoryId: { in: addonCategoryIds },
          isArchived: false,
        },
      });
      const disableLocationMenuCategory =
        await prisma.disabledLocationMenuCategory.findMany({
          where: {
            menuCategoryId: { in: menuCategoryIds },
            isArchived: false,
          },
        });
      const disableLocationMenu = await prisma.disabledLocationMenu.findMany({
        where: {
          menuId: { in: menuIds },
          isArchived: false,
        },
      });
      const table = await prisma.table.findMany({
        where: { locationId: { in: locationIds }, isArchived: false },
      });
      return res.status(200).json({
        location,
        menuCategory,
        menu,
        menuCategoryMenu,
        menuAddonCategory,
        addonCategory,
        disableLocationMenuCategory,
        disableLocationMenu,
        addon,
        table,
      });
    } else {
      const session = await getServerSession(req, res, authOptions);
      if (!session) return res.status(401).send("Unauthorized...");
      const user = session.user;
      const name = user?.name as string;
      const email = user?.email as string;

      const dbUser = await prisma.user.findUnique({ where: { email } });
      if (!dbUser) {
        const newCompanyName = "Default Company Name";
        const newCompanyAddress = "Default street";
        // 1. create company
        const company = await prisma.company.create({
          data: { name: newCompanyName, address: newCompanyAddress },
        });

        // 2. create new user
        const newUser = await prisma.user.create({
          data: { name, email, companyId: company.id },
        });

        // 3. create newMenuCategory
        const newMenuCategoryName = "Default menuCategory Name";
        const menuCategory = await prisma.menuCategory.create({
          data: {
            name: newMenuCategoryName,
            companyId: company.id,
          },
        });

        // 4. create Default Menu
        const price = 100;
        const newMenuName = "Default Name";
        const menu = await prisma.menu.create({
          data: {
            name: newMenuName,
            price,
          },
        });

        // 5. join menu and menuCategory
        const menuCategoryMenu = await prisma.menuCategoryMenu.create({
          data: { menuId: menu.id, menuCategoryId: menuCategory.id },
        });
        // 6. create default addon Category
        const newAddonCategoryName = "Default addon Category";
        const addonCategory = await prisma.addonCategory.create({
          data: {
            name: newAddonCategoryName,
          },
        });
        // 7. join menu and addon Category
        const menuAddonCategory = await prisma.menuAddonCategory.create({
          data: { menuId: menu.id, addonCategoryId: addonCategory.id },
        });
        // 8. create default addon
        const AddonOne = "Default Addon 1";
        const addonTwo = "Default Addon 2";
        const addonThree = "Default Addon 3";
        const newAddonData = [
          { name: AddonOne, addonCategoryId: addonCategory.id },
          { name: addonTwo, addonCategoryId: addonCategory.id },
          { name: addonThree, addonCategoryId: addonCategory.id },
        ];
        const addon = await prisma.$transaction(
          newAddonData.map((addon) => prisma.addon.create({ data: addon }))
        );

        // 9. create default location
        const newLocationName = "SanCahung";
        const location = await prisma.location.create({
          data: {
            name: newLocationName,
            companyId: company.id,
            address: newCompanyAddress,
          },
        });
        // 10. crate table
        const newTableName = "Default Table Name";
        const table = await prisma.table.create({
          data: { name: newTableName, locationId: location.id, assetUrl: "" },
        });
        await qrCodeImageUpload(company.id, table.id);
        const assetUrl = getQrCodeUrl(company.id, table.id);
        await prisma.table.update({
          data: { assetUrl },
          where: { id: table.id },
        });
        return res.status(200).json({
          location,
          menuCategory,
          menu,
          menuCategoryMenu,
          addonCategory,
          menuAddonCategory,
          addon,
          table,
        });
      } else {
        const companyId = dbUser.companyId;
        const location = await prisma.location.findMany({
          where: { companyId, isArchived: false },
        });
        const locationIds = location.map((item) => item.id);
        const menuCategory = await prisma.menuCategory.findMany({
          where: { companyId, isArchived: false },
        });
        const menuCategoryIds = menuCategory.map((item) => item.id);
        const menuCategoryMenu = await prisma.menuCategoryMenu.findMany({
          where: { menuCategoryId: { in: menuCategoryIds }, isArchived: false },
        });
        const menuIds = menuCategoryMenu.map((item) => item.menuId);
        const menu = await prisma.menu.findMany({
          where: { id: { in: menuIds }, isArchived: false },
        });
        const menuAddonCategory = await prisma.menuAddonCategory.findMany({
          where: { menuId: { in: menuIds }, isArchived: false },
        });
        const addonCategoryIds = menuAddonCategory.map(
          (item) => item.addonCategoryId
        );

        const addonCategory = await prisma.addonCategory.findMany({
          where: {
            id: { in: addonCategoryIds },
            isArchived: false,
          },
        });
        const addon = await prisma.addon.findMany({
          where: {
            addonCategoryId: { in: addonCategoryIds },
            isArchived: false,
          },
        });
        const disableLocationMenuCategory =
          await prisma.disabledLocationMenuCategory.findMany({
            where: {
              menuCategoryId: { in: menuCategoryIds },
              isArchived: false,
            },
          });
        const disableLocationMenu = await prisma.disabledLocationMenu.findMany({
          where: {
            menuId: { in: menuIds },
            isArchived: false,
          },
        });
        const table = await prisma.table.findMany({
          where: { locationId: { in: locationIds }, isArchived: false },
        });
        return res.status(200).json({
          location,
          menuCategory,
          menu,
          menuCategoryMenu,
          menuAddonCategory,
          addonCategory,
          disableLocationMenuCategory,
          disableLocationMenu,
          addon,
          table,
        });
      }
    }
  }

  res.status(401).send("invalid method");
}
