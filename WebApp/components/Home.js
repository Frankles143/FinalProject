import React, { useEffect, useState } from 'react';
import { Button, SafeAreaView, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { retrieveUser } from '../services/StorageServices';
import { Colours, Typography } from '../styles';
import Loading from './misc/Loading';

const Home = ({ navigation }) => {
    // debugger;
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [userRoutes, setUserRoutes] = useState(null);
    const [routeOutput, setRouteOutput] = useState(null);

    useEffect(() => {
        retrieveUser().then((user) => {
            getUserRoutes(user);
        })
    }, []);

    const getUserRoutes = (user) => {

        let routeIds = {
            ids: []
        };

        if (user?.createdRoutes?.length > 0) {
            routeIds.ids = user.createdRoutes;

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
                    handleRoutes(user, data.routes);
                })
                .catch((error) => console.error(error));
        }
        else {
            setCurrentUser(user);
            setUserRoutes(null);
            setIsLoading(false);
        }
    }

    const handleRoutes = (user, routes) => {
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
        setUserRoutes(routes);
        setCurrentUser(user);
        setIsLoading(false);
    }

    return (
        isLoading ?
            <Loading />
            :
            <>
                <SafeAreaView style={styles.container}>
                    <View style={styles.mainView} >
                        <View style={styles.welcomeSection}>
                            <Text style={styles.loginText}>Welcome back, {currentUser.firstName} {currentUser.lastName}!</Text>
                            <Text></Text>
                            <View style={styles.buttonContainer}>
                                <Button style={styles.walkButton} title="Find walks" onPress={() => navigation.navigate("Walks")} color={Colours.primary.base} />
                            </View>
                        </View>

                        <View style={styles.createdSection}>
                            <ScrollView style={styles.createdRoutes} contentInsetAdjustmentBehavior="automatic">
                                <Text style={styles.header}>Created Routes</Text>
                                {!routeOutput ? <Text style={[styles.header, styles.noRoutes]}>No routes!</Text> : routeOutput}
                            </ScrollView>
                        </View>
                    </View>
                </SafeAreaView>
            </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
    },
    welcomeSection: {
        justifyContent: "center",
        alignItems: "center",
        flex: 0.2,
        width: "100%",
        borderBottomWidth: 2,
    },
    loginText: {
        marginTop: 15,
        ...Typography.header.large,
    },
    buttonContainer: {
        alignItems: "center",
        width: "40%",
    },
    walkButton: {
        width: "40%",
    },
    createdSection: {
        flex: 0.8,
        width: "100%",
        alignItems: "center",
    },
    createdRoutes: {
        width: "100%",
        padding: 5
    },
    header: {
        marginTop: 10,
        ...Typography.header.large,
        alignItems: "center",
    },
    body: {
        ...Typography.body.medium,
        textAlign: 'center',
    },
    break: {
        width: "90%",
        marginLeft: "5%",
        borderBottomWidth: 1,
    },
    noRoutes: {
        marginTop: 100,
    }
});

export default Home;
