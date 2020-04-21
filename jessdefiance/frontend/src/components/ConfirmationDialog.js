import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@material-ui/core";

function ConfirmationDialog({ open, onClose, onConfirm, onDecline }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Czy na pewno?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Let Google help apps determine location. This means sending anonymous location data to
          Google, even when no apps are running.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDecline} color="primary">
          Nie
        </Button>
        <Button onClick={onConfirm} color="primary" autoFocus>
          Tak
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationDialog;
