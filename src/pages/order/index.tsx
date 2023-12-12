// import MenuCard from "@/components/MenuCard";
// import { useAppSelector } from "@/store/hooks";
// import { Box, Tab, Tabs } from "@mui/material";
// import { MenuCategory } from "@prisma/client";
// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";

// const OrderPage = () => {
//   const { isReady, ...router } = useRouter();
//   const query = router.query;
//   const tableId = query.tableId as string;
//   const menuCategories = useAppSelector((store) => store.menuCategory.items);
//   const menuCategoryMenu = useAppSelector(
//     (store) => store.menuCategoryMenu.items
//   );
//   const menus = useAppSelector((store) => store.menu.items);
//   const [value, setValue] = useState(0);
//   const [selectedMenuCategory, setSelectedMenuCategory] =
//     useState<MenuCategory>();
//   useEffect(() => {
//     if (isReady && !tableId) {
//       router.push("/");
//     }
//   }, [isReady, tableId, router]);

//   useEffect(() => {
//     if (menuCategories.length) {
//       setSelectedMenuCategory(menuCategories[0]);
//     }
//   }, [menuCategories]);
//   const renderMenus = () => {
//     const isValid = tableId && selectedMenuCategory;
//     if (!isValid) return null;

//     const validMenuIds = menuCategoryMenu
//       .filter((item) => item.menuCategoryId === selectedMenuCategory?.id)
//       .map((item) => item.menuId);
//     const validMenus = menus.filter((item) => validMenuIds.includes(item.id));
//     return validMenus.map((item) => {
//       const href = { pathname: `/order/menus/${item.id}`, query };
//       return <MenuCard key={item.id} menu={item} href={href} />;
//     });
//   };
//   return (
//     <Box
//       sx={{
//         position: "relative",
//         zIndex: 5,
//         px: 2,
//         top: 0,
//       }}
//     >
//       <Box sx={{}}>
//         <Tabs
//           TabIndicatorProps={{
//             style: { background: "secondary.main" },
//           }}
//           value={value}
//           onChange={(e, value) => {
//             setValue(value);
//           }}
//           variant="scrollable"
//           sx={{
//             ".Mui-selected": {
//               color: "primary.main",
//               fontWeight: "bold",
//             },
//             position: "fixed",
//             bgcolor: "container.main",
//             width: 900,
//             zIndex: 10,
//           }}
//         >
//           {menuCategories.map((item) => {
//             return (
//               <Tab
//                 key={item.id}
//                 label={item.name}
//                 sx={{ color: "#4C4C6D" }}
//                 onClick={() => setSelectedMenuCategory(item)}
//               />
//             );
//           })}
//         </Tabs>
//       </Box>
//       <Box
//         sx={{
//           display: "flex",
//           flexWrap: "wrap",
//           pt: 10,
//           justifyContent: { xs: "center", sm: "flex-start" },
//           mb: 100,
//           width: {
//             xs: "350px",
//             sm: "650px",
//             md: "780px",
//             lg: "1000px",
//             xl: "1200px",
//           },
//         }}
//       >
//         {renderMenus()}
//       </Box>
//     </Box>
//   );
// };

// export default OrderPage;

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
        TabIndicatorProps={{
          style: { background: "" },
        }}
        value={value}
        onChange={(evt, value) => setValue(value)}
        variant="scrollable"
        sx={{
          ".Mui-selected": {
            color: "",
            fontWeight: "bold",
          },
          position: "fixed",
          width: {
            xs: "350px",
            sm: "650px",
            md: "780px",
            lg: "1000px",
            xl: "1200px",
          },
          bgcolor: "container.main",
        }}
      >
        {menuCategories.map((item) => {
          return (
            <Tab
              key={item.id}
              label={item.name}
              sx={{ color: "" }}
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
          width: {
            xs: "350px",
            sm: "650px",
            md: "780px",
            lg: "1000px",
            xl: "1100px",
          },
          gap: 2,
          overflow: "hidden",
          overflowY: "scroll",
        }}
      >
        {renderMenus()}
      </Box>
    </Box>
  );
};

export default OrderApp;
