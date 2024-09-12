import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home } from "./Home";
import { Recipes } from './Recipe';
import { Plan } from './Plan';


export function Tabs({ route }){
  const data  = route.params;
    const Tab = createBottomTabNavigator();
    return (
    <Tab.Navigator>
        <Tab.Screen 
        name="Inicio" 
        component={Home}
        initialParams={data}
        options={{ headerShown: false }}/>
        <Tab.Screen 
        name="Recetas" 
        component={Recipes} 
        options={{ headerShown: false }}/>
        <Tab.Screen 
        name="Plan" 
        component={Plan}
        initialParams={data}
        options={{ headerShown: false }}/>
      </Tab.Navigator>
    );
}