import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { Top } from './Top';
import { collection, getDocs } from 'firebase/firestore';
import { dataBase } from '../Database/Firebase';
import { useTheme } from '../../ThemeContext';  // Importa el contexto de tema claro o oscuro

export function Home({ route }) {
    const dt = route.params || {};  
    const [tips, setTips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const { isDarkTheme } = useTheme();  // Obtén el valor del tema

    useEffect(() => {
        const fetchTips = async () => {
            try {
                const querySnapshot = await getDocs(collection(dataBase, 'Tip'));
                const tipsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setTips(tipsData);
                setLoading(false);
            } catch (e) {
                setError(true);
                setLoading(false);
            }
        };

        fetchTips();
    }, []);

    const renderTip = ({ item }) => (
        <View style={[styles.tipItem, isDarkTheme ? styles.darkTipItem : styles.lightTipItem]}>
            <Text style={styles.titleTip}>{item.Title || 'Título del Tip'}</Text>
            <Text style={[styles.contentTip, { color: isDarkTheme ? '#FFF' : '#000' }]}>
                {item.Content || 'Contenido del tip'}
            </Text>
        </View>
    );

    if (loading) return <Text style={styles.loadingText}>Cargando...</Text>;
    if (error) return <Text style={styles.errorText}>Error al cargar los tips. Intenta nuevamente más tarde.</Text>;

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: isDarkTheme ? '#000' : '#FFF' }]}>
            <Top page={'Inicio'} />
            <View style={styles.Circles}>
                <Text style={[styles.GreetingText, { color: isDarkTheme ? '#FFF' : '#000' }]}>
                    {dt.Name || 'Usuario'}, ¿Listo para iniciar? 
                </Text>
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
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    Circles: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    GreetingText: {
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
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 4.65,
        elevation: 8,
    },
    darkTipItem: {
        backgroundColor: '#333',
    },
    lightTipItem: {
        backgroundColor: '#DDD',
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
