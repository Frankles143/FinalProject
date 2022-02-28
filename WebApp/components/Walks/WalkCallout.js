import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { Typography } from '../../styles';

const WalkCallout = ({ walk }) => {
    const [routeNo, setRouteNo] = useState(0);

    useEffect(() => {
        if (walk.walkRoutes?.length) {
            setRouteNo(walk.walkRoutes?.length);
        }
    }, [walk]);

    return (
        <View>
            <Text style={styles.text}>
                <Text style={styles.walkName}>{walk.walkName}{"\n"}</Text>
                {`Number of routes available: ${routeNo} 
Tap here to go to walk page!`}
            </Text>
        </View>
    )
};

const styles = StyleSheet.create({
    text: {
        textAlign: "center",
    },
    walkName: {
        ...Typography.header.small,
    }
});

export default WalkCallout;