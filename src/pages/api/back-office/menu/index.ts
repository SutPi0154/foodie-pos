// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  if (method === "POST") {
    const { name, price, assetUrl, menuCategoryIds } = req.body;
    const isValid =
      name.trim() !== "" && price !== undefined && menuCategoryIds.length > 0;
    if (!isValid) return res.status(400).send("data is required");
    const menu = await prisma.menu.create({ data: { name, price, assetUrl } });
    const newMenuCategoryMenu: { menuId: number; menuCategoryId: number }[] =
      menuCategoryIds.map((item: number) => ({
        menuId: menu.id,
        menuCategoryId: item,
      }));
    const menuCategoryMenus = await prisma.$transaction(
      newMenuCategoryMenu.map((item) =>
        prisma.menuCategoryMenu.create({
          data: { menuId: item.menuId, menuCategoryId: item.menuCategoryId },
        })
      )
    );
    return res.status(200).json({ menu, menuCategoryMenus });
  } else if (method === "PUT") {
    const {
      id,
      name,
      menuCategoryIds,
      price,
      isAvailable,
      locationId,
      assetUrl,
    } = req.body;
    const isValid =
      id &&
      name.trim() !== "" &&
      price !== undefined &&
      menuCategoryIds.length > 0 &&
      isAvailable !== undefined &&
      locationId;
    if (!isValid) return res.status(400).send("data is required");
    const exist = await prisma.menu.findFirst({ where: { id } });
    if (!exist) return res.status(400).send("Bad request");
    const menu = await prisma.menu.update({
      data: { name, price, assetUrl },
      where: { id },
    });
    const location = await prisma.location.findFirst({
      where: { id: locationId },
    });
    //delete menuCategoryMenu
    await prisma.menuCategoryMenu.deleteMany({ where: { menuId: id } });
    //update menuCategoryMenus
    const menuCategoryData: { menuId: number; menuCategoryId: number }[] =
      menuCategoryIds.map((item: number) => ({
        menuId: id,
        menuCategoryId: item,
      }));
    const menuCategoryMenus = await prisma.$transaction(
      menuCategoryData.map((item) =>
        prisma.menuCategoryMenu.create({
          data: { menuId: item.menuId, menuCategoryId: item.menuCategoryId },
        })
      )
    );
    if (locationId && isAvailable === false) {
      const exist = await prisma.disabledLocationMenu.findFirst({
        where: { menuId: id, locationId: locationId },
      });
      if (!exist) {
        await prisma.disabledLocationMenu.create({
          data: { menuId: id, locationId },
        });
      }
    } else if (locationId && isAvailable === true) {
      const exist = await prisma.disabledLocationMenu.findFirst({
        where: { menuId: id, locationId: locationId },
      });
      if (exist) {
        await prisma.disabledLocationMenu.delete({
          where: { id: exist.id },
        });
      }
    }

    const allMenuCategoryIds = (
      await prisma.menuCategory.findMany({
        where: { companyId: location?.companyId },
      })
    ).map((item) => item.id);
    const menuIds = (
      await prisma.menuCategoryMenu.findMany({
        where: { menuCategoryId: { in: allMenuCategoryIds } },
      })
    ).map((item) => item.menuId);
    const disabledLocationMenus = await prisma.disabledLocationMenu.findMany({
      where: { menuId: { in: menuIds } },
    });
    return res
      .status(200)
      .json({ menu, menuCategoryMenus, disabledLocationMenus });
  } else if (method === "DELETE") {
    const menuId = Number(req.query.id);
    const menu = await prisma.menu.findFirst({ where: { id: menuId } });
    if (!menu) return res.status(400).send("bad request");
    await prisma.menu.update({
      data: { isArchived: true },
      where: { id: menuId },
    });
    await prisma.menuCategoryMenu.updateMany({
      data: { isArchived: true },
      where: { menuId },
    });
    await prisma.menuAddonCategory.updateMany({
      data: { isArchived: true },
      where: { menuId },
    });
    return res.status(200).send("Deleted");
  }
  res.status(405).send("method not allowed");
}
