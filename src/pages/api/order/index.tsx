// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { CartItem } from "@/types/cart";
import { prisma } from "@/utils/db";
import { getCartTotalPrice } from "@/utils/general";
import { ORDERSTATUS } from "@prisma/client";
import { nanoid } from "nanoid";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  if (method === "GET") {
    const isValid = req.query.orderSeq;
    if (!isValid) return res.status(400).send("Bad request");
    const orderSeq = String(req.query.orderSeq);
    const exist = await prisma.order.findMany({ where: { orderSeq } });
    if (!exist) return res.status(400).send("Bad request");
    return res.status(200).json({ orders: exist });
  } else if (method === "POST") {
    const { tableId, cartItems } = req.body;
    const isValid = tableId && cartItems.length;
    if (!isValid) return res.status(400).send("bad request");
    const order = await prisma.order.findFirst({
      where: {
        tableId,
        status: { in: [ORDERSTATUS.COOKING, ORDERSTATUS.PENDING] },
      },
    });

    const orderSeq = nanoid();
    for (const item of cartItems) {
      let cartItem = item as CartItem;
      const hasAddon = cartItem.addons.length > 0;
      if (hasAddon && order) {
        for (const addon of cartItem.addons) {
          await prisma.order.create({
            data: {
              menuId: cartItem.menu.id,
              quantity: cartItem.quantity,
              orderSeq,
              addonId: addon.id,
              status: ORDERSTATUS.PENDING,
              itemId: cartItem.id,
              totalPrice:
                order.orderSeq === orderSeq
                  ? order.totalPrice + getCartTotalPrice(cartItems)
                  : getCartTotalPrice(cartItems),
              tableId,
            },
          });
        }
      } else {
        await prisma.order.create({
          data: {
            menuId: cartItem.menu.id,
            quantity: cartItem.quantity,
            orderSeq,
            status: ORDERSTATUS.PENDING,
            itemId: cartItem.id,
            totalPrice: getCartTotalPrice(cartItems),
            tableId,
          },
        });
      }
    }
    const orders = await prisma.order.findMany({
      where: { orderSeq },
    });
    return res.status(200).json({ orders });
  } else if (method === "PUT") {
    const status = req.body.status as ORDERSTATUS;
    const itemId = req.query.itemId as string;
    const isValid = itemId && status;
    if (!isValid) return res.status(400).send("Bad request");
    const exist = await prisma.order.findFirst({ where: { itemId } });
    if (!exist) return res.status(400).send("Bad request");
    const orderSeq = exist.orderSeq;
    await prisma.order.updateMany({
      data: { status: status as ORDERSTATUS },
      where: { itemId },
    });

    const orders = await prisma.order.findMany({
      where: { tableId: exist.tableId, isArchived: false },
      orderBy: { id: "asc" },
    });
    res.status(200).json({ orders });
  }
  res.status(405).send("Method not allowed");
}
