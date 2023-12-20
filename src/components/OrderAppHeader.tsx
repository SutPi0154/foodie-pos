import { useAppSelector } from "@/store/hooks";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Home from "@mui/icons-material/Home";
import LightModeIcon from "@mui/icons-material/LightMode";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { Box, IconButton, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";

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
  const isCartOrActiveOrderPage = isCart || isActiveOrder;
  const company = useAppSelector((state) => state.company.item);
  const handleThemeToggle = () => {
    setDarkMode(!isDarkMode);
  };
  return (
    <>
      <Box
        sx={{
          display: { xs: "none", sm: "flex", mb: 4 },
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 10,
            right: { xs: 40, md: 80, lg: 200 },
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
                  router.push({ pathname: "/order/cart", query: router.query })
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
                    top: -10,
                    right: -10,
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
        {isHome && (
          <Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                  color: "#4C4C6D",
                  mt: 15,
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
    </>
  );
};

export default React.memo(OrderAppHeader);
