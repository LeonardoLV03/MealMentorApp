import Constants from 'expo-constants';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../ThemeContext';  // Importa el contexto de tema

export function Top({ page }) {
    const { toggleTheme } = useTheme();  // Obtén la función para alternar el tema entre oscuro y claro

    return (
        <View style={styles.Top}>
            <View style={styles.titleContainer}>
                <Image 
                    source={require('../../assets/MealMentorLogo.png')}
                    style={styles.Image}
                    alt='Logo-MealMentor'
                />
                <Text style={styles.title}>ealMentor</Text>
            </View>

            <View style={styles.iconsContainer}>
                <TouchableOpacity onPress={toggleTheme}>
                    <Ionicons name="moon" size={24} color="#D3A357" />
                </TouchableOpacity>
            </View>
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
        alignItems: 'center',
        paddingVertical: 5, 
        backgroundColor: '#0000',
        justifyContent: 'space-between',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    Image: {
        height: 45, 
        width: 43,
        marginRight: 8,
    },
    title: {
        fontSize: 24, 
        color: '#D3A357',
        fontWeight: 'bold',
    },
    iconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 15,
    },
});
