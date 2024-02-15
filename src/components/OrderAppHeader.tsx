import { useAppSelector } from "@/store/hooks";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Home from "@mui/icons-material/Home";
import LightModeIcon from "@mui/icons-material/LightMode";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { Box, Drawer, IconButton, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";

import React, { useState } from "react";

interface Props {
  cartItemCount: number;
  isDarkMode: boolean;
  setDarkMode: (isDarkMode: boolean) => void;
}

const OrderAppHeader = ({ cartItemCount, isDarkMode, setDarkMode }: Props) => {
  const router = useRouter();
  const isHome = router.pathname === "/order";
  const isCart = router.pathname === "/order/cart";
  const isActiveOrder = router.pathname.includes("/order/active-order");
  const [drawer, setOpenDrawer] = useState(false);
  const isCartOrActiveOrderPage = isCart || isActiveOrder;
  const company = useAppSelector((state) => state.company.item);
  const handleThemeToggle = () => {
    setDarkMode(!isDarkMode);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "secondary.main",
          px: { xs: 4, lg: 10 },
          py: { xs: 1 },
        }}
      >
        <Box>
          <Typography
            sx={{ color: "primary.main", fontWeight: "bold", fontSize: 25 }}
          >
            Foodie Pos
          </Typography>
        </Box>
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box sx={{ height: "30%" }}>
            <TextField
              label="Search...."
              type="search"
              sx={{ my: 1 }}
              variant="filled"
            />
          </Box>
          <Box
            sx={{
              cursor: "pointer",
            }}
          >
            {isCartOrActiveOrderPage ? (
              <Home
                onClick={() =>
                  router.push({
                    pathname: "/order",
                    query: { tableId: router.query.tableId },
                  })
                }
                sx={{
                  fontSize: "40px",
                  color: "primary.light",
                }}
              />
            ) : (
              <>
                <ShoppingCartCheckoutIcon
                  onClick={() =>
                    router.push({
                      pathname: "/order/cart",
                      query: router.query,
                    })
                  }
                  sx={{
                    fontSize: "40px",
                    color: "primary.light",
                  }}
                />
                {cartItemCount > 0 && (
                  <Typography
                    variant="h5"
                    sx={{
                      textAlign: "right",
                      color: "primary.light",
                      position: "absolute",
                      top: 2,
                      zIndex: 1000,
                      right: 80,
                    }}
                  >
                    {cartItemCount}
                  </Typography>
                )}
              </>
            )}
          </Box>
          <IconButton
            color="inherit"
            sx={{ cursor: "pointer", zIndex: 10 }}
            onClick={handleThemeToggle}
          >
            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Box>
        <Drawer
          open={drawer}
          anchor="top"
          onClose={() => {
            setOpenDrawer(false);
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box sx={{ width: "80%" }}>
              <TextField
                label="Search...."
                type="search"
                sx={{ my: 1, width: "100%", mx: "auto" }}
                variant="filled"
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                width: "80%",
                alignItems: "center",
                // alignSelf: "self-start",
              }}
            >
              <Typography>Theme</Typography>
              <IconButton
                color="inherit"
                sx={{ cursor: "pointer", zIndex: 10 }}
                onClick={handleThemeToggle}
              >
                {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Box>
          </Box>
        </Drawer>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="end"
          onClick={() => {
            // dispatch(setOpenDrawer());
            setOpenDrawer(true);
          }}
          sx={{ display: { sm: "block", md: "none" } }}
        >
          <MenuIcon />
        </IconButton>
      </Box>
      {isHome && (
        <Box>
          <Box sx={{ textAlign: "center", py: { xs: 2, md: 4 } }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                color: "#4C4C6D",
              }}
            >
              {company?.name}
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontStyle: "italic", lineHeight: 1.2 }}
            >
              {company?.street}
              <br /> {company?.township}, {company?.city}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default React.memo(OrderAppHeader);
