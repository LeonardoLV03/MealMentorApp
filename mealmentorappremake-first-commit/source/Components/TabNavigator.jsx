import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'; // Importa la librería de íconos
import { Home } from './Home';
import { Recipes } from './Recipe';
import { Plan } from './Plan';

const Tab = createBottomTabNavigator();

export function Tabs({ route }) {
  const data = route.params;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Inicio') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Recetas') {
            iconName = focused ? 'fast-food' : 'fast-food-outline';
          } else if (route.name === 'Plan') {
            iconName = focused ? 'list' : 'list-outline';
          }


          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#D3A357', 
        tabBarInactiveTintColor: 'gray', 
        tabBarStyle: {
          backgroundColor: '#1c1c1e', 
          borderTopColor: 'transparent',
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
        },
        headerShown: false, 
      })}
    >
      <Tab.Screen 
        name="Inicio" 
        component={Home} 
        initialParams={data} 
      />
      <Tab.Screen 
        name="Recetas" 
        component={Recipes} 
      />
      <Tab.Screen 
        name="Plan" 
        component={Plan} 
        initialParams={data} 
      />
    </Tab.Navigator>
  );
}
