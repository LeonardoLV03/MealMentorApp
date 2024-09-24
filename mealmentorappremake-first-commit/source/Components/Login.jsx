import Constants from 'expo-constants';
import { useState, useCallback } from 'react';
import { dataBase } from '../Database/Firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { SHA256, enc } from 'crypto-js';
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
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const handleLogin = useCallback(async () => {
    try {
      const usersRef = collection(dataBase, 'Customers');
      const q = query(usersRef, where('UserName', '==', user));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        const passHash = SHA256(pass + userData.Salt).toString(enc.Hex);

        if (passHash === userData.Password) {
          navigation.navigate('tabs', userData);
        } else {
          setError('Contraseña incorrecta');
        }
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Login failed:', error.message);
      setError('Ha ocurrido un error. Inténtalo más tarde.');
    }
  }, [user, pass, navigation]);

  const handleMoveToNewCustomer = useCallback(() => {
    Alert.alert('Visita a tu nutriólogo/a');
  }, []);

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
            <Text style={styles.modalTitle}>¿Cuál es tu usuario?</Text>
            <TextInput
              style={styles.input}
              placeholder="Usuario"
              placeholderTextColor="#888"
              value={user}
              onChangeText={setUser}
            />
            <Text style={styles.modalTitle}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#888"
              secureTextEntry
              value={pass}
              onChangeText={setPass}
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
    </SafeAreaView>
  );
}
