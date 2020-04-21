import React, {useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@material-ui/core";

function TagDialog({ open, onAdd, onClose }) {
  const [ name, setName ] = useState("");

  const addTag = () => {
    onAdd(name);
  };

  const close = () => {
    setName("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>Dodaj tag</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Nazwa tagu"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Zamknij
        </Button>
        <Button onClick={addTag} color="primary">
          Dodaj
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TagDialog;
