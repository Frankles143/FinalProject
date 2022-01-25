import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, ToastAndroid, Button, TouchableHighlight, TouchableOpacity } from 'react-native';
import RNMapView, { Callout, Circle, Marker, Polyline } from 'react-native-maps';
import Toast from 'react-native-simple-toast';
import { v4 as uuidv4 } from 'uuid';

import { Spacing, Typography, Colours } from '../../styles';
import WalkCallout from './WalkCallout';

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

const WalksMapView = ({ navigation, location, walks }) => {
    const [markers, setMarkers] = useState([]);
    const mapRef = useRef(null);

    useEffect(() => {
        //Create markers for the walks and put them on map
        // console.log(location)
        // console.log(walks);
        createWalkMarkers();

    }, [location, walks]);

    const createWalkMarkers = () => {
        if (walks.length > 0) {

            let tempMarkers = [];

            walks.forEach((walk, i) => {

                let tempMarker = <Marker
                    key={i}
                    coordinate={{
                        latitude: walk.walkCoords[0],
                        longitude: walk.walkCoords[1]
                    }}
                // onPress={(e) => handleMarkerSelect(e)}
                >
                    <Callout onPress={() => navigation.navigate('Walk Details', { name: walk.walkName, walk: walk })}>
                        <WalkCallout walk={walk} />
                    </Callout>
                </Marker>

                tempMarkers.push(tempMarker);
            });

            setMarkers(tempMarkers);
        }
    }

    const handleMarkerSelect = (e) => {
        // console.log(e._targetInst.return.key);
        let walk = walks[parseInt(e._targetInst.return.key)];
        console.log(walk);
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
                    zoom: 12,
                }}
                loadingEnabled={false}
                loadingBackgroundColor="white"
                style={styles.map}
                rotateEnabled={false}
                showsPointsOfInterest={false}
                toolbarEnabled={false}
                customMapStyle={customMapStyle} >

                {markers[0] != null && markers}

                <Marker
                    anchor={{ x: 0.5, y: 0.6 }}
                    key={1}
                    coordinate={{
                        latitude: location.latitude,
                        longitude: location.longitude
                    }}
                    flat
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
            <View style={styles.fabCon}>
                <TouchableOpacity style={styles.fab} onPress={() => { console.log("waaaaaaaaa") }} >
                    <Text style={styles.fabText}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fabCon: {
        flex: 1,
        position: "absolute",
        bottom: 15,
        right: 15,
    },
    fab: {
        backgroundColor: Colours.primary.base,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 70,
        width: 70,
        borderRadius: 100,
    },
    fabText: {
        fontSize: 50,
        color: "white",
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


export default WalksMapView;