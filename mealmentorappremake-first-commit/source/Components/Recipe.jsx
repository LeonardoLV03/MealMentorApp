// Componente Recipes
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';

import { doc, updateDoc } from 'firebase/firestore';
import { dataBase } from '../Database/Firebase';
import { useDocs } from '../Hooks/useDocs';

import { Top } from './Top';
import { ShowRecipeDialog } from './DialogRecipe/ShowRecipeDialog';

export function Recipes() {
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    const [error, setError] = useState(false);

    const { data } = useDocs(dataBase, 'Recipe', setLoading);

    useEffect(() => {
        if (!data || data.length === 0) {
            setError(true);
        } else {
            setError(false);
        }
    }, [data]);

    const openDialog = (item) => {
        setSelectedItem(item);
    };

    if (loading) {
        return <Text style={styles.loadingText}>Cargando...</Text>;
    }

    if (error) {
        return <Text style={styles.errorText}>Error al cargar las recetas. Intenta nuevamente más tarde.</Text>;
    }

    return (
        <View style={styles.app}>
            <Top page={'Recetas'} />
            <FlatList
                data={data}
                renderItem={({ item }) => (
                    <Item data={item} onPress={() => openDialog(item)} />
                )}
                keyExtractor={(item) => item.id}
            />
            <ShowRecipeDialog
                data={selectedItem}
                visible={!!selectedItem}
                onClose={() => setSelectedItem(null)}
            />
        </View>
    );
}

const Item = ({ data, onPress }) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
        <Image source={{ uri: data.imageUrl || 'https://via.placeholder.com/150' }} style={styles.imageRecipe} />
        <Text style={styles.title}>{data.Title || 'Sin título'}</Text>
        <Text style={styles.calories}>Calorías: {data.Calories || 'Desconocidas'}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    app: {
        flex: 1,
        backgroundColor: '#000',
        paddingHorizontal: 10,
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
    item: {
        flex: 1,
        marginBottom: 20,
        backgroundColor: '#1c1c1e',
        borderRadius: 12,
        padding: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
        elevation: 5,
    },
    imageRecipe: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
        resizeMode: 'cover',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 5,
    },
    calories: {
        fontSize: 16,
        color: '#d3d3d3',
        textAlign: 'center',
    }
});
