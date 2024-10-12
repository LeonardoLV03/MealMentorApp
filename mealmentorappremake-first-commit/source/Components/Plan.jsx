import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Modal, Pressable, Alert } from "react-native";
import { Calendar } from "react-native-calendars";
import { Top } from "./Top";
import { useDoc } from "../Hooks/useDoc";
import { dataBase } from "../Database/Firebase";

export function Plan({ route }) {
    const [loading, setLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [markedDates, setMarkedDates] = useState({});
    const customer = route.params;

    const { data } = useDoc(dataBase, "Plan", customer.plan_ID, setLoading);

    useEffect(() => {
        if (!loading) {
            const newMarkedDates = {};
            const allDates = generateAllDates(new Date(data.startDate), new Date('2025-09-30'));

            allDates.forEach((date) => {
                // Marcar todos los días con puntos blancos inicialmente
                newMarkedDates[date] = { marked: true, dotColor: "#FFFFFF" }; // Puntos blancos
            });

            // Marcar los días con recetas
            if (data?.content) {
                data.content.forEach((_, index) => {
                    const date = getDateByIndex(index);
                    newMarkedDates[date] = { marked: true, dotColor: "#D3A357" }; // Puntos dorados
                });
            }

            setMarkedDates(newMarkedDates);
        }
    }, [loading, data]);

    const getDateByIndex = (index) => {
        const startDate = new Date(data.startDate);
        const targetDate = new Date(startDate);
        targetDate.setDate(startDate.getDate() + index);
        return targetDate.toISOString().split("T")[0];
    };

    const generateAllDates = (startDate, endDate) => {
        const dates = [];
        while (startDate <= endDate) {
            dates.push(startDate.toISOString().split("T")[0]);
            startDate.setDate(startDate.getDate() + 1);
        }
        return dates;
    };

    const handleDayPress = (day) => {
        const isExerciseDone = markedDates[day.dateString]?.exerciseDone;

        // Obtener la receta o mostrar un mensaje genérico si no hay
        const recipe = data.content?.[Object.keys(markedDates).indexOf(day.dateString)];

        setSelectedDay({
            receta: recipe,
            date: day.dateString,
            exerciseDone: isExerciseDone,
        });

        setModalVisible(true);
    };

    const handleExerciseDone = () => {
        setMarkedDates((prev) => ({
            ...prev,
            [selectedDay.date]: {
                ...prev[selectedDay.date],
                dotColor: "green", // Cambiar a verde al hacer ejercicio
                exerciseDone: true, // Registrar que se hizo ejercicio
            },
        }));
        setModalVisible(false);
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <Text style={styles.loadingText}>Cargando plan...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Top page={"Plan"} />
            <View style={styles.infoContainer}>
                <InfoItem label="Calorías por día:" value={data.Calories} />
                <InfoItem label="Objetivo:" value={customer.Goal} />
                <InfoItem label="Inicio:" value={data.startDate} />
            </View>

            <Calendar
                current={new Date().toISOString().split("T")[0]}
                markedDates={markedDates}
                onDayPress={handleDayPress}
                theme={{
                    backgroundColor: "#000",
                    calendarBackground: "#000",
                    dayTextColor: "#FFF",
                    monthTextColor: "#D3A357",
                    arrowColor: "#D3A357",
                    todayTextColor: "#FF6347",
                    selectedDayBackgroundColor: "#333",
                    selectedDayTextColor: "#FFF",
                    dotColor: "#D3A357",
                    textDayFontWeight: "bold",
                    textMonthFontWeight: "bold",
                }}
            />

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Receta del Día</Text>
                        <Text style={styles.modalText}>
                            {selectedDay?.receta || "No hay receta disponible"}
                        </Text>

                        {/* Mostrar botón solo si no se ha registrado el ejercicio */}
                        {!selectedDay?.exerciseDone && (
                            <Pressable
                                style={styles.exerciseButton}
                                onPress={handleExerciseDone}
                            >
                                <Text style={styles.exerciseButtonText}>
                                    Ya realicé ejercicio
                                </Text>
                            </Pressable>
                        )}

                        <Pressable
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Cerrar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const InfoItem = ({ label, value }) => (
    <View style={styles.infoItem}>
        <Text style={styles.boldText}>{label}</Text>
        <Text style={styles.normalText}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        fontSize: 18,
        color: "#D3A357",
    },
    infoContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 20,
        padding: 10,
        backgroundColor: "#1E1E1E",
        borderRadius: 10,
    },
    infoItem: {
        alignItems: "center",
    },
    boldText: {
        fontWeight: "bold",
        color: "#D3A357",
        fontSize: 18,
    },
    normalText: {
        color: "#FFF",
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "80%",
        padding: 20,
        backgroundColor: "#1E1E1E",
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#D3A357",
        textAlign: "center",
        marginBottom: 10,
    },
    modalText: {
        fontSize: 18,
        color: "#FFF",
        textAlign: "center",
    },
    exerciseButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: "#D3A357",
        borderRadius: 10,
        alignItems: "center",
    },
    exerciseButtonText: {
        fontSize: 16,
        color: "#FFF",
    },
    closeButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: "#333",
        borderRadius: 10,
        alignItems: "center",
    },
    closeButtonText: {
        fontSize: 16,
        color: "#FFF",
    },
});
