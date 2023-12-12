import ItemCard from "@/components/ItemCard";
import NewTable from "@/components/NewTable";
import { useAppSelector } from "@/store/hooks";
import TableBarIcon from "@mui/icons-material/TableBar";
import { Box, Button } from "@mui/material";
import { useState } from "react";

const TablesPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const tables = useAppSelector((store) => store.table.items);
  const handleQrCodeImagePrint = (assetUrl: string) => {
    const imageWindow = window.open("");
    imageWindow?.document.write(
      `<html><head><title>Print Image</title></head><body style="text-align: center;"><img src="${assetUrl}" onload="window.print();window.close()" /></body></html>`
    );
    imageWindow?.document.close();
  };

  if (!tables) return;
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={() => {
            setOpen(true);
          }}
        >
          New Table
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          mt: 4,
          gap: 4,
          justifyContent: { xs: "center", sm: "flex-start" },
        }}
      >
        {tables.map((item) => (
          <Box
            key={item.id}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <ItemCard
              icon={<TableBarIcon />}
              title={item.name}
              href={`/back-office/tables/${item.id}`}
            />
            <Button
              onClick={() => {
                handleQrCodeImagePrint(item.assetUrl);
              }}
              sx={{}}
              variant="contained"
            >
              Print OR
            </Button>
          </Box>
        ))}
      </Box>
      <NewTable open={open} setOpen={setOpen} />
    </Box>
  );
};
export default TablesPage;
