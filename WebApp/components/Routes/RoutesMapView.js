import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, ToastAndroid, Button, TouchableHighlight, Alert, Modal, TextInput, BackHandler } from 'react-native';
import RNMapView, { Callout, Circle, Marker, Polyline } from 'react-native-maps';
import { HeaderBackButton } from '@react-navigation/elements';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid';

import { Typography, Colours } from '../../styles';
import { retrieveUser } from '../../services/StorageServices';
import Loading from '../misc/Loading';

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

const RoutesMapView = ({ navigation, location, currentRoute, coords, newClearMarker, isCalibrating, getLocationUpdates, stopLocationUpdates }) => {
    const [clearMarkers, setClearMarkers] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [poly, setPoly] = useState(null);
    const [polyLatLng, setPolyLatLng] = useState(null);
    const [hazardDescs, setHazardDescs] = useState(null);
    const [hazardPoly, setHazardPoly] = useState(null);
    const [selectedPointStart, setSelectedPointStart] = useState(null);
    const [selectedPointEnd, setSelectedPointEnd] = useState(null);
    const [tracks, setTracks] = useState(false);
    const [isTracking, setIsTracking] = useState(false);
    const [makeHazard, setMakeHazard] = useState(false);
    const [route, setRoute] = useState(currentRoute);
    const [modalVisible, setModalVisible] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [desc, setDesc] = useState("");
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

        //Change button depending on what is currently happening
        if (makeHazard === false) {
            retrieveUser().then((user) => {
                if (user.createdRoutes?.includes(currentRoute.id)) {
                    navigation.setOptions({
                        headerRight: () => (
                            <Button title="Add hazard"
                                color={Colours.primary.base}
                                accessibilityLabel="This opens a dialog to confirm addition of new hazard"
                                onPress={() => confirmCreateHazard()} />
                        ),
                    })
                }
            })
        } else {
            navigation.setOptions({
                headerRight: () => (
                    <Button title="Cancel hazard"
                        color={Colours.primary.base}
                        accessibilityLabel="This cancels the addition of new hazard"
                        onPress={() => confirmCancelHazard()} />
                ),
            })
        }

    }, [location, coords, newClearMarker, makeHazard, selectedPointStart, selectedPointEnd, tracks]);

    //Returning true here tells react navigation not to pop a screen as well as doing the function
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                stopLocationUpdates();
                navigation.goBack();

                return true;
            };
            BackHandler.addEventListener("hardwareBackPress", onBackPress);

            return () =>
                BackHandler.removeEventListener("hardwareBackPress", onBackPress);
        }, [])
    );

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (<HeaderBackButton style={{ marginLeft: 0 }} onPress={() => goBackOverride()} />),
        });

    }, [navigation]);

    const goBackOverride = () => {
        stopLocationUpdates();
        navigation.goBack();
    };

    const confirmCreateHazard = () => {
        Alert.alert(
            "Create new hazard?",
            "Would you like to create a new hazard for this route?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { text: "Confirm", onPress: () => setMakeHazard(true) }
            ],
            {
                cancelable: true,
            }
        );
    }

    const confirmCancelHazard = () => {
        Alert.alert(
            "Cancel new hazard?",
            "Would you like to cancel the creation a new hazard?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { text: "Confirm", onPress: () => { setMakeHazard(false); setModalVisible(false); } }
            ],
            {
                cancelable: true,
            }
        );
    }

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

                let markerColour = Colours.blue.base;

                //if selected points are null then normal, else colour one, else colour all in between 
                if (selectedPointStart !== null && selectedPointEnd === null && selectedPointStart === i) {
                    markerColour = Colours.red.base;

                } else if (selectedPointStart !== null && selectedPointEnd !== null && i >= selectedPointStart && i <= selectedPointEnd) {
                    markerColour = Colours.red.base;
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
                        <View style={[styles.hazardMarker, { backgroundColor: markerColour }]} />
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

        } else if (selectedPointStart !== null && selectedPointEnd === null) {

            if (markerKey < selectedPointStart) {
                Toast.show("Please select two markers in walk order!");
            } else {
                setSelectedPointEnd(markerKey);
                setModalVisible(true);
            }
        }

        if (selectedPointStart !== null && selectedPointEnd !== null) {

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

            let latLng = [], tempPolys = [], tempDescs = [];

            //Create poly for each hazard and a tappable description marker
            tempHazards.forEach((hazard, i) => {
                latLng = [];
                hazard.hazardCoords.forEach(coord => {
                    latLng = [...latLng, { latitude: coord[0], longitude: coord[1] }];
                });

                //At the halfway mark of the polyline, put down a description marker
                let half = Math.floor(latLng.length / 2);
                let newDesc = <Marker
                    key={i}
                    coordinate={latLng[half]}
                    anchor={{ x: 0.5, y: 0.6 }}
                >
                    <View style={styles.dotContainer}>
                        <View style={styles.hazardDot} />

                        <View style={styles.calloutView}>
                            <Callout style={styles.hazardCallout}>
                                <Text style={styles.hazardText}>{hazard.hazardName}</Text>
                            </Callout>
                        </View>
                    </View>
                </Marker>

                let newPoly = <Polyline
                    coordinates={latLng}
                    strokeWidth={11}
                    strokeColor={Colours.red.base}
                    // tappable
                    // This would be the way to make a custom callout for polylines
                    // onPress={(e) => console.log(e.target._internalFiberInstanceHandleDEV.memoizedProps.coordinates)}
                    key={i}
                />

                tempDescs.push(newDesc);
                tempPolys.push(newPoly);
            });
            //Set hazards and hazard poly
            setHazards(tempHazards);
            setHazardDescs(tempDescs)
            setHazardPoly(tempPolys);
        } else {
            setHazardPoly(null);
        }
    }

    const clearPolys = () => {
        setHazardDescs(null);
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
        setIsLoading(true);
        
        let newHazard = {
            hazardId: uuidv4(),
            hazardName: desc,
            hazardColour: "",
            hazardCoords: coords
        };

        let updatedRoute = route;
        let routeHazards = updatedRoute.routeHazards;

        if (routeHazards === null) {
            routeHazards = [newHazard];
        } else {
            routeHazards.push(newHazard);
        }

        updatedRoute = {
            ...updatedRoute,
            routeHazards: routeHazards
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
                response.json();
            })
            .then((data) => {
                setIsComplete(true);
                setIsLoading(false);

            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handlePaused = (bool) => {
        //Turn tracking on or off - true or false
        if (bool) {
            getLocationUpdates();
            setIsTracking(true);
        } else {
            stopLocationUpdates();
            setIsTracking(false);
        }
    };

    function goBackHandler() {
        setModalVisible(false);
        //Go back to walks page without a back button, the random number ensures that a refresh happens on return
        navigation.navigate("Home", { refresh: Math.random() });
    };

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
                loadingEnabled={false}
                loadingBackgroundColor="white"
                style={styles.map}
                rotateEnabled={true}
                showsPointsOfInterest={false}
                toolbarEnabled={false}
                customMapStyle={customMapStyle}
                onMapReady={() => {
                    //This timeout is bad but it's the only way to get the library to work with fitToCoordinates
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
                {hazardDescs !== null && hazardDescs}

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
            {
                !isTracking ?
                    //Currently paused, show continue button
                    <View style={styles.fabConRight}>
                        <TouchableHighlight style={styles.fab} onPress={() => handlePaused(true)} underlayColor={Colours.primary.light} >
                            <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.fabText}>Track</Text>
                        </TouchableHighlight>
                    </View>
                    :
                    //Not paused, show pause button
                    <View style={styles.fabConRight}>
                        <TouchableHighlight style={styles.fab} onPress={() => handlePaused(false)} underlayColor={Colours.primary.light} >
                            <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.fabText}>Stop</Text>
                        </TouchableHighlight>
                    </View>
            }
            <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        {isLoading ?
                            <Loading />
                            :
                            <>
                                {isComplete ?
                                    //Show this once finished
                                    <>
                                        <Text style={styles.modalHeader}>Successfully Added!</Text>
                                        <TouchableHighlight style={[styles.button, styles.buttonClose]} onPress={() => goBackHandler()} underlayColor={Colours.danger.light}>
                                            <Text style={styles.textStyle}>Close and return</Text>
                                        </TouchableHighlight>
                                    </>
                                    :
                                    <>
                                        <Text style={styles.modalHeader}>Create new hazard?</Text>
                                        <Text style={styles.modalText}>Enter a description for this hazard that people will be able to see.</Text>
                                        <TextInput
                                            multiline
                                            style={styles.input}
                                            onChangeText={(text) => setDesc(text)}
                                            value={desc}
                                            placeholder="Description"
                                        />
                                        <View style={styles.break}></View>
                                        <View style={styles.buttonGroup}>
                                            <TouchableHighlight style={[styles.button, styles.buttonClose]} onPress={() => confirmCancelHazard()} underlayColor={Colours.danger.light}>
                                                <Text style={styles.textStyle}>Cancel</Text>
                                            </TouchableHighlight>

                                            <TouchableHighlight style={[styles.button, styles.buttonConfirm]} onPress={() => handleSaveHazard()} underlayColor={Colours.primary.light}>
                                                <Text style={styles.textStyle}>Create</Text>
                                            </TouchableHighlight>
                                        </View>
                                    </>
                                }
                            </>
                        }
                    </View>
                </View>
            </Modal>
        </View >
    );
};

