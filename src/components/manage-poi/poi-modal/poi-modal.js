import React, { useState, useEffect } from 'react';
import useStateWithCallback from 'use-state-with-callback';
import PropTypes from 'prop-types';
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
    DialogTitle,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Switch,
} from '@material-ui/core';
import CloudUpload from '@material-ui/icons/CloudUpload';
import {
    MyLocation,
    Add,
} from '@material-ui/icons';
import { useAuth0 } from '../../../shared/react-auth0-spa';
import { createPoi } from '../../../shared/api.service';

function FormDialog(props) {
    const emptyForm = {
        lat: '',
        lng: '',
        price: '',
        name: '',
        description: '',
        homeType: 'appartment',
        shareType: 'shared',
        gpxFile: '',
        currentlyAvailable: true,
        images: [],
    };
    const [open, setOpen] = useState(false);
    const [formHasError, setformHasError] = useState(true); // form is empty by default
    const [geolocationAvailable, setGeolocationAvailable] = useState(false);
    const [form, setForm] = useState(emptyForm);

    const [errors, setErrors] = useStateWithCallback({
        lat: false,
        lng: false,
        price: false,
        name: false,
        description: false,
        homeType: false,
        shareType: false,
    }, () => {
        if (!checkFormHasEmptyField() && !checkFormHasError()) {
            setformHasError(false);
        } else {
            setformHasError(true);
        }
    });

    const { loginWithRedirect, getTokenSilently } = useAuth0();

    const { updatePoiList, updateCategoryList } = props

    useEffect(() => {
        if ('geolocation' in navigator) {
            setGeolocationAvailable(true);
        }
        if (props.position !== undefined){
            setForm({...form, lat: props.position.lat, lng: props.position.lng});
            setOpen(true);
        }
    }, [props.position])

    const checkFormHasError = () => {
        let hasError = false;
        Object.keys(errors).forEach(key => {
            if (errors[key]){
                hasError = true;
            }
        });
        return hasError;
    }

    const checkFormHasEmptyField = () => {
        let isEmpty = false;
        Object.keys(form).forEach(key => {
            if (errors[key] !== undefined && form[key] === ''){
                isEmpty = true;
            }
        });
        return isEmpty;
    }


    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }
  

    const handleFieldValidation = async(fieldName, value) =>  {
        const minPrice = 0;
        const maxPrice = 5000;
        let error = false;
        switch(fieldName) {
        case 'lat':
        case 'lng':
            if (!value.length) {
                error = 'This field is required';
            }
            if (isNaN(value) || value.indexOf('.') === -1) {
                error = 'This must be a float';
            }
            break;
        case 'name':
        case 'description':
            if (!value.length) {
                error = 'This field is required';
            }
            break;
        case 'price':
            if (isNaN(value) || value.indexOf('.') !== -1) {
                error = 'This must be an integer';
            }
            if (!value.length) {
                error = 'This field is required';
            }
            if (parseInt(value) < minPrice || parseInt(value) > maxPrice) {
                error = `Price has to be between ${minPrice} and ${maxPrice}`;
            }
            break;
        default:
            break;
        }
    
        return setErrors({...errors, [fieldName]: error})
    }

    const handleChange = (e) => {
        let {id, value, checked} = e.target

        if (id === 'currentlyAvailable') {
            value = checked;
        }

        handleFieldValidation(id, value);
        
        setForm({...form, [id]: value})
    }

    const sendCreatePoi = async(e) => {
        e.preventDefault();

        await createPoi(
            form,
            getTokenSilently,
            loginWithRedirect
        );
        setOpen(false);
        setForm(emptyForm);
        await updateCategoryList();
        await updatePoiList();
    }

    const getMyLocation = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            errors.lng = false;
            errors.lat = false;
            setErrors({...errors});
            setForm({...form, lat: position.coords.latitude, lng: position.coords.longitude});
        });
    }

    const handleFile = (file => {
        setForm({...form, gpxFile: file});
    })

    const handleImage = (files => {
        setForm({...form, images: Array.from(files)});
    })

    return (
        <div>
            <div className="add-poi-fab" onClick={handleClickOpen}>
                <Fab className="fab" color="primary" aria-label="add">
                    <Add />
                </Fab>
            </div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <form onSubmit={sendCreatePoi}>
                    <DialogTitle id="form-dialog-title">Create new renting object</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please fill the information in the form bellow about the object you are renting
                        </DialogContentText>
                        <Grid container spacing={3}>
                            <Grid item xs={4}>
                                <TextField 
                                    error={!!errors.lat}
                                    helperText={errors.lat}
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
                                    error={!!errors.lng}
                                    helperText={errors.lng}
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
                                        <MyLocation />
                                    </IconButton>
                                    )
                                }
                            </Grid>
                        </Grid>
                        <TextField
                            error={!!errors.name}
                            helperText={errors.name}
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
                            error={!!errors.description}
                            helperText={errors.description}
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

                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">Home type</FormLabel>
                                    <RadioGroup aria-label="homeType" name="homeType" value={form.homeType} onChange={handleChange}>
                                        <FormControlLabel value="appartment" control={<Radio color="primary" id="homeType"/>} label="Appartment" />
                                        <FormControlLabel value="house" control={<Radio color="primary" id="homeType" />} label="House" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">Sharing type</FormLabel>
                                    <RadioGroup aria-label="shareType" name="shareType" value={form.shareType} onChange={handleChange}>
                                        <FormControlLabel value="shared" control={<Radio color="primary" id="shareType"/>} label="Shared" />
                                        <FormControlLabel value="notShared" control={<Radio color="primary" id="shareType" />} label="Not shared" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <TextField
                                    error={!!errors.price}
                                    helperText={errors.price}
                                    autoFocus
                                    margin="dense"
                                    id="price"
                                    label="Price (CHF)"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={form.price}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={form.currentlyAvailable}
                                            onChange={handleChange}
                                            color="primary"
                                            id="currentlyAvailable"
                                            name="currentlyAvailable"
                                            inputProps={{ 'aria-label': 'primary checkbox' }}
                                        />
                                    }
                                    label="Currently Available"
                                />
                            </Grid>
                        </Grid>
                        
                        <div className="upload-poi-picture">
                            <Button component="label">
                                <CloudUpload color="primary"></CloudUpload>
                                <input  
                                    onChange={ (e) => handleImage(e.target.files) }
                                    accept="image/*" 
                                    type="file" 
                                    style={{ display: "none" }}
                                    id='images'
                                    multiple
                                />
                            </Button>
                            <span>Upload a picture of the POI</span>
                        </div>
                        <div className="upload-poi-picture">
                            <Button component="label">
                                <CloudUpload color="primary"></CloudUpload>
                                <input  
                                    onChange={ (e) => handleFile(e.target.files[0]) }
                                    accept=".gpx" 
                                    type="file" 
                                    style={{ display: "none" }}
                                    id='images'
                                />
                            </Button>
                            <span>Upload a gpx file</span>
                        </div> 
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button 
                        type="submit"
                        color="primary"
                        disabled={formHasError}
                    >
                        Submit
                    </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
}

FormDialog.propTypes = {
    updatePoiList: PropTypes.func.isRequired,
    updateCategoryList: PropTypes.func.isRequired,
    position: PropTypes.object,
}


export default FormDialog;