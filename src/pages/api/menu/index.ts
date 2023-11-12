// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).send("Unauthorized");
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
    const { id, name, menuCategoryIds, price, isAvailable, locationId } =
      req.body;
    console.log(id, name, menuCategoryIds, price, isAvailable, locationId);
    const isValid =
      id &&
      name.trim() !== "" &&
      price !== undefined &&
      menuCategoryIds.length > 0 &&
      isAvailable !== undefined &&
      locationId;
    if (!isValid) return res.status(400).send("data is required");
    const menu = await prisma.menu.update({
      data: { name, price },
      where: { id },
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
    if (locationId) {
      if (isAvailable === false) {
        // if data exist we don't have to do any thing but don't exist have to create a new data on disableLocationMenus
        const exist = await prisma.disabledLocationMenu.findFirst({
          where: { menuId: id },
        });
        if (!exist) {
          await prisma.disabledLocationMenu.create({
            data: { locationId, menuId: id },
          });
        }
      } else {
        // to delete the data on disableLocationMenus data with menuIds
        await prisma.disabledLocationMenu.deleteMany({
          where: { locationId, menuId: id },
        });
      }
    } else {
    }
    const disabledLocationMenus = await prisma.disabledLocationMenu.findMany({
      where: { locationId, menuId: id },
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
