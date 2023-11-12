import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { Menu } from "@prisma/client";
import Link from "next/link";

import PaidIcon from "@mui/icons-material/Paid";
interface Props {
  menu: Menu;
  href: string | object;
  isAvailable: boolean;
}

const MenuCard = ({ menu, href, isAvailable }: Props) => {
  return (
    <Link
      key={menu.id}
      href={href}
      style={{
        textDecoration: "none",
        opacity: isAvailable === false ? 0.4 : 1,
        marginRight: "15px",
        marginBottom: "20px",
      }}
    >
      <Card sx={{ width: 350, pb: 2 }}>
        <CardMedia
          sx={{ height: 250, objectFit: "contain" }}
          image={menu.assetUrl || ""}
          component={"div"}
        ></CardMedia>
        <CardContent>
          <Typography gutterBottom variant="h6" sx={{ mb: 0 }}>
            {menu.name}
          </Typography>
          <Box sx={{ display: "flex" }}>
            <PaidIcon color="success" />
            <Typography>{menu.price}</Typography>
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
};

export default MenuCard;
