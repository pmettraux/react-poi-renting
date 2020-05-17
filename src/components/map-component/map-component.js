import React from "react";
import "./map-component.css";
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';

const containerStyle = {
    position: 'relative',  
    width: '100%',
    height: '95%'
  }

export class MapComponent extends React.Component {
    render() {
        return (
        <div>
          <Map google={this.props.google} 
          zoom={14}
          initialCenter={{ lat: 46.292894, lng: 7.536433 }}
          style={containerStyle}
          onClick={this.onMapClicked}
          />
          </div>
        );   
      }
}
export default GoogleApiWrapper({
    apiKey: 'AIzaSyBXcjrxCV55oylKi2Ymb0Bd_bmZzjP-Q9E'
  })(MapComponent);
  