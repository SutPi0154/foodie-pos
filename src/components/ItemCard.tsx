import { Paper, Typography } from "@mui/material";
import Link from "next/link";
import { ReactNode } from "react";
interface Props {
  title: string;
  href: string;
  icon: ReactNode;
}
const ItemCard = ({ icon, href, title }: Props) => {
  if (href) {
    return (
      <Link href={href} style={{ textDecoration: "none" }}>
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
