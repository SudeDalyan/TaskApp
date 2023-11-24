import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductList from './ProductList'; // Your first screen
import ProductScreen from './ProductScreen'; // Your second screen

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="ProductList"
          component={ProductList}
          options={{ title: 'ProductList' }}
        />
        <Stack.Screen
          name="ProductScreen"
          component={ProductScreen}
          options={{ title: 'ProductScreen' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
