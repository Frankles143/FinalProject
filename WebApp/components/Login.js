import React from 'react';
import { Node } from 'react';
import { Button, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from 'react-native/Libraries/NewAppScreen';

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
        width: "100%",
        paddingTop: 25,
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


const Login = ({ navigation }) => {
    // debugger;
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    const CheckLoginDetails = () => {
        if (email !== "" && password !== "") {

            var loginUser = {
                email: email,
                password: password
            }

            fetch('https://dogwalknationapi.azurewebsites.net/user/login', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    loginUser
                )
            })
                .then((response) => response.json())
                .then((json) => {
                    console.log(json)
                    if (json.status !== 400) {

                        if (json.success === true) {
                            Toast.show("Login successful!");
                            try {
                                const userString = JSON.stringify(json.user);
                                AsyncStorage.setItem('User', userString)
                                    .then(() => {
                                        navigation.navigate("Home");
                                    })
                            } catch (e) {
                                // saving error
                                console.log(e)
                            }
                        } else {
                            Toast.show(json.message);
                        }
                    } else {
                        Toast.show("Please enter a valid email address")
                    }
                })
                .catch((error) => {
                    console.error(error);
                })
        } else {
            Toast.show("Please enter a username and password!")
        }
    }

    return (
        <SafeAreaView style={backgroundStyle}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={backgroundStyle}>
                <View style={styles.mainView} >
                    <Text style={styles.loginText}>Please log in with your email and password to continue</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setEmail}
                        placeholder="Email Address"
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={setPassword}
                        placeholder="Password"
                        secureTextEntry={true}
                    />
                    <View styles={styles.submit}>
                        <Text></Text>
                        <Button title="Submit" onPress={CheckLoginDetails} />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};


export default Login;
