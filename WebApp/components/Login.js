import React from 'react';
import { Button, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from './misc/Loading';

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

const Login = ({ navigation }) => {
    // debugger;
    const [isLoading, setIsLoading] = React.useState(false);
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const CheckLoginDetails = () => {
        if (email !== "" && password !== "") {

            setIsLoading(true);

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
                                setIsLoading(false);
                            }
                        } else {
                            Toast.show(json.message);
                            setIsLoading(false);
                        }
                    } else {
                        Toast.show("Please enter a valid email address")
                        setIsLoading(false);
                    }
                })
                .catch((error) => {
                    console.error(error);
                    setIsLoading(false);
                })
        } else {
            Toast.show("Please enter a username and password!")
        }
    }

    return (
        isLoading ? 
        <Loading /> 
        :
        <SafeAreaView>
            <ScrollView contentInsetAdjustmentBehavior="automatic">
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
