import React, { Component } from 'react'
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import * as locData from "./data/location-data.json";
import L from 'leaflet';
import { geolocated } from 'react-geolocated';

//Correction of the invisble icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const DEFAULT_LATITUDE = 46.292894;
const DEFAULT_LONGITUDE = 7.536433;
const DEFAULT_ZOOM = 10;

class LeafletMapComponent extends Component {
    constructor() {
        super();
        this.state = {
            zoom: DEFAULT_ZOOM,
        };
    }

    render() {
        const longitude = this.props.coords ? this.props.coords.longitude : DEFAULT_LONGITUDE;
        const latitude = this.props.coords ? this.props.coords.latitude : DEFAULT_LATITUDE;
        return (
            <div>
                <Map center={[ longitude, latitude ]} zoom={this.state.zoom}>
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {
                        !this.props.coords ?
                            <div className="loading">Loading</div>
                            :
                            <Marker position={[longitude, latitude]}>
                                <Popup>
                                    You're here!
                                </Popup>
                            </Marker>
                    }
                    {locData.features.map((loc) => (
                        <Marker
                            key={loc.properties.LOC_ID}
                            position={{
                                lat: loc.geometry.coordinates[0],
                                lng: loc.geometry.coordinates[1]
                            }}
                            name={loc.properties.NAME}
                            description={loc.properties.DESCRIPTION}
                        />
                    ))
                    }
                </Map>
            </div>
        )
    }
}
export default geolocated({
    positionOptions: {
        enableHighAccuracy: false,
    },
    userDecisionTimeout: 10000
})(LeafletMapComponent)