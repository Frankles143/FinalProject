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
        console.error(e);
        return false;
    }
}

export const retrieveToken = async () => {
    try {
        return AsyncStorage.getItem("Token")
            .then((value) => {
                if (value !== null) {
                    var JsonValue = JSON.parse(value);
                    return JsonValue;
                }
            })
    } catch (e) {
        // error reading value
        console.error(e);
        return false;
    }
}

//Gets the current user and then refreshes the currently stored user with a fresh one from the db - also returns the object if needed
export const refreshUser = async () => {
    return retrieveUser().then((user) => {
        return retrieveToken().then((token) => {
            return fetch(`https://dogwalknationapi.azurewebsites.net/User/${user.id}/${user.username}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    const userString = JSON.stringify(data);
                    return AsyncStorage.setItem('User', userString).then(() => {
                        return data;
                    })
                })
                .catch((error) => {
                    console.error(error)
                    return;
                });
        })
    })
}