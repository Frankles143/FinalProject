import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableHighlight, Button, Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colours, Typography } from '../../styles';
import Loading from '../misc/Loading';

const WalkDetails = ({ navigation, route }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [walk, setWalk] = useState(null);
    const [routes, setRoutes] = useState(null);
    const [routeOutput, setRouteOutput] = useState(null);

    useEffect(() => {
        if (route.params?.walk) {
            setWalk(route.params?.walk)
            // console.log(route.params?.walk);
            getRoutes(route.params?.walk);
        }
    }, [route.params?.walk]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button title="New Route"
                    color={Colours.primary.base}
                    accessibilityLabel="This opens a dialog to confirm creation of a new route"
                    onPress={() => confirmCreateRoute()} />
            ),
        });
    }, [navigation])

    const confirmCreateRoute = () =>
        Alert.alert(
            "Create new route?",
            "Would you like to create a new route for this walk?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { text: "Confirm", onPress: () => navigation.navigate("New Route", { walk: route.params?.walk }) }
            ],
            {
                cancelable: true,
            }
        );

    const getRoutes = (walk) => {
        let routeIds = {
            ids: []
        };

        if (walk?.walkRoutes?.length > 0) {
            routeIds.ids = walk.walkRoutes;

            fetch('https://dogwalknationapi.azurewebsites.net/Route/getRoutes', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    routeIds
                )
            })
                .then(response => response.json())
                .then((data) => {
                    handleRoutes(data.routes);
                })
                .catch((error) => console.error(error));
        }
        else {
            setRoutes(null);
            setIsLoading(false);
        }
    }

    const handleRoutes = (routes) => {
        let routeOuts = [], hazards;

        routes.forEach((route, i) => {
            if (route.routeHazards?.length > 0) {
                hazards = route.routeHazards.length;
            } else {
                hazards = 0;
            }

            var tempRouteOut =
                <TouchableHighlight key={i} onPress={() => navigation.navigate("Routes", { currentRoute: route })} underlayColor="white">
                    <View>
                        <Text></Text>
                        <Text style={styles.body}>Route name: {route.routeName}</Text>
                        <Text style={styles.body}>Route Description: {route.routeDesc}</Text>
                        <Text style={styles.body}>Number of hazards: {hazards}</Text>
                        <Text></Text>
                        <View style={styles.break}></View>
                    </View>
                </TouchableHighlight>

            routeOuts.push(tempRouteOut);
        });

        setRouteOutput(routeOuts);
        setRoutes(routes);
        setIsLoading(false);
    }

    return (
        isLoading ?
            <Loading />
            :
            <>
                <SafeAreaView style={styles.container}>
                        <View style={styles.mainView}>
                            <View style={styles.routeView}>
                                <Text style={styles.header}>{walk.walkName}</Text>
                                <ScrollView contentInsetAdjustmentBehavior='automatic'>
                                    <Text style={styles.body}>{walk.walkDesc}</Text>
                                    <Text style={styles.body}>Tap on a route to view it!</Text>
                                    <View style={styles.break}></View>
                                    {!routeOutput ? <Text style={[styles.header, styles.noRoutes]}>No routes!</Text> : routeOutput}
                                </ScrollView>
                            </View>
                        </View>

                        <View style={styles.commentView}>
                            <Text style={styles.header}>Comments</Text>
                            <ScrollView contentInsetAdjustmentBehavior='automatic'>

                            </ScrollView>
                        </View>
                </SafeAreaView>
            </>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        width: "90%",
        marginLeft: "5%",
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
    noRoutes: {
        marginTop: 100,
    }
});


export default WalkDetails;