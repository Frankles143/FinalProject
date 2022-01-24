import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { Typography } from '../../styles';
import Loading from '../misc/Loading';

const WalkDetails = ({ navigation, route }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [walk, setWalk] = useState(null);
    const [routeNo, setRouteNo] = useState(0);

    useEffect(() => {
        if (route.params?.walk) {
            setWalk(route.params?.walk);
            console.log(route.params?.walk);
            setIsLoading(false);
        }
    }, [route.params?.walk]);

    return (
        isLoading ? 
        <Loading />
        :
        <Text>Hello <Text style={styles.walkName}>{walk.walkName}</Text></Text>
    )
};

const styles = StyleSheet.create({
    callout: {
        // textAlign: "center",
    },
    text: {
        textAlign: "center",
    },
    walkName: {
        ...Typography.header.small,
    }
});

export default WalkDetails;