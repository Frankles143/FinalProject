import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Typography } from '../../styles';

const ViewLocationResults = ({ location }) => {
    
    //This was used for debugging early on, not included in user facing code
    return (
        !location ? <View></View> :
            <View style={styles.result}>
                <Text style={styles.bodyText}>Latitude: {location?.coords?.latitude || ''}</Text>
                <Text style={styles.bodyText}>Longitude: {location?.coords?.longitude || ''}</Text>
                <Text style={styles.bodyText}>Heading: {location?.coords?.heading}</Text>
                <Text style={styles.bodyText}>Accuracy: {location?.coords?.accuracy}</Text>
                <Text style={styles.bodyText}>Altitude: {location?.coords?.altitude}</Text>
                <Text style={styles.bodyText}>Altitude Accuracy: {location?.coords?.altitudeAccuracy}</Text>
                <Text style={styles.bodyText}>Speed: {location?.coords?.speed}</Text>
                <Text style={styles.bodyText}>
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
    bodyText: {
        ...Typography.body.small,
    }
});