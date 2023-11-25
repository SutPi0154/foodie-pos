import MenuCard from "@/components/MenuCard";
import { useAppSelector } from "@/store/hooks";
import { Box, Tab, Tabs } from "@mui/material";
import { MenuCategory } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const OrderPage = () => {
  const { isReady, ...router } = useRouter();
  const query = router.query;
  const tableId = query.tableId as string;
  const menuCategories = useAppSelector((store) => store.menuCategory.items);
  const menuCategoryMenu = useAppSelector(
    (store) => store.menuCategoryMenu.items
  );
  const menus = useAppSelector((store) => store.menu.items);
  const [value, setValue] = useState(0);
  const [selectedMenuCategory, setSelectedMenuCategory] =
    useState<MenuCategory>();
  useEffect(() => {
    if (isReady && !tableId) {
      router.push("/");
      console.log("back");
    }
  }, [isReady, tableId, router]);

  useEffect(() => {
    if (menuCategories.length) {
      setSelectedMenuCategory(menuCategories[0]);
    }
  }, [menuCategories]);
  const renderMenus = () => {
    const isValid = tableId && selectedMenuCategory;
    if (!isValid) return null;

    const validMenuIds = menuCategoryMenu
      .filter((item) => item.menuCategoryId === selectedMenuCategory?.id)
      .map((item) => item.menuId);
    const validMenus = menus.filter((item) => validMenuIds.includes(item.id));
    return validMenus.map((item) => {
      const href = { pathname: `/order/menus/${item.id}`, query };
      return <MenuCard key={item.id} menu={item} href={href} />;
    });
  };
  return (
    <Box>
      <Box>
        <Tabs
          TabIndicatorProps={{
            style: { background: "secondary.main" },
          }}
          value={value}
          onChange={(e, value) => {
            setValue(value);
          }}
          variant="scrollable"
          sx={{
            ".Mui-selected": {
              color: "primary.main",
              fontWeight: "bold",
            },
          }}
        >
          {menuCategories.map((item) => {
            return (
              <Tab
                key={item.id}
                label={item.name}
                sx={{ color: "#4C4C6D" }}
                onClick={() => setSelectedMenuCategory(item)}
              />
            );
          })}
        </Tabs>
      </Box>
      <Box sx={{ pt: 2, display: "flex" }}>{renderMenus()}</Box>
    </Box>
  );
};

export default OrderPage;
