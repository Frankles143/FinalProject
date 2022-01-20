import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
 
 //Function to quickly check permissions for foreground and background tasks
 export const checkPermissions = async () => {
    let foreStatus = await Location.requestForegroundPermissionsAsync();
    let backStatus = await Location.requestBackgroundPermissionsAsync();

    if (foreStatus.status != "granted") {
        Toast.show("Permission to access location was denied!");
        return false;
    }

    if (backStatus.status != "granted") {
        Toast.show("Permission to access location in the background was denied!")
        return false;
    }

    return true;
}

//Get current location
export const getLocation = async () => {

    if (!checkPermissions) {
        return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({ accuracy: 6 });
    return currentLocation;
};

//Define a task to get background updates
const BACKGROUND_LOCATION_UPDATES_TASK = 'background-location-updates'
TaskManager.defineTask(BACKGROUND_LOCATION_UPDATES_TASK, handleLocationUpdate)

//Function to handle the task data
export async function handleLocationUpdate({ data, error }) {

    if (error) {
        Toast.show("error");
        return
    }
    if (data) {
        try {
            const { locations } = data;
            const currentLocation = locations[0];

            //Sets users current position
            setLocation(currentLocation);

            //Calibration
            if (calCount < 5) {
                setIsCalibrating("Calibration in progress...");
                //Get 5 readings, unless the accuracy increases to an acceptable level first
                if (currentLocation.coords.accuracy < 8 && calCount > 1) {
                    console.log("Accuracy achieved")
                    setCalCount(5);
                } else {
                    console.log("Calibrating...")
                    setCalCount(calCount + 1);
                }
            } else {
                setIsCalibrating("");
                //Bool flag here for isRecording
                // Tweak saving algorithm here, save every other coord, check for accuracy etc.

                //Extract co-ordinates
                let geo = [currentLocation.coords.latitude, currentLocation.coords.longitude];
                setCoords(coords => [...coords, geo]);
                // console.log("Saved")
            }

        } catch (error) {
            console.log('the error', error)
        }
    }
}

//Start getting location updates
export const getLocationUpdates = async () => {
    if (!checkPermissions) {
        return;
    }

    //Initialise empty array
    if (coords == null) {
        setCoords([]);
    }

    let isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_LOCATION_UPDATES_TASK)

    if (!isRegistered) await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_UPDATES_TASK, {
        accuracy: Location.Accuracy.High,
        timeInterval: 2000,
        distanceInterval: 0,
        foregroundService: {
            notificationTitle: 'Getting location updates',
            notificationBody: 'Location updates are being used to create your new route!'
        },
        pausesUpdatesAutomatically: false,

    })
}

//Stop the task to get updates
export const stopLocationUpdates = async (isStop) => {
    let isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_LOCATION_UPDATES_TASK)
    setIsCalibrating("");

    if (isRegistered) {
        setCalCount(0);

        Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_UPDATES_TASK);

        //If stop then clean and pass through data else do nothing
        if (isStop) {
            if (coords.length > 0) {
                //send to API
                saveRoute(coords).then(() => {
                    console.log("Saved and stopped");
                })
            }
        } else {
            console.log("Paused");
        }

    }
}