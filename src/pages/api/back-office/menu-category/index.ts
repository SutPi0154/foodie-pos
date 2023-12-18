// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  if (method === "POST") {
    const { name, locationId } = req.body;
    const isValid = name && locationId;
    const location = await prisma.location.findFirst({
      where: { id: locationId },
    });
    if (!isValid) return res.status(400).send("bad request");

    if (!location) return res.status(400).send("Bad Request");
    const menuCategory = await prisma.menuCategory.create({
      data: { name, companyId: location?.companyId },
    });
    return res.status(200).json(menuCategory);
  } else if (method === "PUT") {
    const { id, name, companyId, isAvailable, locationId } = req.body;
    const isValid = id && name.trim() !== "" && companyId;
    if (!isValid) return res.status(400).send("bad request");
    const isExist = await prisma.menuCategory.findFirst({ where: { id } });
    if (!isExist) return res.status(400).send("bad request");
    const location = await prisma.location.findFirst({
      where: { id: locationId },
    });
    const menuCategory = await prisma.menuCategory.update({
      data: { name },
      where: { id },
    });

    const FindMenuCategoryMenu = await prisma.menuCategoryMenu.findMany({
      where: { menuCategoryId: id },
    });

    if (FindMenuCategoryMenu.length >= 1) {
      const updateManyMenuCategoryMenu =
        await prisma.menuCategoryMenu.updateMany({
          data: { isArchived: true },
          where: { menuCategoryId: id },
        });

      const menuIds = FindMenuCategoryMenu.map((item) => item.menuId);
      const menuCategoryMenuData: {
        menuCategoryId: number;
        menuId: number;
      }[] = menuIds.map((item: number) => ({
        menuCategoryId: id,
        menuId: item,
      }));
      const menuCategoryMenu = await prisma.$transaction(
        menuCategoryMenuData.map((item) =>
          prisma.menuCategoryMenu.create({
            data: item,
          })
        )
      );

      await prisma.menuCategoryMenu.deleteMany({
        where: { menuCategoryId: id, isArchived: true },
      });

      if (locationId && isAvailable === false) {
        const exist = await prisma.disabledLocationMenuCategory.findFirst({
          where: { menuCategoryId: id, locationId: locationId },
        });
        if (!exist) {
          await prisma.disabledLocationMenuCategory.create({
            data: { menuCategoryId: id, locationId },
          });
        }
      } else if (locationId && isAvailable === true) {
        const exist = await prisma.disabledLocationMenuCategory.findFirst({
          where: { menuCategoryId: id, locationId: locationId },
        });
        if (exist) {
          await prisma.disabledLocationMenuCategory.delete({
            where: { id: exist.id },
          });
        }
      }

      const menuCategoryIds = (
        await prisma.menuCategory.findMany({
          where: { companyId: location?.companyId },
        })
      ).map((item) => item.id);
      const disabledLocationMenuCategory =
        await prisma.disabledLocationMenuCategory.findMany({
          where: { menuCategoryId: { in: menuCategoryIds } },
        });
      return res
        .status(200)
        .json({ menuCategory, disabledLocationMenuCategory, menuCategoryMenu });
    }

    if (locationId && isAvailable === false) {
      const exist = await prisma.disabledLocationMenuCategory.findFirst({
        where: { menuCategoryId: id, locationId: locationId },
      });
      if (!exist) {
        const disabledLocationMenuCategory =
          await prisma.disabledLocationMenuCategory.create({
            data: { menuCategoryId: id, locationId },
          });
      }
    } else if (locationId && isAvailable === true) {
      const exist = await prisma.disabledLocationMenuCategory.findFirst({
        where: { menuCategoryId: id, locationId: locationId },
      });
      if (exist) {
        await prisma.disabledLocationMenuCategory.delete({
          where: { id: exist.id },
        });
      }
    }

    const menuCategoryIds = (
      await prisma.menuCategory.findMany({
        where: { companyId: location?.companyId },
      })
    ).map((item) => item.id);
    const disabledLocationMenuCategory =
      await prisma.disabledLocationMenuCategory.findMany({
        where: { menuCategoryId: { in: menuCategoryIds } },
      });
    return res.status(200).json({ menuCategory, disabledLocationMenuCategory });
  } else if (method === "DELETE") {
    const menuCategoryId = Number(req.query.id);
    const menuCategory = await prisma.menuCategory.findFirst({
      where: { id: menuCategoryId },
    });

    if (!menuCategory) return res.status(400).send("Bad request");
    const menuIds = (
      await prisma.menuCategoryMenu.findMany({
        where: { menuCategoryId, isArchived: false },
      })
    ).map((item) => item.menuId);
    const menuIdPromise = menuIds.map(async (menuId) => {
      const menuData = { menuId, count: 1 };
      const count = await prisma.menuCategoryMenu.count({
        where: { menuId, isArchived: false },
      });
      menuData.count = count;
      return menuData;
    });
    const menuIdsToArchived = (await Promise.all(menuIdPromise))
      .filter((item) => item.count === 1)
      .map((item) => item.menuId);

    const addonCategoryIds = (
      await prisma.menuAddonCategory.findMany({
        where: { menuId: { in: menuIdsToArchived }, isArchived: false },
      })
    ).map((item) => item.addonCategoryId);
    const addonCategoryIdsPromise = addonCategoryIds.map(
      async (addonCategoryId) => {
        const addonCategoryData = { addonCategoryId, count: 1 };
        const count = await prisma.menuAddonCategory.count({
          where: { addonCategoryId, isArchived: false },
        });
        addonCategoryData.count = count;
        return addonCategoryData;
      }
    );
    const addonCategoryIdsToArchive = (
      await Promise.all(addonCategoryIdsPromise)
    )
      .filter((item) => item.count === 1)
      .map((item) => item.addonCategoryId);
    for (const menuId of menuIdsToArchived) {
      await prisma.menu.updateMany({
        data: { isArchived: true },
        where: { id: menuId },
      });
      await prisma.menuAddonCategory.updateMany({
        data: { isArchived: true },
        where: { menuId },
      });
    }
    for (const addonCategoryId of addonCategoryIdsToArchive) {
      await prisma.addonCategory.updateMany({
        data: { isArchived: true },
        where: { id: addonCategoryId },
      });
      await prisma.addon.updateMany({
        data: { isArchived: true },
        where: { addonCategoryId },
      });
    }
    for (const menuId of menuIds) {
      await prisma.menuCategoryMenu.updateMany({
        data: { isArchived: true },
        where: { menuId, menuCategoryId },
      });
    }
    await prisma.menuCategory.update({
      data: { isArchived: true },
      where: { id: menuCategoryId },
    });
    return res.status(200).send("Deleted.");
  }

  res.status(405).send("Method not allowed");
}
