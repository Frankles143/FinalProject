import React, { useEffect } from 'react';
import { Node } from 'react';
import Toast from 'react-native-simple-toast';
import { Button, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, Platform, PermissionsAndroid, useColorScheme, View, Linking } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';

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


const Location = ({ navigation }) => {
    // debugger;
    const [isLoading, setIsLoading] = React.useState(true);
    const [user, setUser] = React.useState();
    const [location, setLocation] = React.useState(null);
    const [latitude, setLatitude] = React.useState("");
    const [longitude, setLongitude] = React.useState("");

    const hasLocationPermission = async () => {

        if (Platform.OS === 'android' && Platform.Version < 23) {
            return true;
        }

        const hasPermission = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (hasPermission) {
            return true;
        }

        const status = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (status === PermissionsAndroid.RESULTS.GRANTED) {
            return true;
        }

        if (status === PermissionsAndroid.RESULTS.DENIED) {
            ToastAndroid.show(
                'Location permission denied by user.',
                ToastAndroid.LONG,
            );
        } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            ToastAndroid.show(
                'Location permission revoked by user.',
                ToastAndroid.LONG,
            );
        }

        return false;
    };

    const getLocation = async () => {
        const hasPermission = await hasLocationPermission();

        if (!hasPermission) {
            return;
        }

        Geolocation.getCurrentPosition(
            (position) => {
                setLocation(position);
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
                console.log(position);
                Toast.show("Location retrieved")
            },
            (error) => {
                Alert.alert(`Code ${error.code}`, error.message);
                setLocation(null);
                setLatitude("");
                setLongitude("");
                console.log(error);
            },
            {
                accuracy: {
                    android: 'high',
                    ios: 'best',
                },
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 10000,
                distanceFilter: 0,
                forceRequestLocation: true,
                forceLocationManager: false,
                showLocationDialog: true,
            },
        );
    };

    useEffect(() => {
        // try {
        //     AsyncStorage.getItem("User")
        //         .then((value) => {
        //             if (value !== null) {
        //                 var JsonValue = JSON.parse(value);
        //                 setUser(JsonValue);
        //                 setIsLoading(false);


        //             }
        //         })
        // } catch (e) {
        //     // error reading value
        //     console.log(e);
        // }

        setIsLoading(false);


    }, []);

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

                        <View style={styles.buttonContainer}>
                            <Button title="Get Location" onPress={getLocation} />
                            <Text>{latitude}</Text>
                            <Text>{longitude}</Text>
                            <Text></Text>
                            <Button title="Open Maps" onPress={() => Linking.openURL(`https://www.google.com/maps/search/${latitude},+${longitude}/@${latitude},${longitude}z`)}/>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
    );
};


export default Location;
