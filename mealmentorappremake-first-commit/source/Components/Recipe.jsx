import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
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
    setError(!data || data.length === 0);
  }, [data]);

  const openDialog = useCallback((item) => {
    setSelectedItem(item);
  }, []);

  const renderItem = useCallback(
    ({ item }) => <Item data={item} onPress={() => openDialog(item)} />,
    [openDialog]
  );

  const keyExtractor = useCallback((item) => item.id.toString(), []);

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
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        initialNumToRender={5}
        showsVerticalScrollIndicator={false}
      />
      <ShowRecipeDialog
        data={selectedItem}
        visible={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </View>
  );
}

const Item = React.memo(({ data, onPress }) => {
  const imageUrl = useMemo(() => data.imageUrl || 'https://via.placeholder.com/150', [data.imageUrl]);
  const title = useMemo(() => data.Title || 'Sin título', [data.Title]);
  const calories = useMemo(() => data.Calories || 'Desconocidas', [data.Calories]);

  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Image source={{ uri: imageUrl }} style={styles.imageRecipe} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.calories}>Calorías: {calories}</Text>
    </TouchableOpacity>
  );
});

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
  },
});
