import React, { Component } from 'react'
import './map.scss'
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import * as locData from "./data/location-data.json";

export default class LeafletMapComponent extends Component {
    constructor() {
        super();
        this.state = {
            lat: 46.292894,
            lng: 7.536433,
            zoom: 10,
        };
    }

    render() {
        const position = [this.state.lat, this.state.lng]
        return (
            <div>
                <Map center={position} zoom={this.state.zoom} style={{ width: '100%', height: '980px' }}>
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {locData.features.map((loc) => (
                        <Marker onClick={this.onMarkerClick}
                            key={loc.properties.LOC_ID}
                            position={{
                                lat: loc.geometry.coordinates[0],
                                lng: loc.geometry.coordinates[1]
                            }}
                            name={loc.properties.NAME} />
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