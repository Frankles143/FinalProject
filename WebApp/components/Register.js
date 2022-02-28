import React, { useEffect, useRef, useState } from 'react';
import { Button, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Toast from 'react-native-simple-toast';

import Loading from './misc/Loading';
import { Colours, Typography } from '../styles';



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

    const registerUser = () => {
        if (username !== "" && email !== "" && firstName !== "" && lastName !== "" && password !== "" && passwordConfirm !== "") {
            if (password === passwordConfirm) {
                setIsLoading(true);

                //Create newUser object
                let newUser = {
                    username: username,
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    password: password
                }

                //Send to API
                fetch('https://dogwalknationapi.azurewebsites.net/user/register', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(
                        newUser
                    )
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if(data.status !== 400) {
                            if(data.success == true) {
                                Toast.show("Register successful!");
                                setIsLoading(false);
                                navigation.goBack();
                            }
                        } else {
                            //Response from API
                            Toast.show(data.message);
                            setIsLoading(false);
                        }
                    })
                    .catch((error) => {
                        console.error(error)
                    })

            } else {
                Toast.show("Passwords don't match!");
            }
        } else {
            Toast.show("Please fill in all fields!");
        }
    };

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
                                onChangeText={setPasswordConfirm}
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
    },
    inputText: {
        marginLeft: "20%",
        marginTop: 15,
        alignSelf: "flex-start",
        ...Typography.body.small,
    },
    input: {
        width: '60%',
        borderStyle: "solid",
        borderColor: "black",
        borderWidth: 1.5,
    },
    submit: {
        width: "100%",
        paddingTop: 25,
    },
});

export default Register;
