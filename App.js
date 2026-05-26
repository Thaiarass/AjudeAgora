import React, { useState, useEffect } from 'react';
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
  Platform
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// BANCO DE DADOS
const DB_KEY = '@ajudeagora_db';

// ÍCONES
const ICONS = {
  Alimento: '🍚',
  Roupa: '👕',
  Móvel: '🪑'
};

// TELA 1: LISTA DE DOAÇÕES
function HomeScreen({ navigation }) {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadDonations();
    });
    return unsubscribe;
  }, [navigation]);

  const loadDonations = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(DB_KEY);
      if (jsonValue != null) {
        setDonations(JSON.parse(jsonValue));
      }
    } catch (e) {
      Alert.alert("Erro", "Falha ao carregar dados");
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate('Edit', { item })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardIcon}>{ICONS[item.categoria]}</Text>
        <View style={{flex: 1}}>
          <Text style={styles.cardTitle}>{item.titulo}</Text>
          <Text style={styles.cardCategory}>{item.categoria}</Text>
        </View>
        <Text style={[
          styles.statusBadge, 
          item.status === 'Disponível' ? styles.statusActive : styles.statusDone
        ]}>
          {item.status}
        </Text>
      </View>
      <Text style={styles.cardText} numberOfLines={2}>{item.descricao}</Text>
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
        <Text style={styles.headerTitle}> Ajude</Text>
        <Text style={styles.headerTitleBold}>Agora</Text>
      </View>
      <Text style={styles.subtitle}>Doe o que você não usa, ajude quem precisa!</Text>
      <FlatList
        data={donations}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyText}>Nenhuma doação cadastrada.</Text>
            <Text style={styles.emptySubtext}>Clique no botão + para doar algo!</Text>
          </View>
        }
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Create')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// TELA 2: CADASTRAR DOAÇÃO
function CreateScreen({ navigation }) {
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('Alimento');
  const [descricao, setDescricao] = useState('');
  const [doador, setDoador] = useState('');

  const saveDonation = async () => {
    if (!titulo.trim() || !doador.trim()) {
      Alert.alert("Atenção", "Preencha o nome do item e o nome do doador!");
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      titulo: titulo.trim(),
      categoria,
      descricao: descricao.trim(),
      doador: doador.trim(),
      status: 'Disponível',
      data: new Date().toLocaleDateString('pt-BR')
    };

    try {
      const jsonValue = await AsyncStorage.getItem(DB_KEY);
      let currentData = jsonValue != null ? JSON.parse(jsonValue) : [];
      const updatedData = [...currentData, newItem];
      await AsyncStorage.setItem(DB_KEY, JSON.stringify(updatedData));
      Alert.alert("Sucesso", "Doação cadastrada!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.formContainer}>
        <Text style={styles.screenTitle}>Cadastrar Doação</Text>
        <Text style={styles.label}>Nome do Item *</Text>
        <TextInput style={styles.input} placeholder="Ex: Cestas Básicas" value={titulo} onChangeText={setTitulo} />
        <Text style={styles.label}>Categoria</Text>
        <View style={styles.categorySelector}>
          {['Alimento', 'Roupa', 'Móvel'].map(cat => (
            <TouchableOpacity key={cat} style={[styles.catBtn, categoria === cat && styles.catBtnActive]} onPress={() => setCategoria(cat)}>
              <Text style={styles.catIcon}>{ICONS[cat]}</Text>
              <Text style={[styles.catBtnText, categoria === cat && styles.catBtnTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>Descrição</Text>
        <TextInput style={[styles.input, styles.textArea]} placeholder="Detalhes..." value={descricao} onChangeText={setDescricao} multiline numberOfLines={4} />
        <Text style={styles.label}>Nome do Doador *</Text>
        <TextInput style={styles.input} placeholder="Seu nome" value={doador} onChangeText={setDoador} />
        <TouchableOpacity style={styles.mainButton} onPress={saveDonation}><Text style={styles.mainButtonText}>💾 Salvar Doação</Text></TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// TELA 3: DETALHES E EDIÇÃO
function EditScreen({ route, navigation }) {
  const { item } = route.params;
  const [currentItem, setCurrentItem] = useState(item);

  const toggleStatus = async () => {
    const newStatus = currentItem.status === 'Disponível' ? 'Entregue' : 'Disponível';
    try {
      const jsonValue = await AsyncStorage.getItem(DB_KEY);
      let list = JSON.parse(jsonValue);
      const newList = list.map((i) => (i.id === currentItem.id ? { ...i, status: newStatus } : i));
      await AsyncStorage.setItem(DB_KEY, JSON.stringify(newList));
      setCurrentItem({ ...currentItem, status: newStatus });
      Alert.alert("Sucesso", `Item marcado como "${newStatus}".`);
    } catch (e) { Alert.alert("Erro", "Erro ao atualizar."); }
  };

  const deleteItem = () => {
    Alert.alert("Confirmar Exclusão", "Tem certeza que deseja excluir?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: 'destructive', onPress: async () => {
        try {
          const jsonValue = await AsyncStorage.getItem(DB_KEY);
          let list = JSON.parse(jsonValue);
          const newList = list.filter((i) => i.id !== currentItem.id);
          await AsyncStorage.setItem(DB_KEY, JSON.stringify(newList));
          navigation.goBack();
        } catch (e) { console.error(e); }
      }}
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.detailContainer}>
        <Text style={styles.screenTitle}>{currentItem.titulo}</Text>
        <View style={styles.detailRow}><Text style={styles.detailLabel}>Categoria:</Text><Text style={styles.detailValue}>{ICONS[currentItem.categoria]} {currentItem.categoria}</Text></View>
        <View style={styles.detailRow}><Text style={styles.detailLabel}>Descrição:</Text><Text style={styles.detailValue}>{currentItem.descricao || "Sem descrição."}</Text></View>
        <View style={styles.detailRow}><Text style={styles.detailLabel}>Doador:</Text><Text style={styles.detailValue}>{currentItem.doador}</Text></View>
        <View style={styles.detailRow}><Text style={styles.detailLabel}>Data:</Text><Text style={styles.detailValue}>{currentItem.data}</Text></View>
        <View style={styles.detailRow}><Text style={styles.detailLabel}>Status:</Text><Text style={[styles.statusBadge, currentItem.status === 'Disponível' ? styles.statusActive : styles.statusDone, { alignSelf: 'flex-start', marginTop: 5 }]}>{currentItem.status}</Text></View>
        <TouchableOpacity style={[styles.mainButton, { backgroundColor: currentItem.status === 'Disponível' ? '#4CAF50' : '#FF9800' }]} onPress={toggleStatus}><Text style={styles.mainButtonText}>{currentItem.status === 'Disponível' ? '✅ Marcar como Entregue' : '↩️ Tornar Disponível'}</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.mainButton, { backgroundColor: '#F44336', marginTop: 10 }]} onPress={deleteItem}><Text style={styles.mainButtonText}>🗑️ Excluir Doação</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// NAVEGAÇÃO
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerStyle: { backgroundColor: '#ffffff' }, headerTintColor: '#333', headerTitleStyle: { fontWeight: 'bold' } }}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Create" component={CreateScreen} options={{ title: 'Nova Doação' }} />
        <Stack.Screen name="Edit" component={EditScreen} options={{ title: 'Detalhes' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ESTILOS
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  formContainer: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'center', paddingTop: 20, paddingBottom: 10, backgroundColor: '#fff' },
  headerTitle: { fontSize: 24, color: '#666' },
  headerTitleBold: { fontSize: 24, fontWeight: 'bold', color: '#2196F3' },
  subtitle: { textAlign: 'center', color: '#888', marginBottom: 10, fontSize: 14 },
  listContent: { padding: 15, paddingBottom: 80 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  cardIcon: { fontSize: 28, marginRight: 10 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  cardCategory: { fontSize: 12, color: '#888', marginTop: 2 },
  cardText: { fontSize: 14, color: '#555', marginBottom: 8 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 8 },
  cardFooterText: { fontSize: 12, color: '#999' },
  statusBadge: { fontSize: 10, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, overflow: 'hidden', color: '#fff' },
  statusActive: { backgroundColor: '#4CAF50' },
  statusDone: { backgroundColor: '#9E9E9E' },
  fab: { position: 'absolute', right: 20, bottom: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#2196F3', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  fabText: { fontSize: 30, color: '#fff', lineHeight: 34 },
  screenTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 5, marginTop: 10 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, color: '#333' },
  textArea: { height: 100, textAlignVertical: 'top' },
  categorySelector: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  catBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginHorizontal: 4 },
  catBtnActive: { backgroundColor: '#2196F3', borderColor: '#2196F3' },
  catIcon: { fontSize: 20 },
  catBtnText: { marginLeft: 5, fontSize: 14, color: '#333' },
  catBtnTextActive: { color: '#fff' },
  mainButton: { backgroundColor: '#2196F3', borderRadius: 8, padding: 15, alignItems: 'center', marginTop: 20 },
  mainButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  detailContainer: { flex: 1, padding: 20 },
  detailRow: { marginBottom: 15 },
  detailLabel: { fontSize: 14, color: '#888', marginBottom: 3 },
  detailValue: { fontSize: 16, color: '#333', fontWeight: '500' },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyIcon: { fontSize: 60, marginBottom: 10 },
  emptyText: { fontSize: 16, color: '#888' },
  emptySubtext: { fontSize: 14, color: '#aaa', marginTop: 5 }
});