import React, { useEffect, useCallback, useRef, useState } from 'react';
import Toast from 'react-native-simple-toast';
import { Button, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, Platform, PermissionsAndroid, useColorScheme, View, Linking, Switch } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

import MapView from './WalksMapView';
import ViewLocationResults from '../ViewLocationResults';

import { Spacing, Typography, Colours } from '../../styles';

const Walks = ({ navigation }) => {
    // debugger;
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState();
    const [location, setLocation] = useState(null);

    useEffect(() => {
        
    }, [] );


    return (
        isLoading?
        <></>
        :
        <Text></Text>

    );
};

export default Walks;