export default RoutesMapView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fabConRight: {
        flex: 1,
        position: "absolute",
        bottom: 15,
        right: 15,
    },
    fab: {
        backgroundColor: Colours.primary.base,
        height: 50,
        width: 100,
        borderRadius: 20,
    },
    fabText: {
        fontSize: 24,
        paddingTop: 8,
        color: "white",
        textAlign: "center",
    },
    buttonGroup: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 15,
    },
    button: {
        width: '40%',
    },
    map: {
        flex: 1,
    },
    dotContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    hazardMarker: {
        margin: 5,
        borderWidth: 1,
        borderRadius: 3,
        width: 14,
        height: 14,
        transform: [{ rotate: "45deg" }]
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
    hazardDot: {
        backgroundColor: Colours.red.base,
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
    calloutView: {
        alignSelf: "center",
        width: 200,

    },
    hazardCallout: {
        padding: 5,
    },
    hazardText: {
        ...Typography.body.medium,
        textAlign: "center",
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    buttonGroup: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonConfirm: {
        backgroundColor: Colours.primary.base,
    },
    buttonClose: {
        backgroundColor: Colours.danger.base,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalHeader: {
        marginBottom: 10,
        ...Typography.header.largest
    },
    modalText: {
        ...Typography.body.medium,
        textAlign: "center"
    },
    break: {
        marginTop: 25,
        marginBottom: 20,
        width: "100%",
        borderBottomWidth: 1,
    },
    input: {
        borderWidth: 1,
        width: "80%",
        margin: 10,
        padding: 10,
    },
});
