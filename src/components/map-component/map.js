import React, { Component } from 'react'
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import * as locData from "./data/location-data.json";
import L from 'leaflet';

//Correction of the invisble icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const lat = 46.292894;
const lng = 7.536433;
const zoom = 10;

export default class LeafletMapComponent extends Component {
    constructor() {
        super();
        this.state = {
            lat: lat,
            lng: lng,
            zoom: zoom,
        };
    }

    render() {
        const position = [this.state.lat, this.state.lng]
        return (
            <div>
                <Map center={position} zoom={this.state.zoom}>
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
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
                    <Marker position={position}>
                        <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker>
                </Map>
            </div>
        )
    }
}