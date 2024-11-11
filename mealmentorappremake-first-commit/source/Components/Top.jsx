import Constants from 'expo-constants';
import { Button, TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export function Top({ page }) {
    const navigation = useNavigation();
    const handleLogout = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }], // Cambia 'home' al nombre real de tu pantalla de Login
          });
}

    return (
        <View style={styles.Top}>
            <Image 
                source={require('../../assets/MealMentorLogo.png')}
                style={styles.Image}
                alt='Logo-MealMentor'
            />
            <Text style={styles.title}>
                ealMentor
            </Text>
            <Button 
                title='Cerrar sesion'
                onPress={handleLogout}
                color="#D3A357"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    Top: {
        marginTop: Constants.statusBarHeight, 
        borderBottomWidth: 2,
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderBottomStartRadius: 10,
        borderBottomEndRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5, 
        backgroundColor: '#0000',
        
    },
    buttonContainer: {
        margin: 20,
        borderRadius: 10,
        overflow: 'hidden',
      },
    Image: {
        height: 45, 
        width: 43,
        marginRight: 8,
    },
    title: {
        textAlign: 'center',
        fontSize: 24, 
        color: '#D3A357',
        fontWeight: 'bold',
    },
});
