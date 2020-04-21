import React, {useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";

function ImageDialog({ open, onAdd, onClose }) {
  const [ name, setName ] = useState("");
  const [ image, setImage ] = useState({});

  const addImage = () => {
    onAdd(name, image);
  };

  const close = () => {
    setName("");
    setImage({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>Dodaj zdjęcie</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Nazwa zdjęcia"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          fullWidth
        />
        {
          image.name ?
            <div style={{marginTop: "1rem"}}>
              { image.name }
              <IconButton onClick={() => setImage({})}><DeleteIcon/></IconButton>
            </div> :
            <Button component="label" startIcon={<AddIcon/>} style={{marginTop: "1rem"}}>
              Wybierz zdjęcie
              <input
                type="file"
                style={{ display: "none" }}
                onChange={e => setImage(e.target.files[0])}
              />
            </Button>
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Zamknij
        </Button>
        <Button onClick={addImage} color="primary">
          Dodaj
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ImageDialog;
