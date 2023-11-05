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
  if (method == "POST") {
    const session = await getServerSession(req, res, authOptions);
    const user = session?.user;
    const email = session?.user?.email as string;
    const dbUser = await prisma.user.findUnique({ where: { email } });
    if (!dbUser) return res.status(401).send("Unauthorized");
    const companyId = dbUser.companyId;
    const { name, address } = req.body;
    const isValid = name && address;
    if (!isValid)
      return res.status(400).send("userName and address is not found");
    const newLocation = await prisma.location.create({
      data: { name, address, companyId },
    });
    return res.status(200).json(newLocation);
  } else if (method === "PUT") {
    const { id, name, address, companyId } = req.body;
    const isValid =
      id && name.trim() !== "" && address.trim() !== "" && companyId;
    if (!isValid) return res.status(400).send("bad request");
    const isExist = await prisma.company.findFirst({
      where: { id: companyId },
    });
    if (!isExist) return res.status(400).send("bad request");
    const company = await prisma.company.update({
      data: { address },
      where: { id: companyId },
    });
    const location = await prisma.location.update({
      data: { name, address },
      where: { id },
    });
    return res.status(200).json({ location });
  } else if (method === "DELETE") {
    const locationId = Number(req.query.id);
    const location = await prisma.location.findFirst({
      where: { id: locationId },
    });
    if (!location) return res.status(400).send("bad request");
    await prisma.location.update({
      data: { isArchived: true },
      where: { id: locationId },
    });
    return res.status(200).send("DELETED");
  }
  res.status(405).send("Method not allowed");
}
