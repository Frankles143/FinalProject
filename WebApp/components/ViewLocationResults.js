import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


const ViewLocationResults = ({ location }) => {


    return (
        !location ? <View></View> :
            <View style={styles.result}>
                <Text>Latitude: {location?.coords?.latitude || ''}</Text>
                <Text>Longitude: {location?.coords?.longitude || ''}</Text>
                <Text>Heading: {location?.coords?.heading}</Text>
                <Text>Accuracy: {location?.coords?.accuracy}</Text>
                <Text>Altitude: {location?.coords?.altitude}</Text>
                <Text>Altitude Accuracy: {location?.coords?.altitudeAccuracy}</Text>
                <Text>Speed: {location?.coords?.speed}</Text>
                <Text>
                    Timestamp:{' '}
                    {location?.timestamp
                        ? new Date(location.timestamp).toLocaleString()
                        : ''}
                </Text>
            </View>
    )
}

export default ViewLocationResults;

const styles = StyleSheet.create({
    result: {
        borderWidth: 1,
        borderColor: '#666',
        width: '100%',
        padding: 10,
    },
});