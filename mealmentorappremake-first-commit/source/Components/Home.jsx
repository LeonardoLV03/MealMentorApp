import React from 'react';
import { Top } from "./Top";
import { 
    View, 
    SafeAreaView,
    StyleSheet,
    Dimensions,
    Text,
    ScrollView
    } from "react-native";

export function Home({route}){
    const data = route.params;
    return(
        <SafeAreaView>
            <Top page={'Inicio'}/>
            <View style={styles.Circles}>
                <View style={[styles.CircleGold, styles.CircleOverlapGold, styles.BoxShadow]}></View>
                <View style={[styles.CircleBlue, styles.CircleOverlapBlue, styles.BoxShadow]}></View>
                <View style={styles.ViewText}>
                    <Text style={{
                        color: '#FFFFFF', 
                        textAlign:'center', 
                        fontSize: 26,
                        textShadowColor: '#000000',
                        textShadowOffset: { width: 1, height: 3 },
                        textShadowRadius: 3,}}>
                        !Hola¡{'\n'}{data.Name}{'\n'}¿Listo para inicar?
                    </Text>
                </View>
            </View>
            <View style={styles.TipBox}>
                <ScrollView>
                <Text style={styles.TitleTip}>Titulo del Tip #</Text>
                <Text style={styles.ContentTip}>Contenido del Tip</Text>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    Circles:{
        alignSelf: 'center',
        flexDirection: 'row',
        marginTop: 15,
        flex: 1,
    }, 
    CircleGold:{
        height: Dimensions.get('window').height * 0.22,
        width: Dimensions.get('window').height * 0.22,
        borderRadius: Math.round((Dimensions.get('window').height + Dimensions.get('window').width) / 2),
        backgroundColor: '#D3A357',
        shadowColor: "black",
        shadowOffset: {
          width: 6,
          height: 6,
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 16,
    },
    CircleBlue:{
        height: Dimensions.get('window').height * 0.22,
        width: Dimensions.get('window').height * 0.22,
        borderRadius: Math.round((Dimensions.get('window').height + Dimensions.get('window').width) / 2),
        backgroundColor: '#01273C',

    },
    BoxShadow:{
        shadowColor: "black",
        shadowOffset: {
          width: 6,
          height: 6,
        },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 20,        
    },
    CircleOverlapBlue: {
        position: 'absolute',
        left: -Dimensions.get('window').height * 0.045,
    },
    CircleOverlapGold:{
        position: 'absolute',
        right: -Dimensions.get('window').height * 0.045,
    },
    ViewText:{
        position: 'absolute',
        bottom: -Dimensions.get('window').height * 0.16,
        right: -Dimensions.get('window').height * 0.13
    },
    TipBox: {
        alignSelf: 'center',
        height: 400,
        width: 313,
        borderWidth: 2,
        borderRadius: 8,
        marginTop: Dimensions.get('window').height*0.25
    },
    TitleTip: {
        color: '#D3A357',
        textAlign: 'center',
        fontSize: 32,
        fontWeight: 'bold'
    },
    ContentTip:{
        textAlign: 'center',
        fontSize: 20
    }
})
