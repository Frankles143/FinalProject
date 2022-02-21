import React, { useEffect, useCallback, useRef, useState } from 'react';
import Toast from 'react-native-simple-toast';
import { Button, SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocation, checkPermissions } from '../../services/LocationServices';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

import RoutesMapView from './RoutesMapView';
import ViewLocationResults from '../misc/ViewLocationResults';

import { Spacing, Typography, Colours } from '../../styles';
import Loading from '../misc/Loading';

const Routes = ({ navigation, route }) => {
    // debugger;
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState();
    const [location, setLocation] = useState(null);
    const [currentRoute, setCurrentRoute] = useState(null);
    const [coords, setCoords] = useState(null);
    const [clearMarkers, setClearMarkers] = useState(0);
    const [isCalibrating, setIsCalibrating] = useState("");
    const [calCount, setCalCount] = useState(0);
    const [makeHazard, setMakeHazard] = useState(false);

    useEffect(() => {
        getLocation().then((location) => {
            setLocation(location);

            //If there is a current route, set it and coords
            if (route.params?.currentRoute) {
                console.log(route.params.currentRoute)
                setCoords(route.params.currentRoute.routeCoords);
                setCurrentRoute(route.params.currentRoute);
            }
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

        let isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_LOCATION_UPDATES_TASK)

        if (!isRegistered) await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_UPDATES_TASK, {
            accuracy: Location.Accuracy.High,
            timeInterval: 2000,
            distanceInterval: 0,
            foregroundService: {
                notificationTitle: 'Getting location updates',
                notificationBody: 'Location updates are being used to help you track your walk!'
            },
            pausesUpdatesAutomatically: false,

        })
    }

    //Stop the task to get updates
    const stopLocationUpdates = async () => {
        let isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_LOCATION_UPDATES_TASK)
        setIsCalibrating(false);

        if (isRegistered) {
            setCalCount(0);

            Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_UPDATES_TASK);
        }
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
                            <RoutesMapView navigation={navigation} currentRoute={currentRoute || null} coords={coords || null} location={location.coords} newClearMarker={clearMarkers} makeHazard={makeHazard} calibrating={isCalibrating} getLocationUpdates={getLocationUpdates} stopLocationUpdates={stopLocationUpdates}/>
                        </View>
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
        height: Spacing.screen.height * 0.9,
    },
    cal: {
        ...Typography.body.medium,
    }
});

export default Routes;
