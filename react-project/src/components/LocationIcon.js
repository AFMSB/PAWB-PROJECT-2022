import L, {Icon} from 'leaflet';

export const LocationIcon = L.icon({
    iconUrl: require('../assets/location_icon.png'),
    iconRetinaUrl: require('../assets/location_icon.png'),
    //iconUrl: require('../assets/pin.png'),
    //iconRetinaUrl: require('../assets/pin.png'),
    iconAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: [35, 35],
});