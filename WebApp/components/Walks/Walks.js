import React, { useEffect, useCallback, useRef, useState } from 'react';
import Toast from 'react-native-simple-toast';
import { Button, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, Platform, PermissionsAndroid, useColorScheme, View, Linking, Switch } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { getLocation } from '../../services/LocationServices';

import WalksMapView from './WalksMapView';
import ViewLocationResults from '../ViewLocationResults';

import { Spacing, Typography, Colours } from '../../styles';

const Walks = ({ navigation }) => {
    // debugger;
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState();
    const [location, setLocation] = useState(null);

    useEffect(() => {
        getLocation().then((location) => {
            setLocation(location);
            setIsLoading(false);
        })
    }, []);

    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    return (
        isLoading ?
            <Text>Loading</Text>
            :
            <>
                <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                <SafeAreaView style={backgroundStyle}>
                    <ScrollView
                        contentInsetAdjustmentBehavior="automatic"
                        style={styles.container}>
                        <View style={styles.mapSection}>
                            <WalksMapView location={location.coords} />
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </>
    );
};

export default Walks;

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