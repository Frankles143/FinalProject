import React, { PureComponent, useEffect, useState } from 'react'
import MapView from 'react-native-maps'
import isEqual from 'lodash.isequal'


const MapMarker = ({ propsIn }) => {
    const [tracks, setTracks] = useState(true);
    const [props, setProps] = useState(propsIn);

    useEffect(() => {

        setTracks(false);
        if (props !== propsIn) {
            setProps(propsIn);
        }
        setTracks(true);
    }, [propsIn]);


    return (
        <MapView.Marker
            tracksViewChanges={tracks}
            {...props}
        >
            {props.children}
        </MapView.Marker>
    )
}

export default MapMarker;