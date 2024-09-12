import Constants from 'expo-constants'
import { 
    View, 
    Text, 
    Image,
    StyleSheet,
    } from "react-native";

export function Top({page}){
    return(
        <View style={styles.Top}>
                <Image 
                source={require('../../assets/MealMentorLogo.png')}
                style={styles.Image}
                alt='Logo-MealMentor'
                />
                <Text style={{textAlign: 'center', fontSize: 32}}>ealMentor - {page}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    Top:{
        marginTop: Constants.statusBarHeight, 
        borderBottomWidth: 2,
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderBottomStartRadius: 10,
        borderBottomEndRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    Image:{
        height: 57,
        width: 55
    }
})