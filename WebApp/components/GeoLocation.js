import React, { useEffect, useCallback, useRef, useState } from 'react';
import Toast from 'react-native-simple-toast';
import { Button, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, Platform, PermissionsAndroid, useColorScheme, View, Linking, Switch } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

import MapView from './MapView';
import ViewLocationResults from './ViewLocationResults';

import { Spacing } from '../styles';

const GeoLocation = ({ navigation }) => {
    // debugger;
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState();
    const [location, setLocation] = useState(null);
    const [coords, setCoords] = useState(null);
    const [clearMarkers, setClearMarkers] = useState(0);

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

                setLocation(currentLocation);



                //Extract co-ordinates
                let geo = [currentLocation.coords.latitude, currentLocation.coords.longitude];
                setCoords(coords => [...coords, geo]);
                
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

        let isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_LOCATION_UPDATES_TASK)

        //Clear coords array before gathering coords
        setCoords([]);

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
    const stopLocationUpdates = async () => {
        let isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_LOCATION_UPDATES_TASK)

        if (isRegistered) {

            //Pass in boolean for pause/stop and check here

            Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_UPDATES_TASK);

            //If stop then clean and pass through data else do nothing
            if (coords.length > 0) {
                //send to API
            }
        }

    }

    const handleClearMarkers = async () => {
        setCoords([]);
        setClearMarkers(clearMarkers + 1);
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
                        <View style={styles.mainView} >
                            <Button
                                title="Start Observing"
                                onPress={getLocationUpdates} />
                            <Button
                                title="Stop Observing"
                                onPress={stopLocationUpdates} />
                            {/* <ViewLocationResults location={location} /> */}
                            <Button title="Clear map markers" onPress={handleClearMarkers}/>
                            <Button title="Get Location" onPress={getLocation} />
                        </View>
                        <View style={styles.mapSection}>
                            {/* <Text>{text}</Text> */}
                            {<MapView coords={coords || null} location={location.coords} newClearMarker={clearMarkers}/>}
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
    mainView: {
        // flex: 1,
        // height: Spacing.screen.height * 0.90,
        justifyContent: 'center',
        alignItems: "center"
    },
    mapSection: {
        // flex: 9,
        height: Spacing.screen.height * 0.75,
    },
});

export default GeoLocation;
