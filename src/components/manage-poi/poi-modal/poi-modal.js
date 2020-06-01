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
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MyLocationIcon from '@material-ui/icons/MyLocation';

export default class FormDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        open: false,
        geolocationAvailable: false,
        form: {
            lat: '',
            lng: '',
            name: '',
            description: '',
        }
    };
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getMyLocation = this.getMyLocation.bind(this);
  }

  componentDidMount() {
    if ('geolocation' in navigator) {
        this.setState({ geolocationAvailable: true });
    }
  }

  handleClickOpen() {
    this.setState(() => ({
        open: true
    }));
  }

  handleClose() {
    this.setState(() => ({
        open: false
    }));
  }

  handleChange(event) {
    let data = this.state.form;
    data[event.target.id] = event.target.value;
    this.setState({
      form: data,
    });
  }

  createPoi() {
    console.log('TODO: CREATE POI');
  }

  getMyLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
        let data = this.state.form;
        data.lat = position.coords.latitude;
        data.lng = position.coords.longitude;
        this.setState({
            form: data
        });
    });
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
                <form onSubmit={this.createPoi}>
                    <DialogTitle id="form-dialog-title">New POI</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please fill the information in the form bellow
                        </DialogContentText>
                        <Grid container spacing={3}>
                            <Grid item xs={4}>
                                <TextField 
                                    id="lat" 
                                    label="Latitude" 
                                    margin="dense"
                                    variant="outlined"
                                    value={this.state.form.lat}
                                    onChange={this.handleChange}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField 
                                    id="lng" 
                                    label="Longitude" 
                                    margin="dense"
                                    variant="outlined"
                                    value={this.state.form.lng}
                                    onChange={this.handleChange}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                {
                                    this.state.geolocationAvailable && (
                                    <IconButton onClick={this.getMyLocation}>
                                        <MyLocationIcon />
                                    </IconButton>
                                    )
                                }
                            </Grid>
                        </Grid>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Name"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={this.state.form.name}
                            onChange={this.handleChange}
                        />
                        <TextField
                            id="description"
                            label="Description"
                            margin="dense"
                            multiline
                            rows={4}
                            fullWidth
                            variant="outlined"
                            value={this.state.form.description}
                            onChange={this.handleChange}
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
                </form>
            </Dialog>
        </div>
    );
  }
}
