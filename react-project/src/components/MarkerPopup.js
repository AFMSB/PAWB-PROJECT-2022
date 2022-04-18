import React from 'react';
import {Popup} from 'react-leaflet';

const MarkerPopup = (props) => {
    const {created_at} = props.data;
    const {user_id} = props.data;
    return (<Popup>
        <div className='poup-text d-flex flex-column text-center'>
            <span><b>[{user_id}]</b></span><span>{created_at}</span>
        </div>
    </Popup>);
};

export default MarkerPopup;