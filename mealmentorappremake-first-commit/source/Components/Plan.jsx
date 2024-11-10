import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Modal, Pressable, Alert } from "react-native";
import { Calendar } from "react-native-calendars";
import { Top } from "./Top";
import { useDoc } from "../Hooks/useDoc";
import { dataBase } from "../Database/Firebase";
import { updateDoc, doc, arrayUnion, getDoc } from "firebase/firestore";
import { useTheme } from "../../ThemeContext"; // Importa el contexto de tema

export function Plan({ route }) {
    const [loading, setLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [markedDates, setMarkedDates] = useState({});
    const customer = route.params;
    const { isDarkTheme } = useTheme(); // Obtén el valor del tema

    const { data } = useDoc(dataBase, "Plan", customer.plan_ID, setLoading);

    useEffect(() => {
        const fetchTrackerData = async () => {
            const trackerRef = doc(dataBase, "Trackers", customer.fitTracker_ID);
            const trackerSnap = await getDoc(trackerRef);
            const trackerData = trackerSnap.data();

            if (!loading) {
                const newMarkedDates = {};
                const allDates = generateAllDates(new Date(data.startDate), new Date('2025-09-30'));

                allDates.forEach((date) => {
                    newMarkedDates[date] = { marked: true, dotColor: "#FFFFFF" };
                });

                if (data?.content) {
                    data.content.forEach((_, index) => {
                        const date = getDateByIndex(index);
                        newMarkedDates[date] = { marked: true, dotColor: "#D3A357" };
                    });
                }

                if (trackerData?.Fecha) {
                    trackerData.Fecha.forEach((trackedDate) => {
                        if (newMarkedDates[trackedDate]) {
                            newMarkedDates[trackedDate] = {
                                ...newMarkedDates[trackedDate],
                                dotColor: "green",
                                exerciseDone: true,
                            };
                        }
                    });
                }

                setMarkedDates(newMarkedDates);
            }
        };

        fetchTrackerData();
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
        const dateIndex = Object.keys(markedDates).indexOf(day.dateString);
        const recipe = dateIndex !== -1 ? data.content?.[dateIndex] : null;

        setSelectedDay({
            receta: recipe,
            date: day.dateString,
            exerciseDone: isExerciseDone,
        });

        setModalVisible(true);
    };

    const handleExerciseDone = async () => {
        try {
            const trackerRef = doc(dataBase, "Trackers", customer.fitTracker_ID);
            const currentDate = selectedDay.date;

            await updateDoc(trackerRef, {
                Fecha: arrayUnion(currentDate),
            });

            setMarkedDates((prev) => ({
                ...prev,
                [selectedDay.date]: {
                    ...prev[selectedDay.date],
                    dotColor: "green",
                    exerciseDone: true,
                },
            }));

            setModalVisible(false);
        } catch (error) {
            console.error("Error actualizando el documento de Tracker: ", error);
            Alert.alert("Error", "No se pudo actualizar el estado de ejercicio.");
        }
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <Text style={[styles.loadingText, { color: isDarkTheme ? "#FFF" : "#000" }]}>
                    Cargando plan...
                </Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: isDarkTheme ? "#000" : "#FFF" }]}>
            <Top page={"Plan"} />
            <View style={[styles.infoContainer, { backgroundColor: isDarkTheme ? "#1E1E1E" : "#F0F0F0" }]}>
                <InfoItem label="Calorías por día:" value={data.Calories} />
                <InfoItem label="Objetivo:" value={customer.Goal} />
                <InfoItem label="Inicio:" value={data.startDate} />
            </View>

            <Calendar
                current={new Date().toISOString().split("T")[0]}
                markedDates={markedDates}
                onDayPress={handleDayPress}
                theme={{
                    backgroundColor: isDarkTheme ? "#000" : "#FFF",
                    calendarBackground: isDarkTheme ? "#000" : "#FFF",
                    dayTextColor: isDarkTheme ? "#FFF" : "#000",
                    monthTextColor: "#D3A357",
                    arrowColor: "#D3A357",
                    todayTextColor: "#FF6347",
                    selectedDayBackgroundColor: isDarkTheme ? "#333" : "#CCC",
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
                    <View style={[styles.modalContent, { backgroundColor: isDarkTheme ? "#1E1E1E" : "#FFF" }]}>
                        <Text style={styles.modalTitle}>Receta del Día</Text>
                        <Text style={[styles.modalText, { color: isDarkTheme ? "#FFF" : "#000" }]}>
                            {selectedDay?.receta || "No hay receta disponible"}
                        </Text>

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
    },
    infoContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 20,
        padding: 10,
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
