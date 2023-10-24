import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
const NewAddon = ({ open, setOpen }: Props) => {
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Create new Addon </DialogTitle>
      <DialogContent>
        <Typography>New Addon </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default NewAddon;
