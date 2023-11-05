// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = getServerSession(req, res, authOptions);
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
    const { id, name, companyId } = req.body;
    const isValid = id && name.trim() !== "" && companyId;
    if (!isValid) return res.status(400).send("bad request");
    const isExist = await prisma.menuCategory.findFirst({ where: { id } });
    if (!isExist) return res.status(400).send("bad request");
    const menuCategory = await prisma.menuCategory.update({
      data: { name },
      where: { id },
    });
    return res.status(200).json({ menuCategory });
  } else if (method === "DELETE") {
    const menuCategoryId = Number(req.query.id);
    const menuCategory = await prisma.menuCategory.findFirst({
      where: { id: menuCategoryId },
    });
    if (!menuCategory) return res.status(400).send("Bad request");
    await prisma.menuCategoryMenu.updateMany({
      data: { isArchived: true },
      where: { menuCategoryId },
    });
    await prisma.menuCategory.update({
      data: { isArchived: true },
      where: { id: menuCategoryId },
    });
    return res.status(200).send("Deleted");
  }

  res.status(405).send("Method not allowed");
}
