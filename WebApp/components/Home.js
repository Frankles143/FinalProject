import React, { useEffect } from 'react';
import { Button, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from './misc/Loading';

const Home = ({ navigation }) => {
    // debugger;
    const [isLoading, setIsLoading] = React.useState(true);
    const [user, setUser] = React.useState();

    useEffect(() => {
        try {
            AsyncStorage.getItem("User")
                .then((value) => {
                    if (value !== null) {
                        var JsonValue = JSON.parse(value);
                        setUser(JsonValue);
                        // console.log(JsonValue);
                        setIsLoading(false);
                    }
                })
        } catch (e) {
            // error reading value
            console.log(e);
        }
    }, []);

    return (
        isLoading ?
            <Loading />
            :
            <>
                <SafeAreaView>
                    <ScrollView
                        contentInsetAdjustmentBehavior="automatic">
                        <View style={styles.mainView} >
                            <Text style={styles.loginText}>Welcome home, {user.firstName} {user.lastName}</Text>
                            <Text style={styles.loginText}>Your unique user ID is {user.id}</Text>
                            <Text style={styles.loginText}>Your username is: {user.username}</Text>
                            <Text></Text>
                            <Button title="Go to location test" onPress={() => navigation.navigate("Walks")} />
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </>
    );
};

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
    mainView: {
        justifyContent: 'center',
        alignItems: "center"
    },
    loginText: {
        textAlign: "center",
        marginTop: 15,
        fontSize: 15,
    },
    input: {
        width: '60%',
        marginTop: 20,
        borderStyle: "solid",
        borderColor: "black",
        borderWidth: 2
    },
    submit: {
        width: "40%",
        marginTop: 15,
    },
});

export default Home;
