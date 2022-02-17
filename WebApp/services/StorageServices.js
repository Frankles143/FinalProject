import AsyncStorage from '@react-native-async-storage/async-storage';

export const retrieveUser = async () => {
    try {
        return AsyncStorage.getItem("User")
            .then((value) => {
                if (value !== null) {
                    var JsonValue = JSON.parse(value);
                    return JsonValue;
                }
            })
    } catch (e) {
        // error reading value
        console.log(e);
        return false;
    }
}