import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@material-ui/core";

function ConfirmationDialog({ open, onClose, onConfirm, onDecline }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Potwierdzenie</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Czy na pewno chcesz usunąć ten element?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDecline} color="primary" autoFocus>
          Nie
        </Button>
        <Button onClick={onConfirm} color="primary">
          Tak
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationDialog;
