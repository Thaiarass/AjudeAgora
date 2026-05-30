import 'react-native-gesture-handler';
import React, { useState, useCallback } from  TextInput,import React, { useState, useCallback } from 'react';
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

const ICONS = {
  Alimento: '🍚',
  Roupa: '👕',
  Móvel: '🪑',
};

async function getStoredDonations() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Erro ao ler doações:', error);
    return [];
  }
}

async function saveStoredDonations(donations) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(donations));
    return true;
  } catch (error) {
    console.error('Erro ao salvar doações:', error);
    return false;
  }
}

function HomeScreen({ navigation }) {
  const [donations, setDonations] = useState([]);

  const loadDonations = useCallback(async () => {
    const data = await getStoredDonations();
    setDonations(data.sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0)));
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDonations();
    }, [loadDonations])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Edit', { item })}
      activeOpacity={0.85}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardIcon}>{ICONS[item.categoria] || '📦'}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{item.titulo}</Text>
          <Text style={styles.cardCategory}>{item.categoria}</Text>
        </View>
        <Text
          style={[
            styles.statusBadge,
            item.status === 'Disponível' ? styles.statusActive : styles.statusDone,
          ]}
        >
          {item.status}
        </Text>
      </View>

      <Text style={styles.cardText} numberOfLines={2}>
        {item.descricao || 'Sem descrição informada.'}
      </Text>

      <View style={styles.cardFooter}>
        <Text style={styles.cardFooterText}>📅 {item.data}</Text>
        <Text style={styles.cardFooterText}>👤 {item.doador}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ajude</Text>
        <Text style={styles.headerTitleBold}>Agora</Text>
      </View>

      <Text style={styles.subtitle}>Doe o que você não usa e ajude quem precisa.</Text>

      <FlatList
        data={donations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyText}>Nenhuma doação cadastrada.</Text>
            <Text style={styles.emptySubtext}>
              Clique no botão + para cadastrar a primeira doação.
            </Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Create')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function CreateScreen({ navigation }) {
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('Alimento');
  const [descricao, setDescricao] = useState('');
  const [doador, setDoador] = useState('');

  const handleSave = async () => {
    if (!titulo.trim() || !doador.trim()) {
      Alert.alert('Atenção', 'Preencha o nome do item e o nome do doador.');
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      titulo: titulo.trim(),
      categoria,
      descricao: descricao.trim(),
      doador: doador.trim(),
      status: 'Disponível',
      data: new Date().toLocaleDateString('pt-BR'),
      createdAt: Date.now(),
    };

    const donations = await getStoredDonations();
    donations.push(newItem);
    const ok = await saveStoredDonations(donations);

    if (!ok) {
      Alert.alert('Erro', 'Não foi possível salvar a doação.');
      return;
    }

    Alert.alert('Sucesso', 'Doação cadastrada com sucesso.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.formContainer}>
          <Text style={styles.screenTitle}>Cadastrar Doação</Text>

          <Text style={styles.label}>Nome do item *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Cestas básicas"
            value={titulo}
            onChangeText={setTitulo}
          />

          <Text style={styles.label}>Categoria</Text>
          <View style={styles.categorySelector}>
            {['Alimento', 'Roupa', 'Móvel'].map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.catBtn, categoria === cat && styles.catBtnActive]}
                onPress={() => setCategoria(cat)}
              >
                <Text style={styles.catIcon}>{ICONS[cat]}</Text>
                <Text style={[styles.catBtnText, categoria === cat && styles.catBtnTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Detalhes da doação"
            value={descricao}
            onChangeText={setDescricao}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Nome do doador *</Text>
          <TextInput
            style={styles.input}
            placeholder="Seu nome"
            value={doador}
            onChangeText={setDoador}
          />

          <TouchableOpacity style={styles.mainButton} onPress={handleSave}>
            <Text style={styles.mainButtonText}>💾 Salvar Doação</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function EditScreen({ route, navigation }) {
  const originalItem = route.params?.item;

  const [titulo, setTitulo] = useState(originalItem?.titulo || '');
  const [categoria, setCategoria] = useState(originalItem?.categoria || 'Alimento');
  const [descricao, setDescricao] = useState(originalItem?.descricao || '');
  const [doador, setDoador] = useState(originalItem?.doador || '');
  const [status, setStatus] = useState(originalItem?.status || 'Disponível');
  const [data] = useState(originalItem?.data || '');
  const [id] = useState(originalItem?.id || '');
  const [createdAt] = useState(originalItem?.createdAt || Date.now());

  const handleUpdate = async () => {
    if (!titulo.trim() || !doador.trim()) {
      Alert.alert('Atenção', 'Preencha o nome do item e o nome do doador.');
      return;
    }

    const updatedItem = {
      id,
      titulo: titulo.trim(),
      categoria,
      descricao: descricao.trim(),
      doador: doador.trim(),
      status,
      data,
      createdAt,
    };

    const donations = await getStoredDonations();
    const updatedDonations = donations.map((item) => (item.id === id ? updatedItem : item));
    const ok = await saveStoredDonations(updatedDonations);

    if (!ok) {
      Alert.alert('Erro', 'Não foi possível atualizar a doação.');
      return;
    }

    Alert.alert('Sucesso', 'Doação atualizada com sucesso.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const toggleStatus = () => {
    setStatus((current) => (current === 'Disponível' ? 'Entregue' : 'Disponível'));
  };

  const handleDelete = () => {
    Alert.alert('Confirmar exclusão', 'Tem certeza que deseja excluir esta doação?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          const donations = await getStoredDonations();
          const filtered = donations.filter((item) => item.id !== id);
          const ok = await saveStoredDonations(filtered);

          if (!ok) {
            Alert.alert('Erro', 'Não foi possível excluir a doação.');
            return;
          }

          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.formContainer}>
          <Text style={styles.screenTitle}>Editar Doação</Text>

          <Text style={styles.label}>Nome do item *</Text>
          <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} />

          <Text style={styles.label}>Categoria</Text>
          <View style={styles.categorySelector}>
            {['Alimento', 'Roupa', 'Móvel'].map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.catBtn, categoria === cat && styles.catBtnActive]}
                onPress={() => setCategoria(cat)}
              >
                <Text style={styles.catIcon}>{ICONS[cat]}</Text>
                <Text style={[styles.catBtnText, categoria === cat && styles.catBtnTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={descricao}
            onChangeText={setDescricao}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Nome do doador *</Text>
          <TextInput style={styles.input} value={doador} onChangeText={setDoador} />

          <Text style={styles.label}>Status</Text>
          <TouchableOpacity
            style={[
              styles.statusToggle,
              status === 'Disponível' ? styles.statusActiveBlock : styles.statusDoneBlock,
            ]}
            onPress={toggleStatus}
          >
            <Text style={styles.statusToggleText}>
              Status atual: {status} (toque para alterar)
            </Text>
          </TouchableOpacity>

          <Text style={styles.detailInfo}>Data de cadastro: {data}</Text>

          <TouchableOpacity style={styles.mainButton} onPress={handleUpdate}>
            <Text style={styles.mainButtonText}>✏️ Salvar Alterações</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.mainButton, styles.deleteButton]} onPress={handleDelete}>
            <Text style={styles.mainButtonText}>🗑️ Excluir Doação</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Create" component={CreateScreen} options={{ title: 'Nova Doação' }} />
        <Stack.Screen name="Edit" component={EditScreen} options={{ title: 'Editar Doação' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  headerTitle: {
    fontSize: 28,
    color: '#333',
    fontWeight: '400',
  },
  headerTitleBold: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007bff',
  },
  subtitle: {
    paddingHorizontal: 20,
    color: '#6c757d',
    marginBottom: 15,
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardCategory: {
    fontSize: 12,
    color: '#6c757d',
  },
  cardText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  cardFooterText: {
    fontSize: 12,
    color: '#888',
  },
  statusBadge: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  statusActive: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  statusDone: {
    backgroundColor: '#d1ecf1',
    color: '#0c5460',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabText: {
    fontSize: 30,
    color: '#fff',
    marginTop: -2,
  },
  formContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categorySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  catBtn: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 4,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  catBtnActive: {
    backgroundColor: '#e7f1ff',
    borderColor: '#007bff',
  },
  catIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  catBtnText: {
    fontSize: 12,
    color: '#666',
  },
  catBtnTextActive: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  mainButton: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusToggle: {
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginTop: 4,
  },
  statusActiveBlock: {
    backgroundColor: '#d4edda',
  },
  statusDoneBlock: {
    backgroundColor: '#d1ecf1',
  },
  statusToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  detailInfo: {
    marginTop: 12,
    color: '#666',
    fontSize: 13,
  },
});
import {
  StyleSheet,
  Text,
  View,

