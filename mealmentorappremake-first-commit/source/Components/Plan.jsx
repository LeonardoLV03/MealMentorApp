import { View, Text, FlatList, StyleSheet } from "react-native";
import { Top } from "./Top";
import { useDoc } from '../Hooks/useDoc';
import { useState } from "react";
import { dataBase } from '../Database/Firebase';

export function Plan({ route }) {
    const [loading, setLoading] = useState(true);
    const customer = route.params;

    const { data } = useDoc(dataBase, 'Plan', customer.plan_ID, setLoading);

    return (
        <View style={styles.container}>
            {loading ? (
                <Text style={styles.loadingText}>No existe Plan...</Text>
            ) : (
                <>
                    <Top page={'Plan'} />
                    <View style={styles.infoContainer}>
                        <View style={styles.TopText}>
                            <Text style={styles.boldText}>Calorías por día:</Text>
                            <Text style={styles.normalText}>{data.Calories}</Text>
                        </View>
                        <View style={styles.TopText}>
                            <Text style={styles.boldText}>Objetivo:</Text>
                            <Text style={styles.normalText}>{customer.Goal}</Text>
                        </View>
                        <View style={styles.TopText}>
                            <Text style={styles.boldText}>Inicio:</Text>
                            <Text style={styles.normalText}>{data.startDate}</Text>
                        </View>
                    </View>
                    <FlatList
                        data={data.content}
                        renderItem={({ item, index }) => (
                            <Item data={item} day={getDayOfWeek(index)} />
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        style={styles.list}
                    />
                </>
            )}
        </View>
    );
}

const Item = ({ data, day }) => (
    <View style={styles.itemContainer}>
        <Text style={styles.dayText}>{day}</Text>
        <View style={styles.planContainer}>
            <Text style={styles.planText}>{data}</Text>
        </View>
    </View>
);

const getDayOfWeek = (index) => {
    const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    return daysOfWeek[index];
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    loadingText: {
        marginTop: 50,
        textAlign: 'center',
        fontSize: 48,
        color: '#fff',
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        padding: 8,
        marginBottom: 20,
    },
    TopText: {
        alignItems: 'center',
    },
    boldText: {
        fontWeight: 'bold',
        color: '#D3A357',
        fontSize: 18,
    },
    normalText: {
        color: '#FFF',
        fontSize: 16,
    },
    list: {
        marginTop: 20,
    },
    itemContainer: {
        padding: 10,
    },
    dayText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#D3A357',
    },
    planContainer: {
        borderWidth: 2,
        borderRadius: 12,
        borderColor: '#01273C',
        backgroundColor: '#333',
        padding: 15,
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 4.65,
        elevation: 8,
    },
    planText: {
        fontSize: 20,
        color: '#FFF',
    },
});
