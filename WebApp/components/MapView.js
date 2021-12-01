import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import RNMapView, { Circle, Marker } from 'react-native-maps';

const MapView = ({ coords }) => {
    const mapRef = useRef(null);

    useEffect(() => {
        if (!!coords && mapRef.current) {
            mapRef.current.animateCamera({
                center: {
                    latitude: coords[0],
                    longitude: coords[1],
                },
                pitch: 0,
                heading: 0,
                altitude: 1000,
                zoom: 16,
            });
        }
    }, [coords]);

    return (
        <View style={styles.container}>
            <RNMapView
                ref={mapRef}
                initialCamera={{
                    altitude: 15000,
                    center: {
                        latitude: 50.3653562,
                        longitude: -4.0949318,
                    },
                    heading: 0,
                    pitch: 0,
                    zoom: 11,
                }}
                loadingEnabled
                loadingBackgroundColor="white"
                style={styles.map}
                rotateEnabled={false}
            >
                {!!coords && (
                    <>
                        <Marker
                            anchor={{ x: 0.5, y: 0.6 }}
                            coordinate={{
                                latitude: coords[0],
                                longitude: coords[1],
                            }}
                            flat
                            // style={{
                            //     ...(coords.heading !== -1 && {
                            //         transform: [
                            //             {
                            //                 rotate: `${coords.heading}deg`,
                            //             },
                            //         ],
                            //     }),
                            // }}
                        >
                            <View style={styles.dotContainer}>
                                {/* <View style={[styles.arrow]} /> */}
                                <View style={styles.dot} />
                            </View>
                        </Marker>
                        {/* <Circle
                            center={{
                                latitude: coords.latitude,
                                longitude: coords.longitude,
                            }}
                            radius={coords.accuracy}
                            strokeColor="rgba(0, 150, 255, 0.5)"
                            fillColor="rgba(0, 150, 255, 0.5)"
                        /> */}
                    </>
                )}
            </RNMapView>
        </View>
    );
};

export default MapView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
        //   ...StyleSheet.absoluteFillObject,
    },
    dotContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        backgroundColor: 'rgb(0, 120, 255)',
        width: 24,
        height: 24,
        borderWidth: 3,
        borderColor: 'white',
        borderRadius: 12,
        shadowColor: 'black',
        shadowOffset: {
            width: 1,
            height: 1,
        },
        shadowOpacity: 0.3,
        shadowRadius: 1.5,
        elevation: 4,
    },
    arrow: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderBottomWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'rgb(0, 120, 255)',
    },
});