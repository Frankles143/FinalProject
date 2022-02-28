import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { getLocation } from '../../services/LocationServices';
import { Spacing } from '../../styles';
import NewWalkMapView from './NewWalkMapView';
import Loading from '../misc/Loading';

const Walks = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(true);
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
                        contentInsetAdjustmentBehavior="automatic">
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
        height: Spacing.screen.height * 0.9,
    },
});