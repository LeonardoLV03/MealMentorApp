import Constants from 'expo-constants';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export function Top({ page }) {
    const navigation = useNavigation();

    const handleLogout = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }], // Cambia 'Home' al nombre real de tu pantalla de Login
        });
    };

    return (
        <View style={styles.Top}>
            <Image 
                source={require('../../assets/MealMentorLogo.png')}
                style={styles.Image}
                alt='Logo-MealMentor'
            />
            <Text style={styles.title}>
                MealMentor
            </Text>
            <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
                <Ionicons name="log-out-outline" size={24} color="#D3A357" />
            </TouchableOpacity>
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
    iconButton: {
        marginLeft: 10,
    },
});
