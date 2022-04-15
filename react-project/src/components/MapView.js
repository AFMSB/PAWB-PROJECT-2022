import React, { Component } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import data from "../assets/data.json"
import { getCentralGeoCoordinate } from "../services/utils";
import Markers from './Markers';

class MapView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //currentLocation: { lat: 52.52437, lng: 13.41053 },
            currentLocation: getCentralGeoCoordinate(this.props.markers),
            zoom: 12,
        }
    }



    render() {
        console.log("> MAP >>",this.props.markers)
        const { currentLocation, zoom } = this.state;
        return (
            <MapContainer center={currentLocation} zoom={zoom}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                <Markers pins={this.props.markers}/>
            </MapContainer>
        );
    }
}

export default MapView;
