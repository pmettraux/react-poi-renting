import React, { Component } from 'react';
import {
  Map, Marker, Popup, TileLayer,
} from 'react-leaflet';
import L from 'leaflet';
import './map.scss';
import PropTypes from 'prop-types';

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

class LeafletMapComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: DEFAULT_LATITUDE,
            lng: DEFAULT_LONGITUDE,
            zoom: DEFAULT_ZOOM,
            pois: props.pois,
        };
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

    componentDidMount(){
        this.getCurrentLocation(); //get the location trough the web browser
    }

    componentDidUpdate(prevProps) {
        if (this.props.pois !== prevProps.pois) {
            this.setState({pois: this.props.pois});
        }
    }

    render() {
        const position=[this.state.lat, this.state.lng]
        return (
            <div>
                <Map center = {position} zoom = {this.state.zoom}>
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {this.state.pois.map((poi) => (
                        <Marker
                            key={poi.id}
                            position={poi.position}
                            name={poi.name}
                            description={poi.description}
                        >
                            <Popup className="request-popup">
                            <div>
                                <h1>
                                    {poi.name}
                                </h1>
                                <p>
                                    {poi.description}
                                </p>
                            </div>
                            </Popup>
                        </Marker>
                    ))
                    }
                    <Marker position = {position} >
                        <Popup className="request-popup">
                            <div>
                                <h1>
                                    You&apos;re here
                                </h1>
                            </div>
                        </Popup>
                    </Marker>
                </Map>
            </div>
        )
    }
} 

LeafletMapComponent.propTypes = {
    pois: PropTypes.array.isRequired,
}

export default LeafletMapComponent;