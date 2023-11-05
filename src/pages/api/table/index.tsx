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
    const isValid = name.trim() !== "" && locationId;
    if (!isValid) return res.status(400).send("bad request");
    const table = await prisma.table.create({
      data: { name, locationId },
    });
    return res.status(200).json({ table });
  } else if (method === "DELETE") {
    const TableId = Number(req.query.id);
    const table = await prisma.table.findFirst({
      where: { id: TableId },
    });
    if (!table) return res.status(400).send("Bad request");
    await prisma.table.update({
      data: { isArchived: true },
      where: { id: TableId },
    });
    return res.status(200).send("Deleted");
  } else if (method === "PUT") {
    const { id, name } = req.body;
    const isValid = id && name.trim() !== "";
    if (!isValid) return res.status(400).send("data is required");
    const exist = await prisma.table.findFirst({
      where: { id },
    });
    if (!exist) return res.status(400).send("Bad request");

    const table = await prisma.table.update({
      data: { name },
      where: { id },
    });

    return res.status(200).json({ table });
  }
  res.status(405).send("Method not allowed");
}
