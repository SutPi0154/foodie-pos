import ItemCard from "@/components/ItemCard";
import NewTable from "@/components/NewTable";
import { useAppSelector } from "@/store/hooks";
import TableBarIcon from "@mui/icons-material/TableBar";
import { Box, Button } from "@mui/material";
import { useState } from "react";

const TablesPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const tables = useAppSelector((store) => store.table.items);
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
      <Box sx={{ display: "flex", flexWrap: "wrap", mt: 4, gap: 4 }}>
        {tables.map((item) => (
          <ItemCard
            icon={<TableBarIcon />}
            title={item.name}
            href={`/back-office/tables/${item.id}`}
            key={item.id}
          />
        ))}
      </Box>
      <NewTable open={open} setOpen={setOpen} />
    </Box>
  );
};
export default TablesPage;
