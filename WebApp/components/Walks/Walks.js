import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';

import { getLocation } from '../../services/LocationServices';
import { Spacing, Typography } from '../../styles';
import WalksMapView from './WalksMapView';
import Loading from '../misc/Loading';

const Walks = ({ navigation, route }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [walks, setWalks] = useState([]);
    const [location, setLocation] = useState(null);

    useEffect(() => {
        //Runs on the first instance and anytime the refresh param is different
        setIsLoading(true);
        getWalks().then((walks) => {
            getLocation().then((location) => {
                setLocation(location);
                setIsLoading(false);
            })
        })

    }, [route?.params?.refresh]);

    const getWalks = async () => {
        
        fetch('https://dogwalknationapi.azurewebsites.net/walk/allWalks')
            .then((response) => response.json())
            .then((data) => {
                setWalks(data);
                return data;
            })
            .catch((error) => {
                console.error(error)
                return;
            });
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
                            <WalksMapView location={location.coords} walks={walks} navigation={navigation}/>
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