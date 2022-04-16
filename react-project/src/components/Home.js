import {MapContainer, TileLayer, Marker, Popup, Tooltip, Circle, Polygon} from 'react-leaflet'
import React, { useMemo, useState } from 'react'
import MapView from "./MapView";

function Home() {
    const center = {
        "created_at": "Aliados, Porto",
        "geometry": [
            41.1486,
            -8.611
        ]
    }


    function TooltipsExample() {
        return (
            <MapView markers={[center]}/>
        )
    }

    return (TooltipsExample());
}

export default Home;