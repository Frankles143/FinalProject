import React, { useEffect } from 'react';
import { Node } from 'react';
import { Button, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

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


const Section = ({ children, title }) => {
    const isDarkMode = useColorScheme() === 'dark';
    return (
        <View style={styles.sectionContainer}>
            <Text
                style={[
                    styles.sectionTitle,
                    {
                        color: isDarkMode ? Colors.white : Colors.black,
                    },
                ]}>
                {title}
            </Text>
            <Text
                style={[
                    styles.sectionDescription,
                    {
                        color: isDarkMode ? Colors.light : Colors.dark,
                    },
                ]}>
                {children}
            </Text>
        </View>
    );
};


const Home = ({ navigation }) => {
    // debugger;
    const [isLoading, setIsLoading] = React.useState(true);
    const [user, setUser] = React.useState();

    useEffect(() => {
        try {
            AsyncStorage.getItem("User")
            .then((value) => {
                if(value !== null) {
                    var JsonValue = JSON.parse(value);
                    setUser(JsonValue);
                    // console.log(JsonValue);
                    setIsLoading(false);
                  }
            })
          } catch(e) {
            // error reading value
            console.log(e);
          }
    }, [] );

    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };


    return (
        isLoading ?
        <Text></Text>
        :
        <SafeAreaView style={backgroundStyle}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={backgroundStyle}>
                <View style={styles.mainView} >
                    <Text style={styles.loginText}>Welcome home, {user.firstName} {user.lastName}</Text>
                    <Text style={styles.loginText}>Your unique user ID is {user.userId}</Text>
                    <Text style={styles.loginText}>Your username is: {user.username}</Text>
                    <Text></Text>
                    <Button title="Go to location test" onPress={() => navigation.navigate("Location")} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};


export default Home;
