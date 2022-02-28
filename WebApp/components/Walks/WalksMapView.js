import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, StyleSheet, Button, Alert } from 'react-native';
import RNMapView, { Callout, Circle, Marker} from 'react-native-maps';

import { Colours } from '../../styles';
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
        createWalkMarkers();

    }, [location, walks]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button title="New Walk" 
                color={Colours.primary.base} 
                accessibilityLabel="This opens a dialog to confirm creation of a new walk" 
                onPress={() => confirmCreateWalk()} />
            ),
        });
    }, [navigation])

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

    const confirmCreateWalk = () =>
    Alert.alert(
      "Create new walk?",
      "Would you like to create a new walk location?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "Confirm", onPress: () => navigation.navigate("New Walk") }
      ],
      {
        cancelable: true,
      }
    );

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
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
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
});


export default WalksMapView;