import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './components/Login';
import Home from './components/Home';
import Walks from './components/Walks/Walks';
import WalkDetails from './components/Walks/WalkDetails';
import NewWalk from './components/Walks/NewWalk';
import Routes from './components/Routes/Routes';
import NewRoute from './components/Routes/NewRoute';

const Stack = createNativeStackNavigator();

const App = () => {
    // debugger;

    return (
        <NavigationContainer>
            <Stack.Navigator> 
                <Stack.Screen name="Login" component={Login} options={{headerShown: false}} />
                <Stack.Screen name="Home" component={Home} options={{title: "Overview"}} />
                <Stack.Screen name="Walks" component={Walks} />
                <Stack.Screen name="New Walk" component={NewWalk} />
                <Stack.Screen name="Walk Details" component={WalkDetails} options={({navigation, route}) => ({title: route.params.name})}/>
                <Stack.Screen name="Routes" component={Routes} />
                <Stack.Screen name="New Route" component={NewRoute}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;

{/* initialRouteName="Login" */}