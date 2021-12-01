import React, { useEffect, useCallback, useRef, useState } from 'react';
import { Node } from 'react';
import Toast from 'react-native-simple-toast';
import { Button, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, Platform, PermissionsAndroid, useColorScheme, View, Linking, Switch } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

import RNMapView, { Circle, Marker } from 'react-native-maps';

import appConfig from '../app.json';
import MapView from './MapView';

const Section = ({ children, title }) => {
    const isDarkMode = useColorScheme() === 'dark';
    return (
        <View style={styles.sectionContainer}>
            <Text
                style={[
                    styles.sectionTitle,
                    {
                        color: isDarkMode ? Colors.white : Colors.black,
                    },
                ]}>
                {title}
            </Text>
            <Text
                style={[
                    styles.sectionDescription,
                    {
                        color: isDarkMode ? Colors.light : Colors.dark,
                    },
                ]}>
                {children}
            </Text>
        </View>
    );
};


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
        console.log(currentLocation);
        setLocation(currentLocation);
        let geo = [currentLocation.coords.latitude, currentLocation.coords.longitude];

        setCoords(geo);
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
            timeInterval: 5000,
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

            coords.forEach(coord => {
                var newText = `${coord} \n`;
                setText(text => [...text, newText]);
            })
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
            <SafeAreaView style={backgroundStyle}>
                <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    style={backgroundStyle}>
                    <View style={styles.mainView} >

                        <View style={styles.buttonContainer}>
                            <Button title="Get Location" onPress={getLocation} />
                            <Text>{latitude}</Text>
                            <Text>{longitude}</Text>
                            <Text></Text>
                            <Button title="Open Maps" onPress={() => Linking.openURL(`https://www.google.com/maps/search/${location?.coords?.latitude || ''},+${location?.coords?.longitude || ''}/@${location?.coords?.latitude || ''},${location?.coords?.longitude || ''}z`)} />
                        </View>
                        <View style={styles.buttons}>
                            <Button
                                title="Start Observing"
                                onPress={getLocationUpdates}
                            // disabled={observing}
                            />
                            <Button
                                title="Stop Observing"
                                onPress={stopLocationUpdates}
                            // disabled={!observing}
                            />
                        </View>
                        <View style={styles.result}>
                            <Text>Latitude: {location?.coords?.latitude || ''}</Text>
                            <Text>Longitude: {location?.coords?.longitude || ''}</Text>
                            <Text>Heading: {location?.coords?.heading}</Text>
                            <Text>Accuracy: {location?.coords?.accuracy}</Text>
                            <Text>Altitude: {location?.coords?.altitude}</Text>
                            <Text>Altitude Accuracy: {location?.coords?.altitudeAccuracy}</Text>
                            <Text>Speed: {location?.coords?.speed}</Text>
                            <Text>
                                Timestamp:{' '}
                                {location?.timestamp
                                    ? new Date(location.timestamp).toLocaleString()
                                    : ''}
                            </Text>
                        </View>

                    </View>
                    <View style={styles.mapSection}>
                        {/* <Text>{text}</Text> */}
                        {<MapView coords={coords || null} />}
                    </View>
                </ScrollView>
            </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
    mainView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center"
    },
    result: {
        borderWidth: 1,
        borderColor: '#666',
        width: '100%',
        padding: 10,
    },
    input: {
        width: '60%',
        marginTop: 20,
        borderStyle: "solid",
        borderColor: "black",
        borderWidth: 2
    },
    submit: {
        width: "40%",
        marginTop: 15,
    },
    mapSection: {
        flexGrow: 1,
        height: 600,
    },
});

export default GeoLocation;
