import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Modal } from 'react-native';
import { Typography, Colours } from '../../styles';

const Calibrating = ({ isCalibrating }) => {
    const [calibrating, setCalibrating] = useState(isCalibrating)

    useEffect(() => {

        if (isCalibrating === undefined || isCalibrating === false) {
            setCalibrating(false)
        } else if (isCalibrating === true) {
            setCalibrating(true)
        }

    }, [isCalibrating])

    return (
        <Modal animationType="fade" transparent={true} visible={calibrating} onRequestClose={() => setCalibrating(false)}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>

                    <Text style={styles.modalHeader}>Calibrating...</Text>
                    <ActivityIndicator size={Platform.OS === 'ios' ? 'large' : 60} color={Colours.primary.light} />
                    <Text></Text>
                    <Text style={styles.modalText}>Please wait, calibrating location</Text>

                </View>
            </View>
        </Modal>
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
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalHeader: {
        marginBottom: 10,
        ...Typography.header.largest
    },
    modalText: {
        ...Typography.body.medium,
        textAlign: "center"
    },
});

export default Calibrating;