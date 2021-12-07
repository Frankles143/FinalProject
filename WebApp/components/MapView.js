import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import RNMapView, { Circle, Marker, Polyline } from 'react-native-maps';

const customMapStyle = [
    {
        "featureType": "poi.business",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    }
]

const MapView = ({ location, coords, newClearMarker }) => {
    const [clearMarkers, setClearMarkers] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [poly, setPoly] = useState(null);
    const mapRef = useRef(null);

    //Pass in current location and a series of coords

    useEffect(() => {
        console.log(location)
        if (!!location && mapRef.current) {
            mapRef.current.animateCamera({
                center: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                },
                pitch: 0,
                heading: 0,
                altitude: 1000,
                // zoom: 18,
            });
        }

        // mapMarkers();
        setPolyline();

        if (newClearMarker > clearMarkers ) {
            setMarkers([]);
            setClearMarkers(newClearMarker);
        }

    }, [location, newClearMarker]);

    const mapMarkers = () => {
        //Check if coords contains anything and if there are more coords than markers
        if (coords?.length > 0 && coords?.length > markers?.length) {
            let newMarker = <Marker
                key={coords.length - 1}
                coordinate={{
                    latitude: coords[coords.length - 1][0],
                    longitude: coords[coords.length - 1][1]
                }}
            />
            setMarkers(markers => [...markers, newMarker])
        }
    }

    const setPolyline = () => {
        if (coords?.length > 0) {
            //Create LatLng array first
            let latLng = [];
            coords.forEach(coord => {
                latLng = [...latLng, {latitude: coord[0], longitude: coord[1]}];
            });

            let newPoly = <Polyline
            coordinates={latLng}
            strokeWidth={15}
            strokeColor="#0000FF"
            />

            setPoly(newPoly);
        } else {
            setPoly(null);
        }
    }

    return (
        <View style={styles.container}>
            <RNMapView
                ref={mapRef}
                initialCamera={{
                    altitude: 15000,
                    center: {
                        latitude: location.latitude,
                        longitude: location.longitude,
                    },
                    heading: 0,
                    pitch: 0,
                    zoom: 15,
                }}
                loadingEnabled={true}
                loadingBackgroundColor="white"
                style={styles.map}
                rotateEnabled={false}
                showsPointsOfInterest={false}
                customMapStyle={customMapStyle} >

                {markers[0] != null && markers}
                {poly !== null && poly}

                <Marker
                    anchor={{ x: 0.5, y: 0.6 }}
                    key={1}
                    coordinate={{
                        latitude: location.latitude,
                        longitude: location.longitude
                    }}
                    flat
                // style={{
                //     ...(location.heading !== -1 && {
                //         transform: [
                //             {
                //                 rotate: `${location.heading}deg`,
                //             },
                //         ],
                //     }),
                // }}
                >
                    <View style={styles.dotContainer}>
                        {/* <View style={styles.arrow} /> */}
                        <View style={styles.dot} />
                    </View>
                </Marker>
                {/* Accuracy circle around users location */}
                <Circle
                    center={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                    }}
                    radius={location.accuracy}
                    strokeColor="rgba(0, 150, 255, 0.25)"
                    fillColor="rgba(0, 150, 255, 0.25)"
                />
                
            </RNMapView>
        </View>
    );
};

export default MapView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
        //   ...StyleSheet.absoluteFillObject,
    },
    dotContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        backgroundColor: 'rgb(0, 120, 255)',
        width: 24,
        height: 24,
        borderWidth: 3,
        borderColor: 'white',
        borderRadius: 12,
        shadowColor: 'black',
        shadowOffset: {
            width: 1,
            height: 1,
        },
        shadowOpacity: 0.3,
        shadowRadius: 1.5,
        elevation: 4,
    },
    arrow: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderBottomWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'rgb(0, 120, 255)',
    },
});
