import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import RNMapView, { Circle, Marker } from 'react-native-maps';

export const customMapStyle = [
    {
      "featureType": "poi.business",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    }
  ]

const MapView = ({ location, coords }) => {
    const mapRef = useRef(null);

    //Pass in current location and a series of coords

    useEffect(() => {
        console.log(location)
        if (!!location && mapRef.current) {
            mapRef.current.animateCamera({
                center: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                },
                pitch: 0,
                heading: 0,
                altitude: 1000,
                zoom: 18,
            });
        }
    }, [location]);

    return (
        <View style={styles.container}>
            <RNMapView
                ref={mapRef}
                initialCamera={{
                    altitude: 15000,
                    center: {
                        latitude: location.latitude,
                        longitude: location.longitude,
                    },
                    heading: 0,
                    pitch: 0,
                    zoom: 11,
                }}
                loadingEnabled={true}
                loadingBackgroundColor="white"
                style={styles.map}
                rotateEnabled={false}
                showsPointsOfInterest={false}
                customMapStyle = {customMapStyle}
            >
                <Marker
                    anchor={{ x: 0.5, y: 0.6 }}
                    key={1}
                    coordinate={{
                        latitude: location.latitude,
                        longitude: location.longitude
                    }}
                    flat
                // style={{
                //     ...(location.heading !== -1 && {
                //         transform: [
                //             {
                //                 rotate: `${location.heading}deg`,
                //             },
                //         ],
                //     }),
                // }}
                >
                    <View style={styles.dotContainer}>
                        {/* <View style={styles.arrow} /> */}
                        <View style={styles.dot} />
                    </View>
                </Marker>
                {/* Accuracy circle around users location */}
                <Circle
                    center={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                    }}
                    radius={location.accuracy}
                    strokeColor="rgba(0, 150, 255, 0.25)"
                    fillColor="rgba(0, 150, 255, 0.25)"
                />
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



// {!!location && (
//     <>
//         <Marker
//             key={1}
//             anchor={{ x: 0.5, y: 0.6 }}
//             coordinate={{
//                 latitude: location.latitude,
//                 longitude: location.latitude
//             }}
//             flat
//         style={{
//             ...(location.heading !== -1 && {
//                 transform: [
//                     {
//                         rotate: `${location.heading}deg`,
//                     },
//                 ],
//             }),
//         }}
//         >
//             <View style={styles.dotContainer}>
//                 <View style={styles.arrow} />
//                 <View style={styles.dot} />
//             </View>
//         </Marker>
//         {/* Accuracy circle around current user */}
//         <Circle
//             center={{
//                 latitude: location.latitude,
//                 longitude: location.longitude,
//             }}
//             radius={location.accuracy}
//             strokeColor="rgba(0, 150, 255, 0.25)"
//             fillColor="rgba(0, 150, 255, 0.25)"
//         />
//     </>
// )}