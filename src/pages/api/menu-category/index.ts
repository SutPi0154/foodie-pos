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
    const { name, locationId } = req.body;
    const isValid = name && locationId;
    if (!isValid) return res.status(400).send("bad request");
    const location = await prisma.location.findFirst({
      where: { id: locationId },
    });
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
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user?.email as string },
      });
      const menuCategoryIds = (
        await prisma.menuCategory.findMany({
          where: { companyId: dbUser?.companyId },
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
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
    });
    const menuCategoryIds = (
      await prisma.menuCategory.findMany({
        where: { companyId: dbUser?.companyId },
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
    // const menuCategoryMenuRows = await prisma.menuCategoryMenu.findMany({
    //   where: { menuCategoryId },
    // });
    // const menuIds = menuCategoryMenuRows.map((item) => item.menuId);

    // if menu Category is only connected to the menu connection
    // if (menuCategoryMenuRows.length === 1) {
    //   const menuId = menuCategoryMenuRows[0].menuId;

    //   const totalMenuCategoryConnection =
    //     await prisma.menuCategoryMenu.findMany({
    //       where: { menuId, isArchived: false },
    //     });
    //   // if menu is only connected to the only one menu category
    //   if (totalMenuCategoryConnection.length === 1) {
    //     const totalAddonCategoryConnection =
    //       await prisma.menuAddonCategory.findMany({
    //         where: { menuId, isArchived: false },
    //       });

    //     // menu has addon category if length = 0
    //     if (totalAddonCategoryConnection.length) {
    //       const addonCategoryIds = totalAddonCategoryConnection.map(
    //         (item) => item.addonCategoryId
    //       );

    //       addonCategoryIds.map(async (addonCategoryId) => {
    //         const totalMenAddonCategoryConnections =
    //           await prisma.menuAddonCategory.findMany({
    //             where: { addonCategoryId, isArchived: false },
    //           });
    //         if (totalMenAddonCategoryConnections.length) {
    //           // update menuAddonCategory
    //           await prisma.menuAddonCategory.updateMany({
    //             where: { menuId, addonCategoryId },
    //             data: { isArchived: true },
    //           });
    //           // update addon category
    //           await prisma.addonCategory.update({
    //             data: { isArchived: true },
    //             where: { id: addonCategoryId },
    //           });
    //           // addon
    //           await prisma.addon.updateMany({
    //             data: { isArchived: true },
    //             where: { addonCategoryId },
    //           });
    //         }
    //       });
    //     }
    //     // update menu
    //     await prisma.menu.update({
    //       data: { isArchived: true },
    //       where: { id: menuId },
    //     });
    //   }
    //   // update menuCategoryMenu table
    //   await prisma.menuCategoryMenu.updateMany({
    //     data: { isArchived: true },
    //     where: { menuCategoryId, menuId },
    // });
    // if menu Category is  connected many menu connection

    //   menuIds.forEach(async (menuId) => {
    //     const totalMenuCategoryConnections =
    //       await prisma.menuCategoryMenu.findMany({
    //         where: { menuId, isArchived: false },
    //       });

    //     if (totalMenuCategoryConnections.length === 1) {
    //       const totalAddonCategoryConnections =
    //         await prisma.menuAddonCategory.findMany({
    //           where: { menuId, isArchived: false },
    //         });
    //       // get addon category id
    //       const addonCategoryIds = totalAddonCategoryConnections.map(
    //         (item) => item.addonCategoryId
    //       );
    //       addonCategoryIds.map(async (addonCategoryId) => {
    //         const totalMenuAddonCategoryConnections =
    //           await prisma.menuAddonCategory.findMany({
    //             where: { addonCategoryId, isArchived: false },
    //           });
    //         if (totalMenuAddonCategoryConnections.length === 1) {
    //           // update menuAddonCategory
    //           await prisma.menuAddonCategory.updateMany({
    //             where: { menuId, addonCategoryId },
    //             data: { isArchived: true },
    //           });
    //           // update addon category
    //           await prisma.addonCategory.update({
    //             data: { isArchived: true },
    //             where: { id: addonCategoryId },
    //           });
    //           // addon
    //           await prisma.addon.updateMany({
    //             data: { isArchived: true },
    //             where: { addonCategoryId },
    //           });
    //         }
    //       });
    //       // update menu
    //       await prisma.menu.update({
    //         data: { isArchived: true },
    //         where: { id: menuId },
    //       });
    //     }
    //   });
    // }
    // menuIds.forEach(async (menuId) => {
    //   await prisma.menuCategoryMenu.updateMany({
    //     data: { isArchived: true },
    //     where: { menuCategoryId, menuId },
    //   });
    // });

    // await prisma.menuCategory.update({
    //   data: { isArchived: true },
    //   where: { id: menuCategoryId },
    // });
  }

  res.status(405).send("Method not allowed");
}
