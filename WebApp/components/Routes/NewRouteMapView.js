import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, ToastAndroid, Button, TouchableHighlight, TouchableOpacity, Alert, Modal, Pressable, TextInput } from 'react-native';
import RNMapView, { Callout, Circle, Marker, Polyline } from 'react-native-maps';
import Toast from 'react-native-simple-toast';
import { v4 as uuidv4 } from 'uuid';

import { Spacing, Typography, Colours } from '../../styles';
import Loading from '../misc/Loading';
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
]

const NewRouteMapView = ({ navigation, location, coords, walk, newClearMarkers, getLocationUpdates, stopLocationUpdates }) => {
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
        // newRouteTutorial();
        console.log(walk);
        setPolyline();

        if (newClearMarkers > clearMarkers) {
            clearPolys();
            setClearMarkers(newClearMarkers);
        }

    }, [location]);

    const newRouteTutorial = () => {
        Alert.alert(
            "Creating a new route for a walk",
            `To start putting your coordinates onto the map, press go. 
Press pause if you want to take a break, and press continue to keep going. 
If you want to reset then press stop to remove current route, then press go to start creating a new route.`
        );
    }

    const handleNewRoute = () => {
        if (routeName !== "" && routeDesc !== "") {
            setIsLoading(true);

            let newRoute = {

            };

            // fetch('https://dogwalknationapi.azurewebsites.net/Route/newRoute', {
            //     method: 'POST',
            //     headers: {
            //         Accept: 'application/json',
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify(
            //         newRoute
            //     )
            // })
            //     .then(response => response.json())
            //     .then((data) => {
            //         setIsLoading(false);
            //         setIsComplete(true);
            //         setTimeout(() => { goBackHandler(); }, 3000);
            //     })
            //     .catch((error) => console.error(error));

            setIsLoading(false);
            setIsComplete(true);
            setTimeout(() => { goBackHandler(); }, 3000);
        } else {
            Toast.show("Please enter a route name and description!")
        }
    }

    function goBackHandler() {
        setModalVisible(false);
        //Go back to walks page without a back button, the random number ensures that a refresh happens on return
        navigation.navigate("Walks", { refresh: Math.random() });
    }

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
            />
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
            getLocationUpdates();
        } else if (bool === false) {
            stopLocationUpdates(true);
        }
    }

    const handlePaused = (bool) => {
        setPaused(bool);

        if (bool === false) {
            getLocationUpdates();
        } else if (bool === false) {
            stopLocationUpdates(false);
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
                    zoom: 12,
                }}
                loadingEnabled={false}
                loadingBackgroundColor="white"
                style={styles.map}
                rotateEnabled={false}
                showsPointsOfInterest={false}
                toolbarEnabled={false}
                customMapStyle={customMapStyle}
            // onPress={(e) => setNewWalkLocation(e.nativeEvent.coordinate)} 
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

                {/* Anywhere you touch, create a marker there */}
                {
                    // newWalkLocation && <Marker coordinate={newWalkLocation} />
                }

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
                                    <Text style={styles.modalHeader}>Successfully Added!</Text>
                                    :
                                    <>
                                        <Text style={styles.modalHeader}>Create new route?</Text>
                                        {!newRouteCoords ?
                                            <Text style={styles.modalText}>You must have some coordinates to create a route!</Text>
                                            :
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
                                                <Text style={styles.textStyle}>Close</Text>
                                            </TouchableHighlight>
                                            {
                                                newRouteCoords &&
                                                <TouchableHighlight style={[styles.button, styles.buttonConfirm]} onPress={() => handleNewRoute()} underlayColor={Colours.primary.light}>
                                                    <Text style={styles.textStyle}>Confirm</Text>
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