import { useAppSelector } from "@/store/hooks";
import { Box, Chip, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import Addons from "./Addons";

interface Props {
  menuId: number;
  selectedAddonIds: number[];
  setSelectedAddonIds: Dispatch<SetStateAction<number[]>>;
}
const AddonCategories = ({
  menuId,
  selectedAddonIds,
  setSelectedAddonIds,
}: Props) => {
  const allMenuAddonCategories = useAppSelector(
    (store) => store.menuAddonCategory.items
  );
  const addonCategoryIds = allMenuAddonCategories
    .filter((item) => item.menuId === menuId)
    .map((item) => item.addonCategoryId);
  const addonCategories = useAppSelector(
    (store) => store.addonCategory.items
  ).filter((item) => addonCategoryIds.includes(item.id));
  return (
    <Box>
      {addonCategories.map((item) => {
        return (
          <Box
            key={item.id}
            sx={{
              mb: 5,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "300px",
              }}
            >
              <Typography variant="h6" sx={{ userSelect: "none" }}>
                {item.name}
              </Typography>
              <Chip label={item.isRequired ? "required" : "Optional"}></Chip>
            </Box>
            <Box sx={{ pl: 1, mt: 2 }}>
              <Addons
                setSelectedAddonIds={setSelectedAddonIds}
                selectedAddonIds={selectedAddonIds}
                addonCategoryId={item.id}
              />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default AddonCategories;
