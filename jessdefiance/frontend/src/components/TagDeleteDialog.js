import React, {useEffect} from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@material-ui/core";
import {getPosts} from "../helpers/postsApi";

function TagDeleteDialog({ tagId, open, onClose, onConfirm, onDecline }) {

  useEffect(() => {
    getPosts({ tag: tagId })
      .then(() => {

      });
  }, [tagId]);

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

export default TagDeleteDialog;
