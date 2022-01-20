import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './components/Login';
import Home from './components/Home';
import Walks from './components/Walks/Walks';
import Routes from './components/Routes/Routes';

const Stack = createNativeStackNavigator();

const App = () => {
    // debugger;

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {/* <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Home" component={Home} options={{title: "Overview"}} /> */}
                <Stack.Screen name="Walks" component={Walks} />
                {/* <Stack.Screen name="Route" component={Routes} /> */}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
