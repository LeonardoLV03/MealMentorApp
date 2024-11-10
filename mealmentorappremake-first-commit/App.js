import { Login } from "./source/Components/Login";
import { Tabs } from "./source/Components/TabNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ThemeProvider } from './ThemeContext';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <ThemeProvider>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="tabs"
          component={Tabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      </ThemeProvider>
    </NavigationContainer>
  );
}
