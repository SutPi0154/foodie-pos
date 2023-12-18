// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/utils/db";
import { getQrCodeUrl, qrCodeImageUpload } from "@/utils/fileUpload";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  // return res.status(200).send("Ok");
  if (method === "POST") {
    const { name, locationId } = req.body;
    const isValid = name && locationId;
    if (!isValid) return res.status(400).send("Bad request.");
    const table = await prisma.table.create({
      data: { name, locationId, assetUrl: "" },
    });
    const tableId = table.id;
    await qrCodeImageUpload(tableId);
    const assetUrl = getQrCodeUrl(tableId);
    await prisma.table.update({ data: { assetUrl }, where: { id: table.id } });
    return res.status(200).json({ table });
  } else if (method === "PUT") {
    const { id, name } = req.body;
    const isValid = id && name;
    if (!isValid) return res.status(400).send("Bad request.");
    const exist = await prisma.table.findFirst({ where: { id } });
    if (!exist) return res.status(400).send("Bad request.");
    const table = await prisma.table.update({
      data: { name },
      where: { id },
    });
    return res.status(200).json({ table });
  } else if (method === "DELETE") {
    const tableId = Number(req.query.id);
    const table = await prisma.table.findFirst({
      where: { id: tableId },
    });
    if (!table) return res.status(400).send("Bad request.");
    await prisma.table.update({
      data: { isArchived: true },
      where: { id: tableId },
    });
    return res.status(200).send("Deleted.");
  }
  res.status(405).send("Method now allowed.");
}
