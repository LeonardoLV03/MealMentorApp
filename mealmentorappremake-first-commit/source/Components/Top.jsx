import Constants from 'expo-constants';
import { View, Text, Image, StyleSheet } from 'react-native';

export function Top({ page }) {
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
});
