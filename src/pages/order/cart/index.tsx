import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeFromCart } from "@/store/slices/cartSlice";
import { CartItem } from "@/types/cart";
import { getCartTotalPrice } from "@/utils/general";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Avatar, Box, Button, Divider, Typography } from "@mui/material";
import { Addon } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Cart = () => {
  const cartItems = useAppSelector((store) => store.cart.items);
  const router = useRouter();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!cartItems.length) {
      router.push({ pathname: "/order", query: router.query });
    }
  }, [cartItems, router]);

  const handleRemoveFromCart = (cartItem: CartItem) => {
    dispatch(removeFromCart(cartItem));
  };
  const renderAddons = (addons: Addon[]) => {
    if (!addons.length) return null;
    return addons.map((item) => {
      return (
        <Box
          key={item.id}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography color={"primary"} sx={{ fontStyle: "italic" }}>
            {item.name}
          </Typography>
          <Typography color={"primary"} sx={{ fontStyle: "italic" }}>
            {item.price}
          </Typography>
        </Box>
      );
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        p: 4,
        bgcolor: "info.main",
        mx: 2,
        position: "relative",
        top: 150,
      }}
    >
      <Box sx={{ width: { xs: "100%", md: "500px" } }}>
        <Typography
          color={"primary"}
          sx={{
            textAlign: "center",
            md: 4,
          }}
        >
          Review your order
        </Typography>
        {cartItems.map((cartItem) => {
          const { menu, addons, quantity } = cartItem;
          return (
            <Box key={cartItem.id}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  sx={{ width: 25, height: 25, mr: 1, bgcolor: "success.main" }}
                >
                  {quantity}
                </Avatar>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Typography color={"primary"}>{menu.name}</Typography>
                  <Typography color={"primary"}>{menu.price}</Typography>
                </Box>
              </Box>

              <Box sx={{ pl: 6 }}>{renderAddons(addons)}</Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mb: 3,
                  mt: 1,
                }}
              >
                <DeleteIcon
                  color="primary"
                  sx={{ mr: 2, cursor: "pointer" }}
                  onClick={() => {
                    handleRemoveFromCart(cartItem);
                  }}
                />
                <EditIcon
                  color="primary"
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    router.push({
                      pathname: `menus/${menu.id}`,
                      query: { ...router.query, cartItemId: cartItem.id },
                    });
                  }}
                />
              </Box>
            </Box>
          );
        })}
        <Divider>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Typography color="primary" sx={{ fontSize: { sm: 22 } }}>
              Total: {getCartTotalPrice(cartItems)}
            </Typography>
          </Box>
          <Box sx={{ mt: 3, textAlign: "center" }} onClick={() => {}}>
            <Button variant="contained">Confirm order</Button>
          </Box>
        </Divider>
      </Box>
    </Box>
  );
};

export default Cart;
