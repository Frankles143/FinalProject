import React, { useEffect, useState } from 'react';
import Toast from 'react-native-simple-toast';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocation, checkPermissions } from '../../services/LocationServices';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

import NewRouteMapView from './NewRouteMapView';

import { Spacing, Typography, Colours } from '../../styles';
import Loading from '../misc/Loading';

const NewRoute = ({ navigation, route }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState();
    const [walk, setWalk] = useState();
    const [location, setLocation] = useState(null);
    const [coords, setCoords] = useState(null);
    const [clearMarkers, setClearMarkers] = useState(0);
    const [isCalibrating, setIsCalibrating] = useState(false);
    const [calCount, setCalCount] = useState(0);

    useEffect(() => {
        getLocation().then((location) => {
            setLocation(location);
            setWalk(route.params?.walk);
            // console.log(route.params?.walk);
            setIsLoading(false);
        })
    }, []);

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
                    setIsCalibrating(true);
                    //Get 5 readings, unless the accuracy increases to an acceptable level first
                    if (currentLocation.coords.accuracy < 8 && calCount > 1) {
                        console.log("Accuracy achieved")
                        setCalCount(5);
                    } else {
                        console.log("Calibrating...")
                        setCalCount(calCount + 1);
                    }
                } else {
                    setIsCalibrating(false);
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

    //TODO: Add this as a return function in useEffect to make sure it stops getting updates if app crashes mid way etc. 
    //Stop the task to get updates
    const stopLocationUpdates = async () => {
        let isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_LOCATION_UPDATES_TASK)
        setIsCalibrating(false);

        if (isRegistered) {
            setCalCount(0);

            Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_UPDATES_TASK);
        }
    }

    const handleClearMarkers = async () => {
        setCoords([]);
        setClearMarkers(clearMarkers + 1);
    }

    return (
        isLoading ?
            <Loading />
            :
            <>
                <SafeAreaView>
                    <ScrollView
                        contentInsetAdjustmentBehavior="automatic"
                        style={styles.container}>
                        <View style={styles.mapSection}>
                            <NewRouteMapView location={location.coords || null} coords={coords || null} walk={walk || null} navigation={navigation} newClearMarker={clearMarkers} calibrating={isCalibrating} getLocationUpdates={getLocationUpdates} stopLocationUpdates={stopLocationUpdates} />
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </>
    );
};

export default NewRoute;

const styles = StyleSheet.create({
    mapSection: {
        // flex: 9,
        height: Spacing.screen.height * 0.9,
    },
});