import 'react-native-gesture-handler';
import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const STORAGE_KEY = '@ajudeagora:donations';
const Stack = createStackNavigator();

const ICONS = {
  Alimento: '🍚',
  Roupa: '👕',
  Móvel: '🪑',
};

async function getStoredDonations() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function saveStoredDonations(data) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ===== HOME =====
function HomeScreen({ navigation }) {
  const [donations, setDonations] = useState([]);

  const load = useCallback(async () => {
    const data = await getStoredDonations();
    setDonations(data.reverse());
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>AjudeAgora</Text>

      <FlatList
        data={donations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Edit', { item })}
          >
            <Text style={styles.bold}>{item.titulo}</Text>
            <Text>{ICONS[item.categoria]} {item.categoria}</Text>
            <Text>{item.doador}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Create')}
      >
        <Text style={styles.buttonText}>+ Nova Doação</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ===== CREATE =====
function CreateScreen({ navigation }) {
  const [titulo, setTitulo] = useState('');
  const [doador, setDoador] = useState('');

  const salvar = async () => {
    if (!titulo || !doador) {
      Alert.alert("Preencha os campos");
      return;
    }

    const data = await getStoredDonations();

    data.push({
      id: Date.now().toString(),
      titulo,
      categoria: 'Alimento',
      doador,
      status: 'Disponível'
    });

    await saveStoredDonations(data);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        placeholder="Item"
        style={styles.input}
        value={titulo}
        onChangeText={setTitulo}
      />

      <TextInput
        placeholder="Doador"
        style={styles.input}
        value={doador}
        onChangeText={setDoador}
      />

      <TouchableOpacity style={styles.button} onPress={salvar}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ===== EDIT =====
function EditScreen({ route, navigation }) {
  const { item } = route.params;

  const [titulo, setTitulo] = useState(item.titulo);
  const [doador, setDoador] = useState(item.doador);

  const atualizar = async () => {
    const data = await getStoredDonations();

    const novo = data.map((i) =>
      i.id === item.id ? { ...i, titulo, doador } : i
    );

    await saveStoredDonations(novo);
    navigation.goBack();
  };

  const excluir = async () => {
    const data = await getStoredDonations();
    const novo = data.filter((i) => i.id !== item.id);

    await saveStoredDonations(novo);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        value={titulo}
        onChangeText={setTitulo}
      />

      <TextInput
        style={styles.input}
        value={doador}
        onChangeText={setDoador}
      />

      <TouchableOpacity style={styles.button} onPress={atualizar}>
        <Text style={styles.buttonText}>Atualizar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: 'red' }]}
        onPress={excluir}
      >
        <Text style={styles.buttonText}>Excluir</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ===== APP =====
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Create" component={CreateScreen} />
        <Stack.Screen name="Edit" component={EditScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ===== STYLE =====
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa'
  },
  title: {
    fontSize: 24,
    marginBottom: 15
  },
  card: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8
  },
  bold: {
    fontWeight: 'bold'
  },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff'
  }
});
