import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Typography, Colours } from '../../styles';

const Loading = ({ }) => {


    return (
        <View style={styles.container}>
            <ActivityIndicator size={Platform.OS === 'ios' ? 'large' : 60} color={Colours.primary.light}/>
            <Text></Text>
            <Text style={styles.bodyText}>Loading...</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    bodyText: {
        ...Typography.body.large,
    }
});

export default Loading;