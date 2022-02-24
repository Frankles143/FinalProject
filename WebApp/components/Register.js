import React, { useEffect, useRef, useState } from 'react';
import { Button, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from './misc/Loading';
import { Colours, Spacing, Typography } from '../styles';

import Logo from '../images/DWNLogo.png';
import { retrieveUser } from '../services/StorageServices';


const Register = ({ navigation }) => {
    // debugger;
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    useEffect(() => {
        
    }, []);

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
                                const tokenString = JSON.stringify(json.token);

                                //Store user and token items for use later on
                                AsyncStorage.setItem('User', userString)
                                    .then(() => {
                                        AsyncStorage.setItem('Token', tokenString).then(() => {
                                            setIsLoading(false);
                                            //Clear password everytime the user does anything for security
                                            setPassword("");
                                            navigation.navigate("Home");
                                        })
                                    })
                            } catch (e) {
                                // saving error
                                console.log(e)
                                setIsLoading(false);
                                setPassword("");
                            }
                        } else {
                            //Response from API
                            Toast.show(json.message);
                            setIsLoading(false);
                            setPassword("");
                        }
                    } else {
                        Toast.show("Please enter a valid email address")
                        setIsLoading(false);
                        setPassword("");
                    }
                })
                .catch((error) => {
                    console.error(error);
                    setIsLoading(false);
                    setPassword("");
                })
        } else {
            Toast.show("Please enter a username and password!")
        }
    }

    const registerUser = () => {
        Toast.show("yahaahaaaaaaa")
    }

    const refInputEmail = useRef();
    const refInputFirstName = useRef();
    const refInputLastName = useRef();
    const refInputPassword = useRef();
    const refInputConfirmPassword = useRef();

    return (
        isLoading ?
            <Loading />
            :
            <SafeAreaView>
                <ScrollView keyboardShouldPersistTaps="always" contentInsetAdjustmentBehavior="automatic">
                    <View style={styles.mainView} >
                        <View style={styles.inputSection}>
                            <Text style={styles.loginText}>Please enter your details to create an account!</Text>
                            {/* username, email, first name, last name, password, confirm password */}
                            <Text style={styles.inputText}>Username:</Text>
                            <TextInput
                                value={username}
                                style={styles.input}
                                onChangeText={setUsername}
                                returnKeyType="next"
                                onSubmitEditing={() => refInputEmail.current.focus()}
                                blurOnSubmit={false}
                                placeholder="Username"
                            />
                            <Text style={styles.inputText}>Email Address:</Text>
                            <TextInput
                                value={email}
                                style={styles.input}
                                onChangeText={setEmail}
                                ref={refInputEmail}
                                returnKeyType="next"
                                onSubmitEditing={() => refInputFirstName.current.focus()}
                                blurOnSubmit={false}
                                placeholder="Email Address"
                            />
                            <Text style={styles.inputText}>First Name:</Text>
                            <TextInput
                                value={firstName}
                                style={styles.input}
                                onChangeText={setFirstName}
                                ref={refInputFirstName}
                                returnKeyType="next"
                                onSubmitEditing={() => refInputLastName.current.focus()}
                                blurOnSubmit={false}
                                placeholder="First Name"
                            />
                            <Text style={styles.inputText}>Last Name:</Text>
                            <TextInput
                                value={lastName}
                                style={styles.input}
                                onChangeText={setLastName}
                                ref={refInputLastName}
                                returnKeyType="next"
                                onSubmitEditing={() => refInputPassword.current.focus()}
                                blurOnSubmit={false}
                                placeholder="Last Name"
                            />
                            <Text style={styles.inputText}>Password:</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={setPassword}
                                ref={refInputPassword}
                                returnKeyType="next"
                                onSubmitEditing={() => refInputConfirmPassword.current.focus()}
                                placeholder="Password"
                                blurOnSubmit={false}
                                secureTextEntry={true}
                            />
                            <Text style={styles.inputText}>Confirm Password:</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={setPassword}
                                ref={refInputConfirmPassword}
                                onSubmitEditing={() => registerUser()}
                                placeholder="Confirm Password"
                                secureTextEntry={true}
                            />
                            <View styles={styles.submit}>
                                <Text></Text>
                                <Button title="Create Account" onPress={() => registerUser()} color={Colours.primary.base} />
                            </View>
                        </View>

                    </View>
                </ScrollView>
            </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        flexDirection: "column",
    },
    inputSection: {
        flex: 1,
        width: "100%",
        alignItems: "center",
    },
    loginText: {
        marginTop: 15,
        fontSize: 15,
        // color: Colours.neutral.grey1,
    },
    inputText: {
        marginLeft: "20%",
        marginTop: 15,
        alignSelf: "flex-start",
        ...Typography.body.small,
    },
    input: {
        width: '60%',
        // marginTop: 20,
        borderStyle: "solid",
        borderColor: "black",
        // borderColor: Colours.neutral.grey3,
        borderWidth: 1.5,
        // color: Colours.neutral.grey1,
    },
    submit: {
        width: "100%",
        paddingTop: 25,
    },
});

export default Register;
