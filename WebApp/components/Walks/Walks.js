import React, { useEffect, useState } from 'react';
import Toast from 'react-native-simple-toast';
import {  SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocation } from '../../services/LocationServices';

import WalksMapView from './WalksMapView';

import { Spacing, Typography, Colours } from '../../styles';
import Loading from '../misc/Loading';

const Walks = ({ navigation }) => {
    // debugger;
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState();
    const [walks, setWalks] = useState([]);
    const [location, setLocation] = useState(null);

    useEffect(() => {
        getWalks().then((walks) => {
            getLocation().then((location) => {
                setLocation(location);
                setIsLoading(false);
            })
        })

    }, []);

    const getWalks = async () => {
        console.log("getting walks")
        fetch('https://dogwalknationapi.azurewebsites.net/walk/allWalks')
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setWalks(data);
            })
            .catch((error) => {
                console.log(error)
            });
    }

    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    return (
        isLoading ?
            <Loading />
            :
            <>
                <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                <SafeAreaView style={backgroundStyle}>
                    <ScrollView
                        contentInsetAdjustmentBehavior="automatic"
                        style={styles.container}>
                        <View style={styles.mapSection}>
                            <WalksMapView location={location.coords} walks={walks} navigation={navigation}/>
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