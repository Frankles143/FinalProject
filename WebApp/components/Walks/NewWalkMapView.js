import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, TouchableHighlight, Alert, Modal, TextInput } from 'react-native';
import RNMapView, { Circle, Marker } from 'react-native-maps';
import Toast from 'react-native-simple-toast';

import { Typography, Colours } from '../../styles';
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

const NewWalkMapView = ({ navigation, location }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [newWalkLocation, setNewWalkLocation] = useState(null);
    const [walkName, setWalkName] = useState("");
    const [walkDesc, setWalkDesc] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const mapRef = useRef(null);

    useEffect(() => {
        setModalVisible(false);
        newWalkTutorial();

    }, [location]);

    const newWalkTutorial = () => {
        Alert.alert(
            "Creating a new walk location",
            "Tap a point on the map to create a marker for the location of your new walk! Keep tapping to move the marker and click Create when you are done."
        );
    }

    const handleNewWalk = () => {
        if (walkName !== "" && walkDesc !== "") {
            setIsLoading(true);

            let newWalk = {
                walkName: walkName,
                walkDesc: walkDesc,
                walkCoords: [newWalkLocation.latitude, newWalkLocation.longitude],
            };

            fetch('https://dogwalknationapi.azurewebsites.net/Walk/newWalk', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    newWalk
                )
            })
                .then(response => response.json())
                .then((data) => {
                    setIsLoading(false);
                    setIsComplete(true);
                })
                .catch((error) => console.error(error));

        } else {
            Toast.show("Please enter a walk name and description!")
        }
    }

    function goBackHandler() {
        setModalVisible(false);
        //Go back to walks page without a back button, the random number ensures that a refresh happens on return
        navigation.navigate("Walks", { refresh: Math.random() });
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
                rotateEnabled={true}
                showsPointsOfInterest={false}
                toolbarEnabled={false}
                customMapStyle={customMapStyle}
                onPress={(e) => setNewWalkLocation(e.nativeEvent.coordinate)} >

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
                    newWalkLocation && <Marker coordinate={newWalkLocation} />
                }


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
                <TouchableHighlight style={styles.fab} onPress={() => setModalVisible(true)} underlayColor={Colours.primary.light} >
                    <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.fabText}>Create</Text>
                </TouchableHighlight>
            </View>

            <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        {isLoading ?
                            <Loading />
                            :
                            <>
                                {isComplete ?
                                    //Show this once done
                                    <>
                                        <Text style={styles.modalHeader}>Successfully Added!</Text>
                                        <TouchableHighlight style={[styles.button, styles.buttonClose]} onPress={() => goBackHandler()} underlayColor={Colours.danger.light}>
                                            <Text style={styles.textStyle}>Close and return</Text>
                                        </TouchableHighlight>
                                    </>
                                    :
                                    <>
                                        <Text style={styles.modalHeader}>Create new walk?</Text>
                                        {!newWalkLocation ?
                                            <Text style={styles.modalText}>Please place a marker on the map where you would like your walk location to be!</Text>
                                            :
                                            <>
                                                <Text style={styles.modalText}>Enter a name for the walk and a description to tell people what kind of place this is.</Text>
                                                <TextInput
                                                    style={styles.input}
                                                    onChangeText={(text) => setWalkName(text)}
                                                    value={walkName}
                                                    placeholder="Walk Name"
                                                />
                                                <TextInput
                                                    multiline
                                                    style={styles.input}
                                                    onChangeText={(text) => setWalkDesc(text)}
                                                    value={walkDesc}
                                                    placeholder="Walk Description"
                                                />
                                            </>
                                        }
                                        <View style={styles.break}></View>
                                        <View style={styles.buttonGroup}>
                                            <TouchableHighlight style={[styles.button, styles.buttonClose]} onPress={() => setModalVisible(!modalVisible)} underlayColor={Colours.danger.light}>
                                                <Text style={styles.textStyle}>Close</Text>
                                            </TouchableHighlight>
                                            {
                                                newWalkLocation &&
                                                <TouchableHighlight style={[styles.button, styles.buttonConfirm]} onPress={() => handleNewWalk()} underlayColor={Colours.primary.light}>
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
    fabCon: {
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
        fontSize: 25,
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


export default NewWalkMapView;