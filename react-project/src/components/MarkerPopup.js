import React from 'react';
import {Popup} from 'react-leaflet';

const MarkerPopup = (props) => {
    const { popup_text } = props.data;

    return  (<Popup>
        <div className='poup-text'>{popup_text}</div>
    </Popup>);
};

export default MarkerPopup;