import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { Top } from './Top';
import { collection, getDocs } from 'firebase/firestore';
import { dataBase } from '../Database/Firebase';

export function Home({ route }) {
    const dt = route.params || {};  
    const [tips, setTips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchTips = async () => {
            console.log("Fetching tips from Firestore...");  
            try {
                const querySnapshot = await getDocs(collection(dataBase, 'Tip'));
                console.log('Firestore response:', querySnapshot);  

                if (querySnapshot.empty) {
                    console.warn('No tips found in Firestore');  
                }

                const tipsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                console.log('Mapped tips data:', tipsData);  

                setTips(tipsData);
                setLoading(false);
            } catch (e) {
                console.error('Error fetching tips:', e);  
                setError(true);
                setLoading(false);
            }
        };

        fetchTips();
    }, []);

    const renderTip = ({ item }) => (
        <View style={styles.tipItem}>
            <Text style={styles.titleTip}>{item.Title || 'Título del Tip'}</Text>
            <Text style={styles.contentTip}>{item.Content || 'Contenido del tip'}</Text>
        </View>
    );

    if (loading) {
        console.log('Loading tips...');  
        return <Text style={styles.loadingText}>Cargando...</Text>;
    }

    if (error) {
        console.log('Error state triggered'); 
        return <Text style={styles.errorText}>Error al cargar los tips. Intenta nuevamente más tarde.</Text>;
    }

    console.log('Rendering tips:', tips);  

    return (
        <SafeAreaView style={styles.area}>
            <Top page={'Inicio'} />
            <View style={styles.Circles}>
                <View style={styles.ViewText}>
                    <Text style={styles.GreetingText}>
                        {dt.Name || 'Usuario'}, ¿Listo para iniciar? {}
                    </Text>
                </View>
            </View>
            <FlatList
                data={tips}
                renderItem={renderTip}
                keyExtractor={item => item.id}
                style={styles.tipList}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: '#000',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    Circles: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    GreetingText: {
        color: '#FFF',
        textAlign: 'center',
        fontSize: 24,
        fontWeight: '600',
        marginVertical: 20,
        textShadowColor: '#000',
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 3,
    },
    tipList: {
        marginTop: 20,
    },
    tipItem: {
        marginBottom: 20,
        backgroundColor: '#333',
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 4.65,
        elevation: 8,
    },
    titleTip: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#D3A357',
        textAlign: 'center',
        marginBottom: 10,
    },
    contentTip: {
        fontSize: 18,
        color: '#FFF',
        textAlign: 'center',
    },
    loadingText: {
        marginTop: 50,
        textAlign: 'center',
        fontSize: 24,
        color: '#FFFFFF',
    },
    errorText: {
        marginTop: 50,
        textAlign: 'center',
        fontSize: 20,
        color: 'red',
    },
});
