import { Paper, Typography } from "@mui/material";
import Link from "next/link";
import { ReactNode } from "react";
interface Props {
  title: string;
  href: string;
  icon: ReactNode;
  isAvailable?: boolean;
}
const ItemCard = ({ icon, href, title, isAvailable = true }: Props) => {
  if (href) {
    return (
      <Link href={href} style={{ textDecoration: "none" }}>
        <Paper
          elevation={2}
          title={isAvailable === false ? "is disable" : ""}
          sx={{
            width: 170,
            justifyContent: "center",
            alignItems: "center",
            height: 170,
            p: 2,
            opacity: isAvailable === false ? 0.4 : 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {icon}
          <Typography sx={{ mt: 1 }}>{title}</Typography>
        </Paper>
      </Link>
    );
  }
  return (
    <Paper
      elevation={2}
      sx={{
        width: 170,
        justifyContent: "center",
        alignItems: "center",
        height: 170,
        p: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {icon}
      <Typography sx={{ mt: 1 }}>{title}</Typography>
    </Paper>
  );
};

export default ItemCard;
