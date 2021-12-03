import React, { useEffect, useCallback, useRef, useState } from 'react';
import Toast from 'react-native-simple-toast';
import { Button, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, Platform, PermissionsAndroid, useColorScheme, View, Linking, Switch } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

import MapView from './MapView';
import ViewLocationResults from './ViewLocationResults';

const GeoLocation = ({ navigation }) => {
    // debugger;
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState();
    const [location, setLocation] = useState(null);
    const [coords, setCoords] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [times, setTimes] = useState([]);

    const [text, setText] = useState([]);

    //Function to quickly check permissions for foreground and background tasks
    const checkPermissions = async () => {
        let foreStatus = await Location.requestForegroundPermissionsAsync();
        let backStatus = await Location.requestBackgroundPermissionsAsync();

        if (foreStatus.status != "granted") {
            setErrorMsg("Permission to access location was denied!");
            return false;
        }

        if (backStatus.status != "granted") {
            setErrorMsg("Permission to access location in the background was denied!")
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
        // let geo = [currentLocation.coords.latitude, currentLocation.coords.longitude];

        // setCoords(geo);
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

                // console.log(`locations size: ${locations.length}`, locations);
                setLocation(currentLocation);

                let geo = [currentLocation.coords.latitude, currentLocation.coords.longitude];

                setCoords(coords => [...coords, geo]);
                // let dateTime = `${new Date(locations[0].timestamp).toLocaleString()} \n`;
                // setTimes(currentTimes => [...currentTimes, dateTime]);
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
            Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_UPDATES_TASK);

            setText([]);

            if (coords.length > 0) {
                //send to API
            }

            // coords.forEach(coord => {
            //     var newText = `${coord} \n`;
            //     setText(text => [...text, newText]);
            // })
        }

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
                <SafeAreaView style={backgroundStyle}>
                    <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                    <ScrollView
                        contentInsetAdjustmentBehavior="automatic"
                        style={backgroundStyle}>
                        <View style={styles.mainView} >
                            <Button title="Open Maps" onPress={() => Linking.openURL(`https://www.google.com/maps/search/${location?.coords?.latitude || ''},+${location?.coords?.longitude || ''}/@${location?.coords?.latitude || ''},${location?.coords?.longitude || ''}z`)} />
                            <Button
                                title="Start Observing"
                                onPress={getLocationUpdates} />
                            <Button
                                title="Stop Observing"
                                onPress={stopLocationUpdates} />
                            <Button title="Get Location" onPress={getLocation} />
                            {/* <ViewLocationResults location={location}/> */}
                        </View>
                        <View style={styles.mapSection}>
                            {/* <Text>{text}</Text> */}
                            {<MapView coords={coords || null} location={location.coords} />}
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </>
    );
};

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center"
    },
    mapSection: {
        flexGrow: 1,
        height: 700,
        // ...StyleSheet.absoluteFillObject
    },
});

export default GeoLocation;
