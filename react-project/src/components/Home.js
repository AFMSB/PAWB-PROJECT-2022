import {MapContainer, TileLayer, Marker, Popup, Tooltip, Circle, Polygon} from 'react-leaflet'
import {Icon} from "leaflet";
import { useMemo, useState } from 'react'
const icon = new Icon({
    iconUrl: "assets/pin.png",
    iconSize: [35,35]
})

function Home() {
    const center = [51.505, -0.09]

    function TooltipCircle() {
        const [clickedCount, setClickedCount] = useState(0)
        const eventHandlers = useMemo(
            () => ({
                click() {
                    setClickedCount((count) => count + 1)
                },
            }),
            [],
        )

        const clickedText =
            clickedCount === 0
                ? 'Click this Circle to change the Tooltip text'
                : `Circle click: ${clickedCount}`

        return (
            <Circle
                center={center}
                eventHandlers={eventHandlers}
                pathOptions={{ fillColor: 'red', color :"red"}}
                radius={200}>
                <Tooltip>{clickedText}</Tooltip>
            </Circle>
        )
    }

    function TooltipsExample() {
        return (
            <MapContainer center={center} zoom={13}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <TooltipCircle />
                <Marker position={center} icon={icon}>
                    <Popup>Popup for Marker</Popup>
                    <Tooltip>Tooltip for Marker</Tooltip>
                </Marker>
            </MapContainer>
        )
    }

    return (TooltipsExample());
}

export default Home;