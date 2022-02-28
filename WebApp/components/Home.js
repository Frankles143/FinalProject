import AsyncStorage from '@react-native-async-storage/async-storage';
import { HeaderBackButton } from '@react-navigation/elements';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Alert, AppState, BackHandler, Button, SafeAreaView, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { checkPermissions, getPermissions } from '../services/LocationServices';
import { refreshUser, retrieveToken, retrieveUser } from '../services/StorageServices';
import { Colours, Typography } from '../styles';
import Loading from './misc/Loading';

const Home = ({ navigation, route }) => {
    // debugger;
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [userRoutes, setUserRoutes] = useState(null);
    const [routeOutput, setRouteOutput] = useState(null);
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        checkPermissions().then((permission) => {
            if (!permission) {
                permissionsTutorial();
            }
        });

        retrieveUser().then((user) => {
            getUserRoutes(user);
        });
    }, [refresh, route?.params?.refresh]);

    //Returning true here tells react navigation not to pop a screen as well as doing the function
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                confirmLogout();

                return true;
            };
            BackHandler.addEventListener("hardwareBackPress", onBackPress);

            return () =>
                BackHandler.removeEventListener("hardwareBackPress", onBackPress);
        }, [])
    );

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (<HeaderBackButton style={{ marginLeft: 0 }} onPress={() => confirmLogout()} />),
        });

    }, [navigation]);

    const confirmLogout = () => {
        Alert.alert(
            "Logout?",
            "Are you sure you would like to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { text: "Confirm", onPress: () => handleLogout() }
            ],
            {
                cancelable: true,
            }
        );
    }

    const handleLogout = () => {
        AsyncStorage.clear();
        navigation.goBack();
    }

    const permissionsTutorial = async () => {
        Alert.alert(
            "Location permissions required",
            `Dog Walk Nation requires access to your location to get the most out of the application!
To be able to create Routes effectively please check "Allow all the time", and turn OFF battery optimisation.
This allows you to be able to lock your phone and not have it out the whole time you are creating your route.`,
            [{ text: "Confirm", onPress: () => getPermissions() }]
        );

    }

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
            setRouteOutput(null);
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
                        <TouchableOpacity style={styles.deleteRoute} onPress={() => confirmDeleteRoute(route)}><Text style={styles.deleteRouteText}>X</Text></TouchableOpacity>
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

        //Newest routes at the top
        routeOuts.reverse();

        setRouteOutput(routeOuts);
        setUserRoutes(routes);
        setCurrentUser(user);
        setIsLoading(false);
    }

    const confirmDeleteRoute = (route) => {
        Alert.alert(
            "Delete your route?",
            "Are you sure you would you like to delete this route?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { text: "Confirm", onPress: () => handleDeleteRoute(route) }
            ],
            {
                cancelable: true,
            }
        );
    }

    const handleDeleteRoute = (route) => {
        setIsLoading(true);

        retrieveToken().then((token) => {

            // After confirmation dialog then delete from db
            fetch(`https://dogwalknationapi.azurewebsites.net/Route/deleteRoute?routeId=${route.id}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => response.json())
                .then((data) => {

                    if (data.success === true) {
                        updateWalkRemoveRoute(route);
                    } else {
                        Toast.show("Could not delete route")
                        setIsLoading(false);
                    }
                })
                .catch((error) => {
                    console.error(error)
                    setIsLoading(false);
                });
        })
    }

    const updateWalkRemoveRoute = (route) => {
        //Update walk with new route IDs

        //Get walk first
        fetch(`https://dogwalknationapi.azurewebsites.net/Walk/${route.walkId}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then((response) => response.json())
            .then((walk) => {
                let updatedWalk = walk;
                let currentRoutes = walk.walkRoutes;

                //Filter out all but route we're removing
                if (currentRoutes.length === 1) {
                    currentRoutes = null;
                } else {
                    currentRoutes = currentRoutes.filter((singleRoute) => { return singleRoute !== route.id })
                }

                updatedWalk = {
                    ...updatedWalk,
                    walkRoutes: currentRoutes
                }

                fetch('https://dogwalknationapi.azurewebsites.net/Walk/updateWalk', {
                    method: 'PUT',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(
                        updatedWalk
                    )
                })
                    .then(() => {
                        updateUserRemoveRoute(route)
                    })
                    .catch((error) => console.error(error))

            })
            .catch((error) => console.error(error))
    }

    const updateUserRemoveRoute = (route) => {
        //Update user to remove route id
        retrieveUser().then((user) => {
            retrieveToken().then((token) => {
                let updatedUser = user;
                let currentRoutes = user.createdRoutes;

                //If there is only one created route then we are removing it now, so set to null
                //Else we filter out the route we're removing
                if (currentRoutes.length === 1) {
                    currentRoutes = null;
                } else {
                    currentRoutes = currentRoutes.filter((singleRoute) => { return singleRoute !== route.id })
                }

                //Change only the created routes
                updatedUser = {
                    ...updatedUser,
                    createdRoutes: currentRoutes
                };

                //Pass in the updated user object to replace what is currently in the db
                fetch('https://dogwalknationapi.azurewebsites.net/User/updateUser', {
                    method: 'PUT',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(
                        updatedUser
                    )
                })
                    .then((data) => {
                        refreshUser().then((user) => {
                            getUserRoutes(user);
                            setIsLoading(false);
                            setRefresh(refresh + 1);
                        })
                    })
                    .catch((error) => console.error(error))
            })
        })
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
    deleteRoute: {
        zIndex: 999,
        position: "absolute",
        right: 15,
        top: 15,
        height: 25,
        width: 25,
    },
    deleteRouteText: {
        textAlign: "center",
        ...Typography.header.medium,
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
