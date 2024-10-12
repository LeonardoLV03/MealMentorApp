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
        if (!loading && data?.content) {
            const newMarkedDates = {};
            data.content.forEach((_, index) => {
                const date = getDateByIndex(index);
                newMarkedDates[date] = { marked: true, dotColor: "#D3A357" };
            });
            setMarkedDates(newMarkedDates);
        }
    }, [loading, data]);

    const getDateByIndex = (index) => {
        const startDate = new Date(data.startDate);
        const targetDate = new Date(startDate);
        targetDate.setDate(startDate.getDate() + index);
        return targetDate.toISOString().split("T")[0];
    };

    const handleDayPress = (day) => {
        const selectedIndex = Object.keys(markedDates).indexOf(day.dateString);
        if (selectedIndex !== -1) {
            setSelectedDay(data.content[selectedIndex]);
            setModalVisible(true);
        } else {
            Alert.alert("Sin receta", "No hay información para este día.");
        }
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
                    backgroundColor: "#000",  // Fondo negro del calendario
                    calendarBackground: "#000",  // Fondo negro del calendario
                    dayTextColor: "#FFF",  // Texto en blanco
                    monthTextColor: "#D3A357",  // Mes en dorado
                    arrowColor: "#D3A357",  // Flechas doradas
                    todayTextColor: "#FF6347",  // Hoy en rojo
                    selectedDayBackgroundColor: "#333",  // Día seleccionado en gris oscuro
                    selectedDayTextColor: "#FFF",  // Texto del día seleccionado en blanco
                    dotColor: "#D3A357",  // Puntos dorados
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
                        <Text style={styles.modalText}>{selectedDay}</Text>
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
        backgroundColor: "#000",  // Fondo negro
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
        color: "#D3A357",  // Texto dorado
    },
    infoContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 20,
        padding: 10,
        backgroundColor: "#1E1E1E",  // Fondo gris oscuro
        borderRadius: 10,
    },
    infoItem: {
        alignItems: "center",
    },
    boldText: {
        fontWeight: "bold",
        color: "#D3A357",  // Texto dorado
        fontSize: 18,
    },
    normalText: {
        color: "#FFF",  // Texto blanco
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",  // Fondo semitransparente negro
    },
    modalContent: {
        width: "80%",
        padding: 20,
        backgroundColor: "#1E1E1E",  // Fondo gris oscuro
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#D3A357",  // Título dorado
        textAlign: "center",
        marginBottom: 10,
    },
    modalText: {
        fontSize: 18,
        color: "#FFF",  // Texto blanco
        textAlign: "center",
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: "#D3A357",  // Botón dorado
        borderRadius: 10,
        alignItems: "center",
    },
    closeButtonText: {
        fontSize: 16,
        color: "#FFF",  // Texto blanco
    },
});
