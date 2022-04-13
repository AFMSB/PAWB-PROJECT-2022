import {MapContainer, TileLayer, Marker, Popup, Tooltip} from 'react-leaflet'
import {Icon} from "leaflet";

const icon = new Icon({
    iconUrl: "assets/warning.png",
    iconSize: [35,35]
})

function Home() {
    const position = [41.172753, -8.611166]

    return (
        <MapContainer center={position} zoom={15} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position} icon={icon}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
                <Tooltip>Tooltip for Marker</Tooltip>

            </Marker>
        </MapContainer>
    );
}

export default Home;