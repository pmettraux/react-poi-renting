import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import '../poi-modal/poi-modal.scss'


export default class FormDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        open: false
    };
  }

  handleClickOpen = () =>  {
    this.setState((state) => ({
        open : state.open = true
    }));
  }

  handleClose = () =>  {
    this.setState((state) => ({
        open : state.open = false
    }));
  }

  render() {
  return (
    <div>
        <div className="add-poi-fab" onClick={this.handleClickOpen}>
            <Fab className="fab" color="primary" aria-label="add">
                <AddIcon />
            </Fab>
        </div>
        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">New POI</DialogTitle>
            <DialogContent>
            <DialogContentText>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Name"
                type="text"
                fullWidth
            />
            <div className="upload-poi-picture">
                <Button component="label">
                    <CloudUploadIcon color="primary"></CloudUploadIcon>
                    <input type="file" style={{ display: "none" }}/>
                </Button>
                <span>Upload a picture of the POI</span>
            </div>
            </DialogContent>
            <DialogActions>
            <Button onClick={this.handleClose} color="primary">
                Cancel
            </Button>
            <Button onClick={this.handleClose} color="primary">
                Submit
            </Button>
            </DialogActions>
        </Dialog>
    </div>
  );
  }
}
