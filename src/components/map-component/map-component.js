import React from "react";
import "./map-component.css";
import { GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';
import CurrentLocation from './current-location-container';
import * as locData from "./data/location-data.json";


export class MapComponent extends React.Component {
    constructor(props) {
        super(props);
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.onMapClicked = this.onMapClicked.bind(this);
        this.state = {
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {}
        };
    }
    onMarkerClick = (props, marker, e) => {
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });
    };
    onMapClicked = (props) => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            });
        }
    };
    onClose = props => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            });
        }
    };

    render() {
        const containerStyle = {
            width: '100%',
            height: '93%'
        }
        return (
            <div>
                <CurrentLocation
                    centerAroundCurrentLocation
                    google={this.props.google}
                    zoom={8}
                    initialCenter={{ lat: 46.292894, lng: 7.536433 }}
                    style={containerStyle}
                    fullscreenControl={true}//Enable the button for the full screen map
                    streetViewControl={false}// Enable or disable the streat view control
                    mapTypeControl={true}//Enable type of the map
                    disableDefaultUI={false}/*Disable the UI of the original google map*/>
                    <Marker onClick={this.onMarkerClick}
                        name={"You're here"}
                        title={'My position'}
                    />
                    {locData.features.map((loc) => (
                        <Marker onClick={this.onMarkerClick}
                        key={loc.properties.LOC_ID}
                            position={{
                                lat: loc.geometry.coordinates[0],
                                lng: loc.geometry.coordinates[1]
                            }}
                            name={loc.properties.NAME}/>
                    ))
                    }
                    <InfoWindow
                        marker={this.state.activeMarker}
                        //onOpen={this.windowHasOpened}
                        onClose={this.onClose}
                        visible={this.state.showingInfoWindow}>
                        <div>
                            <h1>{this.state.selectedPlace.name}</h1>
                        </div>
                    </InfoWindow>
                </CurrentLocation>
            </div>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyBXcjrxCV55oylKi2Ymb0Bd_bmZzjP-Q9E'
})(MapComponent);
