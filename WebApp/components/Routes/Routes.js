import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import Toast from 'react-native-simple-toast';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

import { getLocation, checkPermissions } from '../../services/LocationServices';
import { Spacing, Typography } from '../../styles';
import RoutesMapView from './RoutesMapView';
import Loading from '../misc/Loading';

const Routes = ({ navigation, route }) => {
    const [isLoading, setIsLoading] = useState(true);
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
                        Toast.show("Accuracy achieved")
                        setCalCount(5);
                    } else {
                        setCalCount(calCount + 1);
                    }
                } else {
                    setIsCalibrating(false);
                }

            } catch (error) {
                console.error(error);
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
                        contentInsetAdjustmentBehavior="automatic">
                        <View style={styles.mapSection}>
                            <RoutesMapView navigation={navigation} currentRoute={currentRoute || null} coords={coords || null} location={location.coords} newClearMarker={clearMarkers} makeHazard={makeHazard} calibrating={isCalibrating} getLocationUpdates={getLocationUpdates} stopLocationUpdates={stopLocationUpdates}/>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </>
    );
};

const styles = StyleSheet.create({
    mapSection: {
        height: Spacing.screen.height * 0.9,
    },
});

export default Routes;
