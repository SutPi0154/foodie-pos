import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
const NewOrder = ({ open, setOpen }: Props) => {
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Create new Order </DialogTitle>
      <DialogContent>
        <Typography>New Order </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default NewOrder;
