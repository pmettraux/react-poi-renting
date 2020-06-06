import React, { useState, useEffect } from 'react';
import '../poi-modal/poi-modal.scss'
import { 
    IconButton,
    Grid,
    Fab,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle 
} from '@material-ui/core';
import {
    MyLocationIcon,
    CloudUploadIcon,
    AddIcon,
} from '@material-ui/icons';
import { useAuth0 } from '../../../shared/react-auth0-spa';
import { createPoi } from '../../../shared/api.service';

export default function FormDialog() {
    const [open, setOpen] = useState(false);
    const [geolocationAvailable, setGeolocationAvailable] = useState(false);
    const [form, setForm] = useState({
        lat: '',
        lng: '',
        name: '',
        description: '',
    });

    const { loginWithRedirect, getTokenSilently } = useAuth0();

    useEffect(() => {
        if ('geolocation' in navigator) {
            setGeolocationAvailable(true);
        }
    })

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleChange = (e) => {
        const {id, value} = e.target
        setForm({...form, [id]: value})
    }

    const sendCreatePoi = async(e) => {
        e.preventDefault();
        await createPoi(
            form,
            getTokenSilently,
            loginWithRedirect
        );
    }

    const getMyLocation = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            setForm({...form, lat: position.coords.latitude, lng: position.coords.longitude});
        });
    }

    return (
        <div>
            <div className="add-poi-fab" onClick={handleClickOpen}>
                <Fab className="fab" color="primary" aria-label="add">
                    <AddIcon />
                </Fab>
            </div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <form onSubmit={sendCreatePoi}>
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
                                    value={form.lat}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField 
                                    id="lng" 
                                    label="Longitude" 
                                    margin="dense"
                                    variant="outlined"
                                    value={form.lng}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                {
                                    geolocationAvailable && (
                                    <IconButton onClick={getMyLocation}>
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
                            value={form.name}
                            onChange={handleChange}
                        />
                        <TextField
                            id="description"
                            label="Description"
                            margin="dense"
                            multiline
                            rows={4}
                            fullWidth
                            variant="outlined"
                            value={form.description}
                            onChange={handleChange}
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
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button type="submit" color="primary">
                        Submit
                    </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
}
