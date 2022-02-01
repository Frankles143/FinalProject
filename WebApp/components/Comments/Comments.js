import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Typography } from '../../styles';

const Comments = ({ walk }) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

    }, [walk]);

    return (
        ""
    )
}

const styles = StyleSheet.create({
    comment: {

    },
    body: {
        ...Typography.body.small,
    }
});

export default Comments;