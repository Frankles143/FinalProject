import React, { useEffect, useState } from 'react';
import Toast from 'react-native-simple-toast';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocation } from '../../services/LocationServices';

import NewWalkMapView from './NewWalkMapView';

import { Spacing, Typography, Colours } from '../../styles';
import Loading from '../misc/Loading';

const Walks = ({ navigation }) => {
    // debugger;
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState();
    const [walks, setWalks] = useState([]);
    const [location, setLocation] = useState(null);

    useEffect(() => {
        getLocation().then((location) => {
            setLocation(location);
            setIsLoading(false);
        })

    }, []);

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
                            <NewWalkMapView location={location.coords} navigation={navigation} />
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </>
    );
};

export default Walks;

const styles = StyleSheet.create({
    mapSection: {
        // flex: 9,
        height: Spacing.screen.height * 0.9,
    },
});