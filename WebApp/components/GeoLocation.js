import React, { useEffect, useCallback, useRef, useState } from 'react';
import Toast from 'react-native-simple-toast';
import { Button, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, Platform, PermissionsAndroid, useColorScheme, View, Linking, Switch } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

import MapView from './MapView';
import ViewLocationResults from './ViewLocationResults';

import { Spacing, Typography, Colours } from '../styles';

const GeoLocation = ({ navigation }) => {
    // debugger;
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState();
    const [location, setLocation] = useState(null);
    const [route, setRoute] = useState(null);
    const [coords, setCoords] = useState(null);
    const [clearMarkers, setClearMarkers] = useState(0);
    const [isCalibrating, setIsCalibrating] = useState("");
    const [calCount, setCalCount] = useState(0);
    const [makeHazard, setMakeHazard] = useState(false);

    //Function to quickly check permissions for foreground and background tasks
    const checkPermissions = async () => {
        let foreStatus = await Location.requestForegroundPermissionsAsync();
        let backStatus = await Location.requestBackgroundPermissionsAsync();

        if (foreStatus.status != "granted") {
            Toast.show("Permission to access location was denied!");
            return false;
        }

        if (backStatus.status != "granted") {
            Toast.show("Permission to access location in the background was denied!")
            return false;
        }

        return true;
    }

    //Get current location
    const getLocation = async () => {

        if (!checkPermissions) {
            return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({ accuracy: 6 });
        setLocation(currentLocation);
    };

    //Define a task to get background updates
    const BACKGROUND_LOCATION_UPDATES_TASK = 'background-location-updates'
    TaskManager.defineTask(BACKGROUND_LOCATION_UPDATES_TASK, handleLocationUpdate)

    //Function to handle the task data
    async function handleLocationUpdate({ data, error }) {

        if (error) {
            Toast.show("error");
            return
        }
        if (data) {
            try {
                const { locations } = data;
                const currentLocation = locations[0];

                //Sets users current position
                setLocation(currentLocation);

                //Calibration
                if (calCount < 5) {
                    setIsCalibrating("Calibration in progress...");
                    //Get 5 readings, unless the accuracy increases to an acceptable level first
                    if (currentLocation.coords.accuracy < 8 && calCount > 1) {
                        console.log("Accuracy achieved")
                        setCalCount(5);
                    } else {
                        console.log("Calibrating...")
                        setCalCount(calCount + 1);
                    }
                } else {
                    setIsCalibrating("");
                    //Bool flag here for isRecording
                    // Tweak saving algorithm here, save every other coord, check for accuracy etc.

                    //Extract co-ordinates
                    let geo = [currentLocation.coords.latitude, currentLocation.coords.longitude];
                    setCoords(coords => [...coords, geo]);
                    // console.log("Saved")
                }

            } catch (error) {
                console.log('the error', error)
            }
        }
    }

    //Start getting location updates
    const getLocationUpdates = async () => {
        if (!checkPermissions) {
            return;
        }

        //Initialise empty array
        if (coords == null) {
            setCoords([]);
        }

        let isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_LOCATION_UPDATES_TASK)

        if (!isRegistered) await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_UPDATES_TASK, {
            accuracy: Location.Accuracy.High,
            timeInterval: 2000,
            distanceInterval: 0,
            foregroundService: {
                notificationTitle: 'Getting location updates',
                notificationBody: 'Location updates are being used to create your new route!'
            },
            pausesUpdatesAutomatically: false,

        })
    }

    //Stop the task to get updates
    const stopLocationUpdates = async (isStop) => {
        let isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_LOCATION_UPDATES_TASK)
        setIsCalibrating("");

        if (isRegistered) {
            setCalCount(0);

            Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_UPDATES_TASK);

            //If stop then clean and pass through data else do nothing
            if (isStop) {
                if (coords.length > 0) {
                    //send to API
                    saveRoute(coords).then(() => {
                        console.log("Saved and stopped");
                    })
                }
            } else {
                console.log("Paused");
            }

        }
    }

    const saveRoute = async (coords) => {

        fetch('https://dogwalknationapi.azurewebsites.net/route/newroute', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                coords
            )
        })
            .then(response => { response.json() })
            .then(json => {
                console.log(json);
                handleClearMarkers();
                setCoords([]);
            })
    }

    const handleClearMarkers = async () => {
        setCoords([]);
        setClearMarkers(clearMarkers + 1);
    }

    const loadRoute = async () => {
        fetch('https://dogwalknationapi.azurewebsites.net/route/95e416c2-a948-448e-9545-67cbfd8e2b7c')
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setCoords(data.routeCoords);
                setRoute(data);
            })
            .catch((error) => {
                console.log(error)
            });
    }

    

    useEffect(() => {
        // try {
        //     AsyncStorage.getItem("User")
        //         .then((value) => {
        //             if (value !== null) {
        //                 var JsonValue = JSON.parse(value);
        //                 setUser(JsonValue);
        //                 setIsLoading(false);


        //             }
        //         })
        // } catch (e) {
        //     // error reading value
        //     console.log(e);
        // }
        getLocation().then(() => {
            setIsLoading(false);
        })


    }, []);

    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };


    return (
        isLoading ?
            <Text></Text>
            :
            <>
                <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                <SafeAreaView style={backgroundStyle}>
                    <ScrollView
                        contentInsetAdjustmentBehavior="automatic"
                        style={styles.container}>
                        {/* <View style={styles.container}> */}
                        <View style={styles.buttonGroup} >
                            <Button style={styles.button} color={Colours.primary.base} title="Start" onPress={getLocationUpdates} />
                            <Button style={styles.button} color={Colours.primary.base} title="Stop" onPress={() => stopLocationUpdates(true)} />
                            <Button style={styles.button} color={Colours.primary.base} title="Pause" onPress={() => stopLocationUpdates(false)} />
                            {/* <ViewLocationResults location={location} /> */}
                            <Button style={styles.button} color={Colours.primary.base} title="Clear" onPress={handleClearMarkers} />
                            <Button style={styles.button} color={Colours.primary.base} title="Get" onPress={getLocation} />
                        </View>
                        <View style={styles.buttonGroup}>
                            <Button style={styles.button} color={Colours.primary.base} title="Load route" onPress={loadRoute} />
                            <Button style={styles.button} color={Colours.primary.base} title="Create hazard" onPress={() => setMakeHazard(!makeHazard)} />
                        </View>
                        <View style={styles.mapSection}>
                            {/* <Text>{text}</Text> */}
                            <Text styles={styles.cal}>{isCalibrating}</Text>
                            <MapView currentRoute={route || null} location={location.coords} newClearMarker={clearMarkers} makeHazard={makeHazard} />

                        </View>
                        <View>

                        </View>
                        {/* </View> */}
                    </ScrollView>
                </SafeAreaView>
            </>
    );
};

const styles = StyleSheet.create({
    container: {
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
    mapSection: {
        // flex: 9,
        height: Spacing.screen.height * 0.845,
    },
    cal: {
        ...Typography.body.medium,
    }
});

export default GeoLocation;
