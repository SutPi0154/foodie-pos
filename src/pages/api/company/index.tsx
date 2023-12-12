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
  if (method === "PUT") {
    const { id, name, street, township, city } = req.body;
    const isValid =
      id &&
      name.trim() !== "" &&
      street.trim() !== "" &&
      township.trim() !== "" &&
      city.trim() !== "";
    if (!isValid) return res.status(400).send("data is required");
    const exist = await prisma.company.findFirst({
      where: { id },
    });
    if (!exist) return res.status(400).send("Bad request");

    const company = await prisma.company.update({
      data: { name, street, township, city },
      where: { id },
    });

    return res.status(200).json({ company });
  }
  res.status(405).send("Method not allowed");
}
