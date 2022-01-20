import React from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';

const WalkCallout = ({ walk }) => {

    return (
        <View>
            <Text>{walk.walkName}</Text>
        </View>
    )
};

export default WalkCallout;