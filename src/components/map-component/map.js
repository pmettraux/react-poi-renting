import React, { Component } from 'react';
import {
    Map, Marker, Popup, TileLayer,
} from 'react-leaflet';
import L from 'leaflet';
import './map.scss';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { deletePoi } from '../../shared/api.service';
import FormDialog from '../manage-poi/poi-modal/poi-modal';

// Correction of the invisble icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const DEFAULT_LATITUDE = 46.292894;
const DEFAULT_LONGITUDE = 7.536433;
const DEFAULT_ZOOM = 10;
const TIMER = 1500;

class LeafletMapComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: DEFAULT_LATITUDE,
            lng: DEFAULT_LONGITUDE,
            zoom: DEFAULT_ZOOM,
            pois: props.pois,
            userId: props.userId || undefined,
            loginWithRedirect: props.loginWithRedirect,
            getTokenSilently: props.getTokenSilently,
            updatePoiList: props.updatePoiList,
            clickedPosition: undefined,
        };
        this.showDeleteButton = this.showDeleteButton.bind(this);
        this.handleDeletePoi = this.handleDeletePoi.bind(this);
        this.handleClickPress = this.handleClickPress.bind(this);
        this.handleClickRelease = this.handleClickRelease.bind(this);
    }

    getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    this.setState({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                }
            )
        } else {
            console.log("Cannot get location");
        }
    }

    componentDidMount() {
        this.getCurrentLocation(); //get the location trough the web browser
    }

    componentDidUpdate(prevProps) {
        if (this.props.pois !== prevProps.pois) {
            this.setState({ pois: this.props.pois });
        }
    }

    showDeleteButton(creator, user, poiKey) {
        if (creator === user) {
            return (
                <Button
                    variant="contained"
                    color="secondary"
                    key={poiKey}
                    onClick={async () => this.handleDeletePoi(poiKey)}
                >
                    Delete
                </Button>
            );
        }
    }

    async handleDeletePoi(poiKey) {
        if (!window.confirm('Do you really want to delete this?'))
            return;

        await deletePoi(poiKey, this.state.getTokenSilently, this.state.loginWithRedirect);
        await this.state.updatePoiList();
    }

    handleClickPress(e) {
        const { lat, lng } = e.latlng;
        this.buttonPressTimer = setTimeout(() => this.setState({ clickedPosition: { lat, lng } }), TIMER);
        
    }
    handleClickRelease() {
        clearTimeout(this.buttonPressTimer);
    }

    render() {
        const position = [this.state.lat, this.state.lng]
        return (
            <div>
                <Map
                    center={position}
                    zoom={this.state.zoom}
                    onTouchStart={this.handleClickPress}
                    onTouchEnd={this.handleClickRelease}
                    onMouseDown={this.handleClickPress}
                    onMouseUp={this.handleClickRelease}
                    onMouseLeave={this.handleClickRelease}>
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {this.state.pois.map((poi) => (
                        <Marker
                            key={poi.key}
                            position={poi.position}
                            name={poi.name}
                            description={poi.description}
                        >
                            <Popup className="request-popup">
                                <h1>
                                    {poi.name}
                                </h1>
                                <p>
                                    {poi.description}
                                </p>
                                {this.showDeleteButton(poi.creatorId, this.state.userId, poi.key)}
                            </Popup>
                        </Marker>
                    ))
                    }
                </Map>
                <FormDialog
                    updatePoiList={this.state.updatePoiList}
                    position={this.state.clickedPosition}
                />
            </div>
        )
    }
}

LeafletMapComponent.propTypes = {
    pois: PropTypes.array.isRequired,
    userId: PropTypes.string,
    loginWithRedirect: PropTypes.func.isRequired,
    getTokenSilently: PropTypes.func.isRequired,
    updatePoiList: PropTypes.func.isRequired,
}

export default LeafletMapComponent;
