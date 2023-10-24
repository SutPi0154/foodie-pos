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
  }
  res.status(405).send("Method not allowed");
}
