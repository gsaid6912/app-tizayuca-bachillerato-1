import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cuenta, setCuenta] = useState('');

  const handleRegister = async () => {
    if (!nombre || !email || !password || !cuenta) {
      Alert.alert('Error', 'Por favor llena todos los campos.');
      return;
    }

    try {
      // Verificar si el número de cuenta existe y está libre
      const alumnoRef = doc(db, 'alumnos', cuenta);
      const alumnoSnap = await getDoc(alumnoRef);

      if (!alumnoSnap.exists()) {
        Alert.alert('Error', 'El número de cuenta no está registrado.');
        return;
      }

      const alumnoData = alumnoSnap.data();
      if (alumnoData.status === 'en uso') {
        Alert.alert('Error', 'Este número de cuenta ya está vinculado a otro dispositivo.');
        return;
      }

      // Crear usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Guardar datos del padre en Firestore con rol "papa"
      await setDoc(doc(db, 'usuarios', uid), {
        nombre,
        email,
        numeroCuenta: cuenta,
        rol: 'papa', // 👈 asignado automáticamente
        activo: true,
        creado: new Date()
      });

      // Marcar número de cuenta como "en uso"
      await updateDoc(alumnoRef, { status: 'en uso' });

      Alert.alert('Registro exitoso', 'Tu cuenta ha sido creada correctamente.');
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Padre</Text>

      <TextInput style={styles.input} placeholder="Nombre completo" onChangeText={setNombre} />
      <TextInput style={styles.input} placeholder="Correo electrónico" onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Contraseña" onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="Número de cuenta del hijo" onChangeText={setCuenta} keyboardType="number-pad" />

      <Button title="Registrarse" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 15 }
});
