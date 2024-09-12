import { View, Text, FlatList, StyleSheet } from "react-native";
import { Top } from "./Top";

import { useDoc } from '../Hooks/useDoc'
import { useState } from "react";
import { dataBase} from '../Database/Firebase'

export function Plan({route}){
    const [loading, setLoading] = useState(true)
    const customer = route.params;

    const {data} = useDoc(dataBase, 'Plan', customer.plan_ID, setLoading);

    return(
        <View style={{flex: 1}}>
            {loading ? <Text style={{marginTop:50,textAlign: 'center', alignSelf: 'center', justifyContent: 'center', fontSize: 48}}>No existe Plan...</Text> :
            <>
            <Top page={'Plan'}/>
            <View style={{flex: 1}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-evenly', padding: 8}}>
                    <View style={styles.TopText}>
                    <Text style={{fontWeight: 'bold'}}>Calorias por dia:</Text>
                    <Text>{data.Calories}</Text>
                    </View>
                    <View style={styles.TopText}>
                    <Text style={{fontWeight: 'bold'}}>Objetivo:</Text>
                    <Text>{customer.Goal}</Text>
                    </View>
                    <View style={styles.TopText}>
                    <Text style={{fontWeight: 'bold'}}>Inicio:</Text>
                    <Text>{data.startDate}</Text>
                    </View>
                </View>
                <View style={{flex: 1}}>
                    <FlatList
                    data={data.content}
                    renderItem={({ item, index }) => (
                        <Item data={item} day={getDayOfWeek(index)}/>
                    )}
                    keyExtractor={(index) => index}

                    />
                </View>
            </View>
            </>}
        </View>
    );
}

const Item = ({ data, day }) => (
    <View style={{padding:10}}>
            <Text style={{fontSize: 32, fontWeight: 'bold', margin:0, padding:0}}>{day}</Text>
            <View style={styles.containerPlan}>
                <Text style={styles.content}>{data}</Text>
            </View>
    </View>
);

const getDayOfWeek = (index) => {
    const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    return daysOfWeek[index];
};

const styles = StyleSheet.create({
    TopText:{
        alignItems: 'center'
    },
    containerPlan:{
        borderWidth: 2,
        borderRadius: 8,
        borderColor: "#01273C",
        backgroundColor: "#fff",
        padding: 8
    },
    content:{
        fontSize: 20
    }
})