import React from 'react';
import { Dialog } from '@rneui/themed';
import { Text, SectionList, StyleSheet, View } from 'react-native';

export const ShowRecipeDialog = ({ data, visible, onClose }) => {
    return (
        <Dialog 
            isVisible={visible} 
            onBackdropPress={onClose} 
            overlayStyle={styles.dialogOverlay}>
            <Dialog.Title 
                title={data?.Title} 
                titleStyle={styles.dialogTitle}
            />
            <Text style={styles.dialogSubtitle}>
                Dificultad: {data?.Difficulty}/10 | Tiempo: {data?.estimatedTime}m
            </Text>
            <Text style={styles.dialogSubtitle}>
                Precio: ${data?.Price} | Calorías: {data?.Calories} | Horario: {data?.schedule}
            </Text>
            <View style={styles.listContainer}>
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
            </View>
        </Dialog>
    );
};

const styles = StyleSheet.create({
    dialogOverlay: {
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#D3A357',
        padding: 10,
        backgroundColor: '#1c1c1e',
        height: '70%',
    },
    dialogTitle: {
        textAlign: 'center',
        fontSize: 22,
        color: '#D3A357',
    },
    dialogSubtitle: {
        textAlign: 'center',
        fontSize: 14,
        color: '#FFFFFF',
        marginVertical: 5,
    },
    listContainer: {
        flex: 1,
        maxHeight: 250,
        marginTop: 10,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#D3A357',
        backgroundColor: '#333',
        padding: 5,
    },
    item: {
        fontSize: 16,
        color: '#FFFFFF',
        padding: 1,
    },
});
