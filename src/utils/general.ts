import { CartItem } from "@/types/cart";
import { OrderItem, orderAddon } from "@/types/order";
import { Addon, Menu, Order, Table } from "@prisma/client";

export const getCartTotalPrice = (cart: CartItem[]) => {
  const totalPrice = cart.reduce((prev, curr) => {
    const menuPrice = curr.menu.price;
    const totalAddonPrice = curr.addons.reduce(
      (addonPrice, addon) => (addonPrice += addon.price),
      0
    );
    prev += (menuPrice + totalAddonPrice) * curr.quantity;
    return prev;
  }, 0);
  return totalPrice;
};
export const formatOrder = (
  orders: Order[],
  addons: Addon[],
  menus: Menu[],
  tables: Table[]
) => {
  const orderItemIds: string[] = [];
  orders.forEach((order) => {
    const itemId = order.itemId;
    const exist = orderItemIds.find((orderItemId) => orderItemId === itemId);
    if (!exist) orderItemIds.push(itemId);
  });

  const orderItems: OrderItem[] = orderItemIds.map((orderItemId) => {
    const CurrentOrders = orders.filter(
      (order) => order.itemId === orderItemId
    );
    const addonIds = CurrentOrders.map((item) => item.addonId);
    let orderAddons: orderAddon[] = [];
    if (addonIds.length) {
      addonIds.forEach((addonId) => {
        const addon = addons.find((addon) => addon.id === addonId) as Addon;
        if (!addon) return;
        const exist = orderAddons.find(
          (orderAddon) => orderAddon.addonCategoryId === addon.addonCategoryId
        );
        if (exist) {
          orderAddons = orderAddons.map((item) => {
            const isSameParent = item.addonCategoryId === addon.addonCategoryId;
            if (isSameParent) {
              return {
                addonCategoryId: addon.addonCategoryId,
                addons: [...item.addons, addon].sort((a, b) =>
                  a.name.localeCompare(b.name)
                ),
              };
            } else {
              return item;
            }
          });
        } else {
          orderAddons.push({
            addonCategoryId: addon.addonCategoryId,
            addons: [addon],
          });
        }
      });
    }
    return {
      itemId: orderItemId,
      status: CurrentOrders[0].status,
      orderAddons: addonIds.length
        ? orderAddons.sort((a, b) => a.addonCategoryId - b.addonCategoryId)
        : [],
      menu: menus.find((item) => item.id === CurrentOrders[0].menuId) as Menu,
      table: tables.find(
        (item) => item.id === CurrentOrders[0].tableId
      ) as Table,
    };
  });

  return orderItems.sort((a, b) => a.itemId.localeCompare(b.itemId));
};
