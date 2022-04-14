import React from 'react';
import {Popup} from 'react-leaflet';

const MarkerPopup = (props) => {
    const { created_at } = props.data;

    return  (<Popup>
        <div className='poup-text'>{created_at}</div>
    </Popup>);
};

export default MarkerPopup;