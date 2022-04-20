import React, {Component} from 'react';
import {MapContainer, TileLayer} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {getCentralGeoCoordinate} from "../services/utils";
import Markers from './Markers';

class MapView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //currentLocation: { lat: 52.52437, lng: 13.41053 },
            center: getCentralGeoCoordinate(this.props.markers),
            zoom: this.props.zoom,
        }
    }


    render() {
        const {center, zoom} = this.state;
        if (this.props.markers.length > 0) {
            return (
                <MapContainer center={center} zoom={zoom}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;%3EOpenStreetMap</a> contributors"
                    />
                    <Markers pins={this.props.markers}/>
                </MapContainer>
            );
        }

        const centerDEF = {
            "created_at": "Aliados, Porto",
            "geometry": [
                41.1486,
                -8.611
            ]
        }
        return (
            <MapContainer center={centerDEF.geometry} zoom={zoom}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;%3EOpenStreetMap</a> contributors"
                />
                <Markers pins={[]}/>
            </MapContainer>
        );
    }
}

export default MapView;
