import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa tu correo y contraseña.');
      return;
    }

    try {
      // Iniciar sesión
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Obtener usuario desde Firestore
      const usuarioRef = doc(db, 'usuarios', uid);
      const usuarioSnap = await getDoc(usuarioRef);

      if (!usuarioSnap.exists()) {
        Alert.alert('Error', 'No estás registrado como usuario autorizado.');
        return;
      }

      const usuarioData = usuarioSnap.data();

      if (!usuarioData.activo) {
        Alert.alert('Acceso bloqueado', 'Tu cuenta ha sido desactivada. Contacta a la escuela.');
        return;
      }

      // Redirigir según rol
      if (usuarioData.rol === 'papa') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'DashboardPapa', params: { nombre: usuarioData.nombre } }]
        });
      } else if (usuarioData.rol === 'secretaria') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'DashboardSecretaria', params: { nombre: usuarioData.nombre } }]
        });
      } else {
        Alert.alert('Error', 'Rol no reconocido.');
      }

    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput style={styles.input} placeholder="Correo electrónico" onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Contraseña" onChangeText={setPassword} secureTextEntry />
      <Button title="Iniciar sesión" onPress={handleLogin} />
      <Text style={styles.registerText}>
        ¿No tienes cuenta?{' '}
        <Text style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
          Regístrate aquí
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 15 },
  registerText: { textAlign: 'center', marginTop: 15 },
  registerLink: { color: 'blue', fontWeight: 'bold' }
});
