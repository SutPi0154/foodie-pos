import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
const NewTable = ({ open, setOpen }: Props) => {
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Create new Table </DialogTitle>
      <DialogContent>
        <Typography>New Table </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default NewTable;
