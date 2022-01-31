import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, ToastAndroid, Button } from 'react-native';
import RNMapView, { Circle, Marker, Polyline } from 'react-native-maps';
import Toast from 'react-native-simple-toast';
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid';

import { Spacing, Typography, Colours } from '../../styles';

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

const RoutesMapView = ({ location, currentRoute, coords, newClearMarker, makeHazard }) => {
    const [clearMarkers, setClearMarkers] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [poly, setPoly] = useState(null);
    const [polyLatLng, setPolyLatLng] = useState(null);
    const [hazardPoly, setHazardPoly] = useState(null);
    const [selectedPointStart, setSelectedPointStart] = useState(null);
    const [selectedPointEnd, setSelectedPointEnd] = useState(null);
    const [tracks, setTracks] = useState(false);
    const [instruction, setInstruction] = useState("");
    const [route, setRoute] = useState(currentRoute);
    const [hazards, setHazards] = useState([]);

    const mapRef = useRef(null);

    //Pass in current location and a series of coords
    useEffect(() => {
        setRoute(currentRoute);

        //Change to markers if creating a hazard
        if (makeHazard == true) {
            clearPolys();
            mapAllMarkers();
        } else {
            //Create the polyline of all the points in the users currently created route
            setSelectedPointStart(null);
            setSelectedPointEnd(null);
            setPolyline();
            createHazardPoly();
        }

        //If there is a change in the clear markers value from Routes.js then clear all markers
        if (newClearMarker > clearMarkers) {
            setMarkers([]);
            clearPolys();
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
    };

    const mapAllMarkers = () => {
        if (coords?.length > 0) {

            let tempMarkers = [];

            //Map all the markers now so that the key remains the same so the coords array can be referenced later
            coords.forEach((coord, i) => {

                let markerColour = "#FF0000";

                //if selected points are null then normal, else colour one, else colour all in between 
                if (selectedPointStart !== null && selectedPointEnd === null && selectedPointStart === i) {
                    markerColour = "#228B22"

                } else if (selectedPointStart !== null && selectedPointEnd !== null && i >= selectedPointStart && i <= selectedPointEnd) {
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
                        <View style={{ backgroundColor: markerColour, width: 24, height: 24, borderRadius: 12, }} />
                    </View>
                </Marker>

                tempMarkers.push(tempMarker);
            });

            //Remove most of the markers to make it easier for users to see - this could be a changeable variable
            tempMarkers = tempMarkers.filter((marker, i) => {
                if (i % 4 === 0 || i === 0 || i === tempMarkers.length - 1) {
                    return marker
                }
            })

            setMarkers(tempMarkers);
        }
    };

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

    };

    const setPolyline = () => {
        setMarkers([]);

        //Check if there are coordinates
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
            //Set the poly and also the coords for the route
            setPolyLatLng(latLng);
            setPoly(newPoly);
        } else {
            setPoly(null);
        }
    };

    const createHazardPoly = () => {
        //If there are hazards then create a poly for each and add to hazard poly array
        if (currentRoute?.routeHazards?.length > 0) {
            setHazards([]);
            let tempHazards = [];

            //Add any hazards to a hazard array
            for (let i = 0; i < currentRoute.routeHazards.length; i++) {
                tempHazards.push(currentRoute.routeHazards[i])
            }

            let latLng = [], tempPolys = [];

            //Create poly for each hazard
            tempHazards.forEach((hazard, i) => {
                latLng = [];
                hazard.hazardCoords.forEach(coord => {
                    latLng = [...latLng, { latitude: coord[0], longitude: coord[1] }];
                });

                let newPoly = <Polyline
                    coordinates={latLng}
                    strokeWidth={11}
                    strokeColor="#FF0000"
                    key={i}
                />

                tempPolys.push(newPoly);
            });
            //Set hazards and hazard poly
            setHazards(tempHazards);
            setHazardPoly(tempPolys);
        } else {
            setHazardPoly(null);
        }
    }

    const clearPolys = () => {
        setPoly(null);
        setHazardPoly(null);
    }

    const handleSaveHazard = async () => {

        if (selectedPointStart === null || selectedPointEnd === null) {
            Toast.show("Select two points first!")
            return;
        }

        let hazardCoords = [];

        coords.forEach((coord, i) => {
            if (i >= selectedPointStart && i <= selectedPointEnd) {
                hazardCoords.push(coord);
            }
        });

        if (hazardCoords.length > 0) {
            saveHazard(hazardCoords);
        }
    };

    const saveHazard = async (coords) => {
        let newHazard = {
            hazardId: uuidv4(),
            hazardName: "TestName3",
            hazardColour: "green",
            hazardCoords: coords
        };

        let updatedRoute = route;
        let hazards = [...updatedRoute.routeHazards];
        hazards.push(newHazard);

        updatedRoute = {
            ...updatedRoute,
            routeHazards: hazards
        }

        fetch('https://dogwalknationapi.azurewebsites.net/Route/updateRoute', {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                updatedRoute
            )
        })
            .then((response) => {
                console.log(response);
                response.json()
            })
            .then((data) => {
                console.log(data);
                setRoute(updatedRoute);
            })
            .catch((error) => {
                console.error(error)
            });
    };


    return (
        <View style={styles.container}>
            {/* <Text>{instruction}</Text>
            <Button style={styles.button} color={Colours.primary.base} title="Save hazard" onPress={handleSaveHazard} /> */}
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
                loadingEnabled={false}
                loadingBackgroundColor="white"
                style={styles.map}
                rotateEnabled={false}
                showsPointsOfInterest={false}
                toolbarEnabled={false}
                customMapStyle={customMapStyle}
                onMapReady={() => {
                    //This timeout is dumb but it's the only way to get the library to work with fitToCoordinates
                    setTimeout(() => {
                        mapRef.current.fitToCoordinates(polyLatLng, {
                            animated: true,
                            edgePadding: {
                                top: 15,
                                right: 15,
                                bottom: 15,
                                left: 15
                            }
                        });
                    }, 1000);
                }}

            >

                {markers[0] != null && markers}
                {poly !== null && poly}
                {hazardPoly !== null && hazardPoly}

                <Marker
                    anchor={{ x: 0.5, y: 0.6 }}
                    key={1}
                    coordinate={{
                        latitude: location.latitude,
                        longitude: location.longitude
                    }}
                    flat>
                    <View style={styles.dotContainer}>
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
        </View >
    );
};

export default RoutesMapView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonGroup: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 15,
    },
    button: {
        width: '40%',
        // height: 40
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
