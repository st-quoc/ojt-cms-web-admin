import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

function ConfirmChangeStatusModal({ open, title, description, onConfirm, onCancel }) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title || "Confirm Change Status"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {description || "Are you sure you want to change the status of this item?"}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="success">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmChangeStatusModal;
