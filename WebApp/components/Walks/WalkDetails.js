import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';

import { Colours, Typography } from '../../styles';
import { body } from '../../styles/typography';
import Loading from '../misc/Loading';

const WalkDetails = ({ navigation, route }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [walk, setWalk] = useState(null);
    const [routes, setRoutes] = useState(null);

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
            <View style={styles.container}>
                <View style={styles.mainView}>
                    <View style={styles.routeView}>
                        <Text style={styles.header}>{walk.walkName}</Text>
                        <ScrollView contentInsetAdjustmentBehavior='automatic'>
                            <Text style={styles.body}>Walk description</Text>
                            <View style={styles.break}></View>

                        </ScrollView>
                    </View>
                </View>

                <View style={styles.commentView}>

                </View>
            </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: 5,
    },
    mainView: {
        flex: 0.55,
        flexDirection: "row",
    },
    routeView: {
        padding: 5,
        flex: 1,
        borderBottomWidth: 2,
    },
    commentView: {
        padding: 5,
        flex: 0.45,
    },
    break: {
        width: "95%",
        borderBottomWidth: 1,
    },
    header: {
        ...Typography.header.largest,
        textAlign: "center",
    },
    body: {
        ...Typography.body.medium,
        textAlign: 'center',
    },
});

export default WalkDetails;