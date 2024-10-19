import Constants from 'expo-constants';
import { useState, useCallback } from 'react';
import { auth, dataBase } from '../Database/Firebase'; // Importar Firebase Auth
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'; // Métodos de inicio de sesión y restablecimiento de contraseña
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Pressable,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { getDocs, collection, query, where } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  topLogin: { marginTop: Constants.statusBarHeight, padding: 20, alignItems: 'center' },
  title: { fontSize: 32, color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  logoImage: {
    position: 'absolute',
    right: -(width * 0.1),
    top: 0,
    height: height * 0.95,
    width: width * 1.2,
    resizeMode: 'contain',
  },
  viewInputsLogin: { position: 'absolute', bottom: 5, width: '100%', alignItems: 'center' },
  viewButtonLogin: {
    width: width * 0.8,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: { color: '#000', fontSize: 20, fontWeight: 'bold' },
  newAccountText: { color: '#fff', fontSize: 16, textDecorationLine: 'underline' },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalIcon: { width: 60, height: 60, marginBottom: 20 },
  modalTitle: { fontSize: 22, color: '#fff', marginBottom: 20, textAlign: 'center' },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#444',
    borderRadius: 10,
    paddingLeft: 10,
    color: '#fff',
    marginBottom: 20,
  },
  continueText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
});

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [resetModalVisible, setResetModalVisible] = useState(false); // Estado para el modal de restablecimiento
  const navigation = useNavigation();

  const handleLogin = useCallback(async () => {
    try {
      // Iniciar sesión con Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // Aquí obtienes el UID del usuario
  
      // Ahora, consulta en Firestore para obtener los datos adicionales
      const usuariosRef = collection(dataBase, "Customers");
      const q = query(usuariosRef, where("email", "==", email)); // O puedes usar user.uid si lo guardas en Firestore
      const usuariosSnapshot = await getDocs(q);
  
      if (!usuariosSnapshot.empty) {
        const usuariosData = usuariosSnapshot.docs[0].data(); // Datos del usuario en Firestore
        console.log("Datos del usuario desde Firestore", usuariosData);
  
        // Redirigir a la pantalla principal con los datos del usuario
        navigation.navigate('tabs', { data: usuariosData });
      } else {
        setError('No se encontraron datos para este usuario');
      }
    } catch (error) {
      setError('Usuario o contraseña incorrectos');
      console.error('Error en el login:', error.message);
    }
  }, [email, password, navigation]);

  const handleMoveToNewCustomer = useCallback(() => {
    Alert.alert('Visita a tu nutriólogo/a');
  }, []);

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Éxito', 'Se ha enviado un enlace de restablecimiento de contraseña a tu correo electrónico.');
      setResetModalVisible(false); // Cerrar el modal
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar el enlace de restablecimiento. Asegúrate de que el correo esté registrado.');
      console.error('Reset password failed:', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topLogin}>
        <Text style={styles.title}>Come Mejor, Obtén Resultados</Text>
      </View>

      <Image
        source={require('../../assets/plato.gif')}
        style={styles.logoImage}
        alt="MealMentor Logo"
      />

      <View style={styles.viewInputsLogin}>
        <Pressable
          onPress={() => setModalVisible(true)}
          style={({ pressed }) => [
            styles.viewButtonLogin,
            { backgroundColor: pressed ? '#defcf280' : '#defcf2' },
          ]}
        >
          <Text style={styles.buttonText}>Comenzar</Text>
        </Pressable>

        <Text style={styles.newAccountText} onPress={handleMoveToNewCustomer}>
          ¿No Tienes Cuenta?
        </Text>

        <Text style={styles.newAccountText} onPress={() => setResetModalVisible(true)}>
          ¿Olvidaste tu contraseña?
        </Text>
      </View>

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Image
              source={require('../../assets/correo.png')}
              style={styles.modalIcon}
            />
            <Text style={styles.modalTitle}>Correo Electrónico</Text>
            <TextInput
              style={styles.input}
              placeholder="Correo"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
            />
            <Text style={styles.modalTitle}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#888"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            {error && <Text style={{ color: 'red' }}>{error}</Text>}
            <Pressable
              onPress={handleLogin}
              style={({ pressed }) => [
                styles.viewButtonLogin,
                { backgroundColor: pressed ? '#defcf280' : '#defcf2' },
              ]}
            >
              <Text style={styles.continueText}>Continuar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent
        visible={resetModalVisible}
        onRequestClose={() => setResetModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Restablecer Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Correo Electrónico"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
            />
            <Pressable
              onPress={handleResetPassword}
              style={({ pressed }) => [
                styles.viewButtonLogin,
                { backgroundColor: pressed ? '#defcf280' : '#defcf2' },
              ]}
            >
              <Text style={styles.continueText}>Enviar Enlace de Restablecimiento</Text>
            </Pressable>
            <Pressable
              onPress={() => setResetModalVisible(false)}
              style={({ pressed }) => [
                styles.viewButtonLogin,
                { backgroundColor: pressed ? '#defcf280' : '#defcf2' },
              ]}
            >
              <Text style={styles.continueText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}