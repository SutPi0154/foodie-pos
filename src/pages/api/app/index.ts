// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  if (method === "GET") {
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
      const addons = await prisma.$transaction(
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
        data: { name: newTableName, locationId: location.id },
      });
      return res.status(200).json({
        location,
        menuCategory,
        menu,
        menuCategoryMenu,
        addonCategory,
        menuAddonCategory,

        addons,
      });
    } else {
      const companyId = dbUser.companyId;
      const locations = await prisma.location.findMany({
        where: { companyId },
      });
      const locationIds = locations.map((item) => item.id);
      const menuCategories = await prisma.menuCategory.findMany({
        where: { companyId },
      });
      const menuCategoryIds = menuCategories.map((item) => item.id);
      const menuCategoryMenu = await prisma.menuCategoryMenu.findMany({
        where: { menuCategoryId: { in: menuCategoryIds } },
      });
      const menuIds = menuCategoryMenu.map((item) => item.menuId);
      const menus = await prisma.menu.findMany({
        where: { id: { in: menuIds } },
      });
      const menuAddonCategory = await prisma.menuAddonCategory.findMany({
        where: { menuId: { in: menuIds } },
      });
      const addonCategoryIds = menuAddonCategory.map(
        (item) => item.addonCategoryId
      );
      const addonCategories = await prisma.addonCategory.findMany({
        where: {
          id: { in: addonCategoryIds },
        },
      });
      const addons = await prisma.addon.findMany({
        where: { addonCategoryId: { in: addonCategoryIds } },
      });
      const tables = await prisma.table.findMany({
        where: { locationId: { in: locationIds } },
      });
      return res.status(200).json({
        locations,
        menuCategories,
        menus,
        addonCategories,
        addons,
        tables,
      });
    }
  }
  res.status(401).send("invalid method");
}
