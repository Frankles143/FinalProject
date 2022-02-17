import React, { useEffect } from 'react';
import { Button, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { retrieveUser } from '../services/StorageServices';
import { Colours, Typography } from '../styles';
import Loading from './misc/Loading';

const Home = ({ navigation }) => {
    // debugger;
    const [isLoading, setIsLoading] = React.useState(true);
    const [user, setUser] = React.useState();

    useEffect(() => {
        retrieveUser().then((user) => {
            setUser(user);
            setIsLoading(false);
        })
    }, []);

    return (
        isLoading ?
            <Loading />
            :
            <>
                <SafeAreaView style={styles.container}>
                    <View style={styles.mainView} >
                        <View style={styles.welcomeSection}>
                            <Text style={styles.loginText}>Welcome back, {user.firstName} {user.lastName}!</Text>
                            <Text></Text>
                            <View style={styles.buttonContainer}>
                                <Button style={styles.walkButton} title="Find walks" onPress={() => navigation.navigate("Walks")} color={Colours.primary.base} />
                            </View>
                        </View>

                        <View style={styles.createdSection}>
                            <ScrollView contentInsetAdjustmentBehavior="automatic">
                                <Text style={styles.header}>Created Routes</Text>
                                
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
    header: {
        marginTop: 10,
        ...Typography.header.large,
        alignItems: "center",
    },
});

export default Home;
