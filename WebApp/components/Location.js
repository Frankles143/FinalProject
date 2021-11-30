import React, { useEffect, useCallback, useRef, useState } from 'react';
import { Node } from 'react';
import Toast from 'react-native-simple-toast';
import { Button, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, Platform, PermissionsAndroid, useColorScheme, View, Linking, Switch } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
import VIForegroundService from '@voximplant/react-native-foreground-service';

import appConfig from '../app.json';

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


const Location = ({ navigation }) => {
    // debugger;
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState();
    const [location, setLocation] = useState(null);
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [foregroundService, setForegroundService] = useState(true);
    const [forceLocation, setForceLocation] = useState(true);
    const [highAccuracy, setHighAccuracy] = useState(true);
    const [locationDialog, setLocationDialog] = useState(true);
    const [significantChanges, setSignificantChanges] = useState(false);
    const [observing, setObserving] = useState(false);
    const [useLocationManager, setUseLocationManager] = useState(false);

    const watchId = useRef(null);

    const hasLocationPermission = async () => {

        if (Platform.OS === 'android' && Platform.Version < 23) {
            return true;
        }

        const hasPermission = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (hasPermission) {
            return true;
        }

        const status = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (status === PermissionsAndroid.RESULTS.GRANTED) {
            return true;
        }

        if (status === PermissionsAndroid.RESULTS.DENIED) {
            ToastAndroid.show(
                'Location permission denied by user.',
                ToastAndroid.LONG,
            );
        } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            ToastAndroid.show(
                'Location permission revoked by user.',
                ToastAndroid.LONG,
            );
        }

        return false;
    };

    const getLocation = async () => {
        const hasPermission = await hasLocationPermission();

        if (!hasPermission) {
            return;
        }

        Geolocation.getCurrentPosition(
            (position) => {
                setLocation(position);
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
                console.log(position);
                Toast.show("Location retrieved")
            },
            (error) => {
                Alert.alert(`Code ${error.code}`, error.message);
                setLocation(null);
                setLatitude("");
                setLongitude("");
                console.log(error);
            },
            {
                accuracy: {
                    android: 'high',
                    ios: 'best',
                },
                enableHighAccuracy: highAccuracy,
                timeout: 15000,
                maximumAge: 10000,
                distanceFilter: 0,
                forceRequestLocation: forceLocation,
                forceLocationManager: useLocationManager,
                showLocationDialog: locationDialog,
            },
        );
    };

    const getLocationUpdates = async () => {
        const hasPermission = await hasLocationPermission();

        if (!hasPermission) {
            return;
        }

        if (Platform.OS === 'android' && foregroundService) {
            await startForegroundService();
          }

        setObserving(true);

        watchId.current = Geolocation.watchPosition(
            (position) => {
                setLocation(position);
                console.log(position);
                console.log(new Date(position.timestamp).toLocaleString())
            },
            (error) => {
                setLocation(null);
                console.log(error);
            },
            {
                accuracy: {
                    android: 'high',
                    ios: 'best',
                },
                enableHighAccuracy: highAccuracy,
                distanceFilter: 0,
                interval: 5000, //Every 5 seconds
                fastestInterval: 2000,
                forceRequestLocation: forceLocation,
                forceLocationManager: useLocationManager,
                showLocationDialog: locationDialog,
                useSignificantChanges: significantChanges,
            },
        );
    };

    const removeLocationUpdates = useCallback(() => {
        if (watchId.current !== null) {
            stopForegroundService();
            Geolocation.clearWatch(watchId.current);
            watchId.current = null;
            setObserving(false);
        }
    }, [stopForegroundService]);

    const startForegroundService = async () => {
        if (Platform.Version >= 26) {
            await VIForegroundService.createNotificationChannel({
                id: 'locationChannel',
                name: 'Location Tracking Channel',
                description: 'Tracks location of user',
                enableVibration: false,
            });
        }

        return VIForegroundService.startService({
            channelId: 'locationChannel',
            id: 420,
            title: appConfig.displayName,
            text: 'Tracking location updates',
            icon: 'ic_launcher',
        });
    };

    const stopForegroundService = useCallback(() => {
        VIForegroundService.stopService().catch((err) => err);
    }, []);

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

        setIsLoading(false);


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
                            <Button title="Open Maps" onPress={() => Linking.openURL(`https://www.google.com/maps/search/${latitude},+${longitude}/@${latitude},${longitude}z`)} />
                        </View>
                        <View style={styles.buttons}>
                            <Button
                                title="Start Observing"
                                onPress={getLocationUpdates}
                                disabled={observing}
                            />
                            <Button
                                title="Stop Observing"
                                onPress={removeLocationUpdates}
                                disabled={!observing}
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
                            <Text>Provider: {location?.provider || ''}</Text>
                            <Text>
                                Timestamp:{' '}
                                {location?.timestamp
                                    ? new Date(location.timestamp).toLocaleString()
                                    : ''}
                            </Text>
                        </View>
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
});

export default Location;
