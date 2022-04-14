import React, { Component } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getCentralGeoCoordinate } from "../services/utils";
import Markers from './Markers';
import axios from "axios";
let markers= [
        {
            "created_at": "2022-04-14T17:19:06.265363Z",
            "geometry": [
                41.15157,
                -8.612402
            ]
        },
        {
            "created_at": "2022-04-14T17:19:06.263681Z",
            "geometry": [
                41.14782,
                -8.612777
            ]
        },
        {
            "created_at": "2022-04-14T17:19:06.261856Z",
            "geometry": [
                41.14818,
                -8.611274
            ]
        },
        {
            "created_at": "2022-04-14T17:19:06.253647Z",
            "geometry": [
                41.14716,
                -8.611938
            ]
        },
        {
            "created_at": "2022-04-14T17:19:06.245031Z",
            "geometry": [
                41.150227,
                -8.608478
            ]
        }
    ]


markers = async () => {
    const API_URL = "http://localhost:3000/api/v1/position/";
    const headers = {'Authorization': `Bearer ${localStorage.getItem("authToken").replaceAll('"', '')}`}
    await axios.post(API_URL + "history", {
        "start": "0",
        "end": "0"
    }, {
        headers: headers
    }).then((response) => {
        console.log(response.data.locations);

        let markers = response.data.locations.map((marker) => {
            return {
                created_at: marker.CreatedAt,
                geometry: [marker.Latitude, marker.Longitude]
            }
        });
        console.log("->", markers)

        return markers;
    }).catch(error => {
        console.log(error);
        return []
    })

}

class MapView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //currentLocation: { lat: 52.52437, lng: 13.41053 },
            currentLocation: getCentralGeoCoordinate(markers),
            zoom: 12,
        }
    }



    render() {
        console.log(">>",markers)
        const { currentLocation, zoom } = this.state;
        return (
            <MapContainer center={currentLocation} zoom={zoom}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />

                <Markers pins={markers}/>
            </MapContainer>
        );
    }
}

export default MapView;