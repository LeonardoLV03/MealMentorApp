// Componente ShowRecipeDialog
import React from 'react';
import { Dialog } from '@rneui/themed';
import { Text, SectionList, StyleSheet } from 'react-native';

export const ShowRecipeDialog = ({ data, visible, onClose }) => {
    return (
        <Dialog 
        isVisible={visible} 
        onBackdropPress={onClose} 
        overlayStyle={{borderRadius:8, borderWidth: 2, borderColor: '#D3A357', padding: 5}}>
            <Dialog.Title title={data?.Title} titleStyle={{textAlign:'center'}}/>
            <Text style={{textAlign:'center', fontSize: 12.5}}>
                Difucultad: {data?.Difficulty}/10 | Tiempo: {data?.estimatedTime}m
            </Text>
            <Text style={{textAlign:'center', fontSize: 12.5, marginBottom: 5}}>
                Precio: ${data?.Price} | Calorias: {data?.Calories}| Horario: {data?.schedule}
            </Text>
            <SectionList
                sections={[
                    {
                    title: 'Ingredientes', 
                    data: data?.Ingredients
                    },
                    {
                    title: 'Pasos',
                    data: data?.Steps
                    },
                ]}
                renderItem={({item}) => <Text style={styles.item}>• {item}</Text>}
                renderSectionHeader={({section}) => (
                <Text style={styles.sectionHeader}>{section.title}</Text>
                )}
                keyExtractor={(item, index) => item + index}
            />
        </Dialog>
    );
};

const styles = StyleSheet.create({
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        backgroundColor: 'rgba(247,247,247,1.0)',
    },
    item: {
        fontSize: 16,
        padding: 1
      },
})