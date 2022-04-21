import React from 'react';
import {Popup} from 'react-leaflet';

const MarkerPopup = (props) => {
    console.log("data: ", props.data)
    const {created_at} = props.data;
    const {user_id} = props.data;
    const {geometry} = props.data;
    return (<Popup>
        <div className='poup-text d-flex flex-column text-center'>
            <span><b>[{user_id}]</b></span><span>{created_at}</span>
            <span>Lat.:  {geometry[0]}</span><span>Long.:  {geometry[1]}</span>
        </div>
    </Popup>);
};

export default MarkerPopup;