import React, { Fragment } from 'react'
import {Marker} from 'react-leaflet';
import {LocationIcon} from './LocationIcon';
import MarkerPopup from './MarkerPopup';

const Markers = (props) => {
    const { pins } = props;

    const markers = pins.map((marker, index) => (
        <Marker key={index} position={marker.geometry} icon={LocationIcon} >
            <MarkerPopup data={marker}/>
        </Marker>
    ));

    return <Fragment>{markers}</Fragment>
};

export default Markers;