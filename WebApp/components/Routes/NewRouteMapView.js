import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, ToastAndroid, Button, TouchableHighlight, TouchableOpacity, Alert, Modal, Pressable, TextInput } from 'react-native';
import RNMapView, { Callout, Circle, Marker, Polyline } from 'react-native-maps';
import Toast from 'react-native-simple-toast';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import { Spacing, Typography, Colours } from '../../styles';
import Calibrating from '../misc/Calibrating';
import Loading from '../misc/Loading';
import { retrieveToken, retrieveUser } from '../../services/StorageServices';
// import WalkCallout from './WalkCallout';

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
];

const NewRouteMapView = ({ navigation, location, coords, walk, calibrating, newClearMarkers, getLocationUpdates, stopLocationUpdates }) => {
    const [clearMarkers, setClearMarkers] = useState(null);
    const [recording, setRecording] = useState(false);
    const [paused, setPaused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [poly, setPoly] = useState(null);
    const [polyLatLng, setPolyLatLng] = useState(null);
    const [newRouteCoords, setNewRouteCoords] = useState(null);
    const [routeName, setRouteName] = useState("");
    const [routeDesc, setRouteDesc] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const mapRef = useRef(null);

    useEffect(() => {
        setModalVisible(false);
        // console.log(coords);
        // console.log(walk);
        setPolyline();

        if (newClearMarkers > clearMarkers) {
            clearPolys();
            setClearMarkers(newClearMarkers);
        }

    }, [location, calibrating]);

    useEffect(() => {
        //This appears every render
        // newRouteTutorial();
    }, []);

    const newRouteTutorial = () => {
        Alert.alert(
            "Creating a new route for a walk",
            `To start putting your coordinates onto the map, press go. 
Press pause if you want to take a break, and press continue to keep going. 
If you want to reset then press stop to remove current route, then press go to start creating a new route.`
        );
    };

    const handleNewRoute = () => {
        if (routeName !== "" && routeDesc !== "") {
            setIsLoading(true);

            let newRoute = {
                routeId: uuidv4(),
                routeName: routeName,
                routeDesc: routeDesc,
                routeCoords: coords,
                routeHazards: null
            };

            //Send new route to the database
            fetch('https://dogwalknationapi.azurewebsites.net/Route/newRoute', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    newRoute
                )
            })
                .then(() => {
                    updateWalk(newRoute);
                })
                .catch((error) => console.error(error));
        } else {
            Toast.show("Please enter a route name and description!");
        }
    };

    const updateWalk = (newRoute) => {
        //Update walk with new route ID
        let updatedWalk = walk;
        let currentRoutes = walk.walkRoutes;

        if (currentRoutes === null) {
            currentRoutes = [newRoute.routeId];
        } else {
            currentRoutes.push(newRoute.routeId);
        }

        updatedWalk = {
            ...updatedWalk,
            walkRoutes: currentRoutes
        };

        fetch('https://dogwalknationapi.azurewebsites.net/Walk/updateWalk', {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                updatedWalk
            )
        })
            .then(() => {
                updateUser(newRoute);
            })
            .catch((error) => console.error(error))
    };

    const updateUser = (newRoute) => {

        retrieveUser().then((user) => {
            retrieveToken().then((token) => {
                let updatedUser = user;

                let currentRoutes = user.createdRoutes;

                if (currentRoutes === null) {
                    currentRoutes = [newRoute.routeId];
                } else {
                    currentRoutes.push(newRoute.routeId);
                }

                updatedUser = {
                    ...updatedUser,
                    createdRoutes: currentRoutes
                };

                fetch('https://dogwalknationapi.azurewebsites.net/User/updateUser', {
                    method: 'PUT',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                },
                    body: JSON.stringify(
                        updatedUser
                    )
                })
                    .then((data) => {
                        setIsLoading(false);
                        setIsComplete(true);
                    })
                    .catch((error) => console.error(error))
            })
        })
    };

    function goBackHandler() {
        setModalVisible(false);
        //Go back to walks page without a back button, the random number ensures that a refresh happens on return
        navigation.navigate("Walks", { refresh: Math.random() });
    };

    const setPolyline = () => {
        // setMarkers([]);

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
            />;
            //Set the poly and also the coords for the route
            setPolyLatLng(latLng);
            setPoly(newPoly);
        } else {
            setPoly(null);
        }
    };

    const handleRecording = (bool) => {
        setRecording(bool);

        if (bool === true) {
            //Start recording
            getLocationUpdates();
        } else if (bool === false) {
            //Stop recording
            setPaused(false);
            stopLocationUpdates();
            setModalVisible(true);
        }
    };

    const handlePaused = (bool) => {
        setPaused(bool);

        if (bool === false) {
            //Unpause
            getLocationUpdates();
        } else if (bool === false) {
            //Pause recording
            stopLocationUpdates();
        }
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
                    zoom: 12,
                }}
                loadingEnabled={false}
                loadingBackgroundColor="white"
                style={styles.map}
                rotateEnabled={false}
                showsPointsOfInterest={false}
                toolbarEnabled={false}
                customMapStyle={customMapStyle}
            >

                {/* Current location */}
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
                        <View style={styles.dot} />
                    </View>
                </Marker>

                {poly !== null && poly}

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
                recording ?
                    //Recording, stop and pause button
                    <>
                        {
                            paused ?
                                //Currently paused, show continue button
                                <View style={styles.fabConLeft}>
                                    <TouchableHighlight style={styles.fab} onPress={() => handlePaused(false)} underlayColor={Colours.primary.light} >
                                        <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.fabText}>Continue</Text>
                                    </TouchableHighlight>
                                </View>
                                :
                                //Not paused, show pause button
                                <View style={styles.fabConLeft}>
                                    <TouchableHighlight style={styles.fab} onPress={() => handlePaused(true)} underlayColor={Colours.primary.light} >
                                        <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.fabText}>Pause</Text>
                                    </TouchableHighlight>
                                </View>
                        }
                        <View style={styles.fabConRight}>
                            <TouchableHighlight style={styles.fab} onPress={() => handleRecording(false)} underlayColor={Colours.primary.light} >
                                <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.fabText}>Stop</Text>
                            </TouchableHighlight>
                        </View>
                    </>
                    :
                    //Not recording, just go button
                    <View style={styles.fabConRight}>
                        <TouchableHighlight style={styles.fab} onPress={() => handleRecording(true)} underlayColor={Colours.primary.light} >
                            <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.fabText}>Go</Text>
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
                                        <Text style={styles.modalHeader}>Create new route?</Text>
                                        {coords == null || !coords?.length > 0 ?
                                            //Show if null or empty array
                                            <Text style={styles.modalText}>You must have some coordinates to create a route!</Text>
                                            :
                                            //Only show this secttion if there is sufficient data
                                            <>
                                                <Text style={styles.modalText}>Enter a name for the route and a description to tell people what kind of place this is.</Text>
                                                <TextInput
                                                    style={styles.input}
                                                    onChangeText={(text) => setRouteName(text)}
                                                    value={routeName}
                                                    placeholder="Route Name"
                                                />
                                                <TextInput
                                                    multiline
                                                    style={styles.input}
                                                    onChangeText={(text) => setRouteDesc(text)}
                                                    value={routeDesc}
                                                    placeholder="Route Description"
                                                />
                                            </>
                                        }
                                        <View style={styles.break}></View>
                                        <View style={styles.buttonGroup}>
                                            <TouchableHighlight style={[styles.button, styles.buttonClose]} onPress={() => setModalVisible(!modalVisible)} underlayColor={Colours.danger.light}>
                                                <Text style={styles.textStyle}>Cancel</Text>
                                            </TouchableHighlight>
                                            {
                                                !coords == null || coords?.length > 0 &&
                                                //Only show this button if there is sufficient data
                                                <TouchableHighlight style={[styles.button, styles.buttonConfirm]} onPress={() => handleNewRoute()} underlayColor={Colours.primary.light}>
                                                    <Text style={styles.textStyle}>Create</Text>
                                                </TouchableHighlight>
                                            }
                                        </View>
                                    </>
                                }
                            </>
                        }
                    </View>
                </View>
            </Modal>
            <Calibrating isCalibrating={calibrating} />
        </View>
    );

};

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
    fabConLeft: {
        flex: 1,
        position: "absolute",
        bottom: 15,
        left: 15,
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


export default NewRouteMapView;