import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { Menu } from "@prisma/client";
import Link from "next/link";

import PaidIcon from "@mui/icons-material/Paid";
interface Props {
  menu: Menu;
  href: string | object;
  isAvailable?: boolean;
}

const MenuCard = ({ menu, href, isAvailable }: Props) => {
  return (
    <Link
      key={menu.id}
      href={href}
      style={{
        textDecoration: "none",
        opacity: isAvailable === false ? 0.4 : 1,
        marginBottom: "20px",
      }}
    >
      <Card sx={{ width: 300, pb: 2 }}>
        <CardMedia
          sx={{
            height: 250,
            width: "auto",
            backgroundSize: "contain",
            borderRadius: 3,
          }}
          image={menu.assetUrl || "/default-menu.png"}
          component={"div"}
        ></CardMedia>

        <CardContent>
          <Typography gutterBottom variant="h6" sx={{ mb: 0 }}>
            {menu.name}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <PaidIcon color="primary" />
            <Typography sx={{ color: "primary.main" }}>{menu.price}</Typography>
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
};

export default MenuCard;
