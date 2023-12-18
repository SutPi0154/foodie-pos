import MenuCard from "@/components/MenuCard";
import { useAppSelector } from "@/store/hooks";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { MenuCategory } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const OrderApp = () => {
  const { isReady, ...router } = useRouter();
  const query = router.query;
  const tableId = query.tableId as string;
  const menuCategories = useAppSelector((state) => state.menuCategory.items);
  const menuCategoryMenus = useAppSelector(
    (state) => state.menuCategoryMenu.items
  );
  const menus = useAppSelector((state) => state.menu.items);
  const [value, setValue] = useState(0);
  const [selectedMenuCategory, setSelectedMenuCategory] =
    useState<MenuCategory>();

  useEffect(() => {
    if (menuCategories.length) {
      setSelectedMenuCategory(menuCategories[0]);
    }
  }, [menuCategories]);

  useEffect(() => {
    if (isReady && !tableId) {
      router.push("/");
    }
  }, [isReady, tableId, router]);

  const renderMenus = () => {
    const validMenuIds = menuCategoryMenus
      .filter((item) => item.menuCategoryId === selectedMenuCategory?.id)
      .map((item) => item.menuId);
    const validMenus = menus.filter((item) => validMenuIds.includes(item.id));
    return validMenus.map((item) => {
      const href = { pathname: `/order/menus/${item.id}`, query };
      return <MenuCard key={item.id} menu={item} href={href} />;
    });
  };

  return (
    <Box sx={{ position: "relative", zIndex: 5, px: 2 }}>
      <Tabs
        TabIndicatorProps={{}}
        value={value}
        onChange={(evt, value) => setValue(value)}
        variant="scrollable"
        sx={{
          ".Mui-selected": {
            color: "",
            hover: {
              "&:hover": {
                color: "green !important",
              },
            },

            fontWeight: "bold",
          },
          width: {
            // xs: "350px",
            // sm: "650px",
            // md: "780px",
            // lg: "900px",
            // xl: "1000px",
          },
          bgcolor: "container.main",
        }}
      >
        {menuCategories.map((item) => {
          return (
            <Tab
              key={item.id}
              label={item.name}
              sx={{}}
              onClick={() => setSelectedMenuCategory(item)}
            />
          );
        })}
      </Tabs>
      <Box
        sx={{
          pt: 2,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: {
            xs: "center",
            sm: "center",
            md: "center",
            lg: "start",
          },
          height: "70vh",
          my: 4,
          // width: {
          //   xs: "350px",
          //   sm: "650px",
          //   md: "780px",
          //   lg: "900px",
          //   xl: "1000px",
          // },
          gap: 2,
        }}
      >
        {renderMenus()}
      </Box>
    </Box>
  );
};

export default OrderApp;
