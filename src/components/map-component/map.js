import React, { useState, useEffect } from 'react';
import {
  Map, Marker, Popup, TileLayer,
} from 'react-leaflet';
import L from 'leaflet';
import './map.scss';
import { getPois } from '../../shared/api.service';
import { useAuth0 } from '../../shared/react-auth0-spa';

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

export default function LeafletMapComponent() {
    const [lat, setLat] = useState(DEFAULT_LATITUDE);
    const [lng, setLng] = useState(DEFAULT_LONGITUDE);
    const [pois, setPois] = useState([]);
    const [zoom] = useState(DEFAULT_ZOOM);
    const position = [lat, lng];

    const { loginWithRedirect, getTokenSilently } = useAuth0();

    const getCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(
            position => {
                setLat(position.coords.latitude);
                setLng(position.coords.longitude);
            }
        )
    }

    const getListPois = async() => {
        const results = await getPois(getTokenSilently, loginWithRedirect);
        const pois = results.data.map(poi => {
            return {
                key: poi.id,
                position: {
                    lat: poi.lat,
                    lng: poi.lng,
                },
                name: poi.name,
                description: poi.description,
            }
        },[]);
        setPois(pois);
    }

    useEffect(() => {
        if ('geolocation' in navigator) {
            getCurrentLocation();
        }

        (async() => {
            getListPois();
        })()
    }, [])

    return (
        <div>
            <Map center = {position} zoom = {zoom}>
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {pois.length && pois.map((poi) => (
                    <Marker
                        key={poi.key}
                        position={poi.position}
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