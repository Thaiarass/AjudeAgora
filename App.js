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
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const STORAGE_KEY = '@ajudeagora:donations';
const Stack = createStackNavigator();

async function getData() {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function saveData(data) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ===== HOME =====
function Home({ navigation }) {
  const [data, setData] = useState([]);

  const load = useCallback(async () => {
    const d = await getData();
    setData(d);
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
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Edit', { item })}
          >
            <Text style={styles.cardTitle}>{item.titulo}</Text>
            <Text style={styles.cardDoador}>{item.doador}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Create')}
      >
        <Text style={styles.buttonText}>+ Add</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ===== CREATE =====
function Create({ navigation }) {
  const [titulo, setTitulo] = useState('');
  const [doador, setDoador] = useState('');

  const salvar = async () => {
    if (!titulo.trim() || !doador.trim()) {
      Alert.alert('Preencha os campos');
      return;
    }

    const data = await getData();

    data.push({
      id: Date.now().toString(),
      titulo: titulo.trim(),
      doador: doador.trim(),
    });

    await saveData(data);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>Item</Text>
      <TextInput
        placeholder="Nome do item"
        style={styles.input}
        value={titulo}
        onChangeText={setTitulo}
      />

      <Text style={styles.label}>Doador</Text>
      <TextInput
        placeholder="Seu nome"
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
function Edit({ route, navigation }) {
  const { item } = route.params;

  const [titulo, setTitulo] = useState(item.titulo);
  const [doador, setDoador] = useState(item.doador);

  const atualizar = async () => {
    if (!titulo.trim() || !doador.trim()) {
      Alert.alert('Preencha os campos');
      return;
    }

    const data = await getData();
    const novo = data.map((i) =>
      i.id === item.id
        ? { ...i, titulo: titulo.trim(), doador: doador.trim() }
        : i
    );

    await saveData(novo);
    navigation.goBack();
  };

  const excluir = async () => {
    const data = await getData();
    const novo = data.filter((i) => i.id !== item.id);

    await saveData(novo);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>Item</Text>
      <TextInput
        style={styles.input}
        value={titulo}
        onChangeText={setTitulo}
      />

      <Text style={styles.label}>Doador</Text>
      <TextInput
        style={styles.input}
        value={doador}
        onChangeText={setDoador}
      />

      <TouchableOpacity style={styles.button} onPress={atualizar}>
        <Text style={styles.buttonText}>Atualizar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.deleteButton]}
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
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Create" component={Create} />
        <Stack.Screen name="Edit" component={Edit} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ===== STYLE =====
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  cardTitle: {
    fontWeight: 'bold',
  },
  cardDoador: {
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
