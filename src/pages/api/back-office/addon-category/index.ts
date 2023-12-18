// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  if (method === "POST") {
    const { name, isRequired, menuIds } = req.body;
    const isValid = name.trim() !== "" && menuIds.length > 0;
    if (!isValid) return res.status(400).send("bad request");
    const addonCategory = await prisma.addonCategory.create({
      data: { name, isRequired },
    });
    const newMenuAddonCategory: { addonCategoryId: number; menuId: number }[] =
      menuIds.map((item: number) => ({
        addonCategoryId: addonCategory.id,
        menuId: item,
      }));

    const menuAddonCategory = await prisma.$transaction(
      newMenuAddonCategory.map((item) =>
        prisma.menuAddonCategory.create({
          data: { addonCategoryId: item.addonCategoryId, menuId: item.menuId },
        })
      )
    );
    res.status(200).json({ menuAddonCategory, addonCategory });
  } else if (method === "DELETE") {
    const addonCategoryId = Number(req.query.id);
    const addonCategory = await prisma.addonCategory.findFirst({
      where: { id: addonCategoryId },
    });
    if (!addonCategory) return res.status(400).send("Bad request");
    await prisma.addonCategory.update({
      data: { isArchived: true },
      where: { id: addonCategoryId },
    });
    return res.status(200).send("Deleted");
  } else if (method === "PUT") {
    const { id, name, menuIds, isRequired } = req.body;
    const isValid =
      id &&
      name.trim() !== "" &&
      menuIds.length > 0 &&
      isRequired !== undefined;
    if (!isValid) return res.status(400).send("data is required");
    const addonCategory = await prisma.addonCategory.update({
      data: { name, isRequired },
      where: { id },
    });
    //delete menuCategoryMenu
    await prisma.menuAddonCategory.deleteMany({
      where: { addonCategoryId: id },
    });
    //update menuCategoryMenus
    const menuAddonCategoryData: {
      addonCategoryId: number;
      menuId: number;
    }[] = menuIds.map((item: number) => ({
      addonCategoryId: id,
      menuId: item,
    }));
    const menuAddonCategories = await prisma.$transaction(
      menuAddonCategoryData.map((item) =>
        prisma.menuAddonCategory.create({
          data: item,
        })
      )
    );
    return res.status(200).json({ menuAddonCategories, addonCategory });
  }
  res.status(405).send("Method not allowed");
}
