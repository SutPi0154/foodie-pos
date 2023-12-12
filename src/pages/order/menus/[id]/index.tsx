import AddonCategories from "@/components/AddonCategories";
import QuantitySelector from "@/components/QuantitySelector";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import { CartItem } from "@/types/cart";
import { Box, Button, CardMedia } from "@mui/material";
import { Addon, MenuAddonCategory } from "@prisma/client";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const MenuDetail = () => {
  const { query, isReady, ...router } = useRouter();
  const menuId = Number(query.id);
  const cartItemId = query.cartItemId as string;
  const cartItems = useAppSelector((store) => store.cart.items);
  const cartItem = cartItems.find((item) => item.id === cartItemId);

  const menus = useAppSelector((store) => store.menu.items);
  const menu = menus.find((item) => item.id === menuId);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [isDisable, setIsDisable] = useState<boolean>(true);
  const allMenuAddonCategories: MenuAddonCategory[] = useAppSelector(
    (store) => store.menuAddonCategory.items
  );
  const addonCategoryIds: number[] = allMenuAddonCategories
    .filter((item) => item.menuId === menuId)
    .map((item) => item.addonCategoryId);
  const addonCategories = useAppSelector(
    (store) => store.addonCategory.items
  ).filter((item) => addonCategoryIds.includes(item.id));
  const dispatch = useAppDispatch();
  useEffect(() => {
    const isRequiredAddonCategoryLength = addonCategories.filter(
      (item) => item.isRequired
    ).length;
    const selectedRequiredAddons = selectedAddons.filter((selectedAddon) => {
      const addonCategory = addonCategories.find(
        (item) => item.id === selectedAddon.addonCategoryId
      );
      return addonCategory?.isRequired ? true : false;
    });
    const isDisable =
      isRequiredAddonCategoryLength !== selectedRequiredAddons.length;
    setIsDisable(isDisable);
  }, [selectedAddons, addonCategories]);
  const handleDecreaseQuantity = () => {
    const newValue = quantity - 1 === 0 ? 1 : quantity - 1;
    setQuantity(newValue);
  };
  const handleIncreaseQuantity = () => {
    const newValue = quantity + 1;
    setQuantity(newValue);
  };
  const handleAddToCart = () => {
    if (!menu) return;
    const newCartItem: CartItem = {
      id: cartItem ? cartItem.id : nanoid(7),
      menu,
      addons: selectedAddons,
      quantity,
    };
    dispatch(addToCart(newCartItem));
    const pathname = cartItem ? "/order/cart" : "/order";
    router.push({ pathname, query });
  };
  useEffect(() => {
    if (cartItem) {
      const { addons, quantity } = cartItem;
      setSelectedAddons(addons);
      setQuantity(quantity);
    }
  }, [cartItem, setSelectedAddons]);
  if (!isReady || !menu) return null;

  return (
    <Box sx={{ position: "relative", zIndex: 10, top: 40 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          p: 4,
        }}
      >
        <CardMedia
          image={menu.assetUrl || "/default-menu.png"}
          component={"div"}
          sx={{
            height: 250,
            width: "auto",
            backgroundSize: "contain",
            borderRadius: 3,
          }}
        ></CardMedia>
      </Box>
      <Box
        sx={{
          mt: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <AddonCategories
          addonCategories={addonCategories}
          selectedAddons={selectedAddons}
          setSelectedAddons={setSelectedAddons}
        />
        <QuantitySelector
          quantity={quantity}
          onDecrease={handleDecreaseQuantity}
          onIncrease={handleIncreaseQuantity}
        />
        <Button
          variant="contained"
          disabled={isDisable}
          onClick={handleAddToCart}
          sx={{ width: "fit-content", mt: 3, mb: 5 }}
        >
          {cartItem ? "Update Cart" : "Add to Cart"}
        </Button>
      </Box>
    </Box>
  );
};

export default MenuDetail;
