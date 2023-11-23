import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { Box, IconButton, Typography } from "@mui/material";

interface Props {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}

const QuantitySelector = ({ quantity, onDecrease, onIncrease }: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        maxWidth: "100px",
        mt: 5,
      }}
    >
      <IconButton color="primary" onClick={onDecrease}>
        <RemoveCircleIcon />
      </IconButton>
      <Typography>{quantity}</Typography>

      <IconButton color="primary" onClick={onIncrease}>
        <AddCircleIcon />
      </IconButton>
    </Box>
  );
};

export default QuantitySelector;
