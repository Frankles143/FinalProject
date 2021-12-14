import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, ToastAndroid } from 'react-native';
import RNMapView, { Circle, Marker, Polyline } from 'react-native-maps';
import MapMarker from '../services/MapMarker';
import Toast from 'react-native-simple-toast';

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

const MapView = ({ location, coords, newClearMarker, makeHazard }) => {
    const [clearMarkers, setClearMarkers] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [poly, setPoly] = useState(null);
    const [selectedPointStart, setSelectedPointStart] = useState(null);
    const [selectedPointEnd, setSelectedPointEnd] = useState(null);
    const [tracks, setTracks] = useState(false);
    const [instruction, setInstruction] = useState("");
    const mapRef = useRef(null);

    //Pass in current location and a series of coords

    useEffect(() => {
        console.log(location)

        //If there is a valid location and a map then change to users current position
        // if (!!location && mapRef.current) {
        //     mapRef.current.animateCamera({
        //         center: {
        //             latitude: location.latitude,
        //             longitude: location.longitude,
        //         },
        //         pitch: 0,
        //         heading: 0,
        //         altitude: 1000,
        //         // zoom: 18,
        //     });
        // }


        //Change to markers if creating a hazard
        if (makeHazard == true) {
            setPoly(null);
            mapAllMarkers();
        } else {
            //Create the polyline of all the points in the users currently created route
            setSelectedPointStart(null);
            setSelectedPointEnd(null);
            setPolyline();
        }

        //If there is a change in the clear markers value from GeoLocation.js then clear all markers
        if (newClearMarker > clearMarkers) {
            setMarkers([]);
            setPoly([]);
            setClearMarkers(newClearMarker);
        }

        //TracksView is false, until a user touches a point, which makes it true, changes the colours, updates etc.
        //Trackview changes back to false afterwards for performance benfits but the real time colour change has already happened
        if (tracks === true) {
            setTracks(false);
        }

    }, [location, coords, newClearMarker, makeHazard, selectedPointStart, selectedPointEnd, tracks]);

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

    const mapAllMarkers = () => {
        if (coords?.length > 0) {

            let tempMarkers = [];

            //Map all the markers now so that the key remains the same so the coords array can be referenced later
            coords.forEach((coord, i) => {

                let markerColour = "#FF0000";

                //if selected points are null then normal, else colour one, else colour all in between 
                if (selectedPointStart !== null && selectedPointEnd === null && selectedPointStart === i) {
                    console.log("first marker changed");
                    markerColour = "#228B22"

                } else if (selectedPointStart !== null && selectedPointEnd !== null && i >= selectedPointStart && i <= selectedPointEnd) {
                    console.log("The rest of the markers changed");
                    markerColour = "#228B22"
                }

                let tempMarker = <Marker
                    key={i}
                    coordinate={{
                        latitude: coord[0],
                        longitude: coord[1]
                    }}
                    onPress={(e) => handleMarkerSelect(e)}
                    tracksViewChanges={tracks}
                >
                    <View style={styles.dotContainer}>
                        <View style={{backgroundColor: markerColour, width: 24, height: 24, borderRadius: 12,}} />
                    </View>
                </Marker>

                tempMarkers.push(tempMarker);
            });

            //Remove most of the markers to make it easier for users to see - this could be a changeable variable
            tempMarkers = tempMarkers.filter((marker, i) => {
                if (i % 5 === 0) {
                    return marker
                }
            })

            setMarkers(tempMarkers);
            console.log(tempMarkers);
        }
    }

    const handleMarkerSelect = (e) => {
        //Get key from the event object
        let markerKey = parseInt(e._targetInst.return.key);
        setTracks(true);

        //Get first point, then second
        if (selectedPointStart === null) {
            setSelectedPointStart(markerKey);
            setInstruction(`Marker number ${markerKey} selected`);

        } else if (selectedPointStart !== null && selectedPointEnd === null) {

            if (markerKey < selectedPointStart) {
                Toast.show("Please select two markers in walk order!");
                setInstruction("");
            } else {
                setSelectedPointEnd(markerKey);
                setInstruction(`Marker number ${markerKey} selected`);
            }
        }

        if (selectedPointStart !== null && selectedPointEnd !== null) {
            setInstruction("Both markers set")
            console.log("Both points set!")
        }

    }

    const setPolyline = () => {
        setMarkers([]);
        if (coords?.length > 0) {
            //Create LatLng array first
            let latLng = [];
            coords.forEach(coord => {
                latLng = [...latLng, { latitude: coord[0], longitude: coord[1] }];
            });

            let newPoly = <Polyline
                coordinates={latLng}
                strokeWidth={10}
                strokeColor="#0000FF"
            />

            setPoly(newPoly);
        } else {
            setPoly(null);
        }
    }

    //Saving hazard
    //Foreach
    //If between key start and end
    //Marker changes colour (not every i)
    //Save coord from coords array (every i)

    return (
        <View style={styles.container}>
            <Text>{instruction}</Text>
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
