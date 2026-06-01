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
  ScrollView,
  Picker,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const STORAGE_KEY = '@ajudeagora:donations';
const Stack = createNativeStackNavigator();

const CATEGORIAS = ['Alimento', 'Roupa', 'Móvel', 'Eletrônicos', 'Livros', 'Outro'];
const STATUS_OPTIONS = ['Disponível', 'Entregue'];

async function getData() {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function saveData(data) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString('pt-BR');
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

  const getStatusColor = (status) => {
    return status === 'Entregue' ? '#28a745' : '#007bff';
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🎁 AjudeAgora</Text>
      <Text style={styles.subtitle}>Plataforma de Doações</Text>

      {data.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma doação cadastrada</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Edit', { item })}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.titulo}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>
              <Text style={styles.cardCategory}>📦 {item.categoria}</Text>
              <Text style={styles.cardDoador}>👤 {item.doador}</Text>
              <Text style={styles.cardDescription}>{item.descricao}</Text>
              <Text style={styles.cardDate}>📅 {item.data}</Text>
            </TouchableOpacity>
          )}
        />
      )}

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
function Create({ navigation }) {
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('Alimento');
  const [descricao, setDescricao] = useState('');
  const [doador, setDoador] = useState('');
  const [status, setStatus] = useState('Disponível');

  const salvar = async () => {
    if (!titulo.trim() || !descricao.trim() || !doador.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios');
      return;
    }

    const data = await getData();
    const now = new Date();
    const dataFormatada = now.toLocaleDateString('pt-BR');

    data.push({
      id: Date.now().toString(),
      titulo: titulo.trim(),
      categoria: categoria,
      descricao: descricao.trim(),
      doador: doador.trim(),
      status: status,
      data: dataFormatada,
      createdAt: Date.now(),
    });

    await saveData(data);
    Alert.alert('Sucesso', 'Doação cadastrada com sucesso!');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.formTitle}>Nova Doação</Text>

        <Text style={styles.label}>Item *</Text>
        <TextInput
          placeholder="Ex: Cesta básica, Camiseta, Cadeira"
          style={styles.input}
          value={titulo}
          onChangeText={setTitulo}
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Categoria *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={categoria}
            onValueChange={(itemValue) => setCategoria(itemValue)}
            style={styles.picker}
          >
            {CATEGORIAS.map((cat) => (
              <Picker.Item key={cat} label={cat} value={cat} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Descrição *</Text>
        <TextInput
          placeholder="Descreva o item em detalhes"
          style={[styles.input, styles.textArea]}
          value={descricao}
          onChangeText={setDescricao}
          multiline
          numberOfLines={4}
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Nome do Doador *</Text>
        <TextInput
          placeholder="Seu nome completo"
          style={styles.input}
          value={doador}
          onChangeText={setDoador}
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Status</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={status}
            onValueChange={(itemValue) => setStatus(itemValue)}
            style={styles.picker}
          >
            {STATUS_OPTIONS.map((stat) => (
              <Picker.Item key={stat} label={stat} value={stat} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity style={styles.button} onPress={salvar}>
          <Text style={styles.buttonText}>💾 Salvar Doação</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ===== EDIT =====
function Edit({ route, navigation }) {
  const { item } = route.params;

  const [titulo, setTitulo] = useState(item.titulo);
  const [categoria, setCategoria] = useState(item.categoria);
  const [descricao, setDescricao] = useState(item.descricao);
  const [doador, setDoador] = useState(item.doador);
  const [status, setStatus] = useState(item.status);

  const atualizar = async () => {
    if (!titulo.trim() || !descricao.trim() || !doador.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios');
      return;
    }

    const data = await getData();
    const novo = data.map((i) =>
      i.id === item.id
        ? {
            ...i,
            titulo: titulo.trim(),
            categoria: categoria,
            descricao: descricao.trim(),
            doador: doador.trim(),
            status: status,
          }
        : i
    );

    await saveData(novo);
    Alert.alert('Sucesso', 'Doação atualizada com sucesso!');
    navigation.goBack();
  };

  const excluir = async () => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir esta doação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            const data = await getData();
            const novo = data.filter((i) => i.id !== item.id);
            await saveData(novo);
            Alert.alert('Sucesso', 'Doação deletada com sucesso!');
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.formTitle}>Editar Doação</Text>

        <Text style={styles.label}>Item *</Text>
        <TextInput
          style={styles.input}
          value={titulo}
          onChangeText={setTitulo}
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Categoria *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={categoria}
            onValueChange={(itemValue) => setCategoria(itemValue)}
            style={styles.picker}
          >
            {CATEGORIAS.map((cat) => (
              <Picker.Item key={cat} label={cat} value={cat} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Descrição *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={descricao}
          onChangeText={setDescricao}
          multiline
          numberOfLines={4}
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Nome do Doador *</Text>
        <TextInput
          style={styles.input}
          value={doador}
          onChangeText={setDoador}
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Status</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={status}
            onValueChange={(itemValue) => setStatus(itemValue)}
            style={styles.picker}
          >
            {STATUS_OPTIONS.map((stat) => (
              <Picker.Item key={stat} label={stat} value={stat} />
            ))}
          </Picker>
        </View>

        <Text style={styles.dateInfo}>📅 Cadastrado em: {item.data}</Text>

        <TouchableOpacity style={styles.button} onPress={atualizar}>
          <Text style={styles.buttonText}>✏️ Atualizar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={excluir}
        >
          <Text style={styles.buttonText}>🗑️ Excluir</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ===== APP =====
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007bff',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: 'AjudeAgora - Plataforma de Doações' }}
        />
        <Stack.Screen
          name="Create"
          component={Create}
          options={{ title: 'Nova Doação' }}
        />
        <Stack.Screen
          name="Edit"
          component={Edit}
          options={{ title: 'Editar Doação' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ===== STYLE =====
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#007bff',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  label: {
    fontWeight: '600',
    marginTop: 14,
    marginBottom: 6,
    color: '#333',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 14,
    color: '#333',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardCategory: {
    fontWeight: '600',
    color: '#007bff',
    marginBottom: 4,
    fontSize: 13,
  },
  cardDoador: {
    color: '#666',
    marginBottom: 6,
    fontSize: 13,
  },
  cardDescription: {
    color: '#555',
    marginBottom: 6,
    fontSize: 13,
    fontStyle: 'italic',
  },
  cardDate: {
    color: '#999',
    fontSize: 12,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
  },
  dateInfo: {
    color: '#666',
    fontSize: 12,
    marginTop: 8,
    marginBottom: 14,
    fontStyle: 'italic',
  },
});
