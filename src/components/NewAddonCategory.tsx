import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
const NewAddonCategory = ({ open, setOpen }: Props) => {
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Create new Addon Category </DialogTitle>
      <DialogContent>
        <Typography>New Addon Category </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default NewAddonCategory;
