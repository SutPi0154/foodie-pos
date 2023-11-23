import AddonCategories from "@/components/AddonCategories";
import QuantitySelector from "@/components/QuantitySelector";
import { useAppSelector } from "@/store/hooks";
import { Box } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

const MenuDetail = () => {
  const { query, isReady } = useRouter();
  const menuId = Number(query.id);
  const menus = useAppSelector((store) => store.menu.items);
  const menu = menus.find((item) => item.id === menuId);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddonIds, setSelectedAddonIds] = useState<number[]>([]);

  const handleDecreaseQuantity = () => {
    const newValue = quantity - 1 === 0 ? 1 : quantity - 1;
    setQuantity(newValue);
  };
  const handleIncreaseQuantity = () => {
    const newValue = quantity + 1;
    setQuantity(newValue);
  };
  if (!isReady || !menu) return null;

  return (
    <Box>
      <Box>
        <Image
          src={menu.assetUrl || "/default-menu.png"}
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "10%", height: "auto" }}
          alt="menu img"
        />
      </Box>
      <Box>
        <AddonCategories
          menuId={menuId}
          selectedAddonIds={selectedAddonIds}
          setSelectedAddonIds={setSelectedAddonIds}
        />
        <QuantitySelector
          quantity={quantity}
          onDecrease={handleDecreaseQuantity}
          onIncrease={handleIncreaseQuantity}
        />
      </Box>
    </Box>
  );
};

export default MenuDetail;
