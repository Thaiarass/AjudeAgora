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
  Platform,
  ScrollView
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Dexie from 'dexie';

// CONFIGURAÇÃO DO BANCO DE DADOS (DEXIE.JS - EXIGIDO PELO PROFESSOR)
const db = new Dexie('AjudeAgoraDatabase');
db.version(1).stores({
  donations: 'id, titulo, categoria, descricao, doador, status, data'
});

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
      const data = await db.donations.toArray();
      setDonations(data);
    } catch (e) {
      Alert.alert("Erro", "Falha ao carregar dados do Dexie");
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
      await db.donations.add(newItem);
      Alert.alert("Sucesso", "Doação cadastrada!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar no Dexie.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.formContainer}>
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
          
          <TouchableOpacity style={styles.mainButton} onPress={saveDonation}>
            <Text style={styles.mainButtonText}>💾 Salvar Doação</Text>
          </TouchableOpacity>
        </ScrollView>
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
      await db.donations.update(currentItem.id, { status: newStatus });
      setCurrentItem({ ...currentItem, status: newStatus });
      Alert.alert("Sucesso", `Item marcado como "${newStatus}".`);
    } catch (e) { 
      Alert.alert("Erro", "Erro ao atualizar."); 
    }
  };

  const deleteItem = () => {
    Alert.alert("Confirmar Exclusão", "Tem certeza que deseja excluir?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: 'destructive', onPress: async () => {
        try {
          await db.donations.delete(currentItem.id);
          navigation.goBack();
        } catch (e) { 
          console.error(e); 
        }
      }}
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.detailContainer}>
        <Text style={styles.screenTitle}>{currentItem.titulo}</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Categoria:</Text>
          <Text style={styles.detailValue}>{ICONS[currentItem.categoria]} {currentItem.categoria}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Descrição:</Text>
          <Text style={styles.detailValue}>{currentItem.descricao || "Sem descrição."}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Doador:</Text>
          <Text style={styles.detailValue}>{currentItem.doador}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Data:</Text>
          <Text style={styles.detailValue}>{currentItem.data}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Status:</Text>
          <Text style={[styles.statusBadge, currentItem.status === 'Disponível' ? styles.statusActive : styles.statusDone]}>
            {currentItem.status}
          </Text>
        </View>

        <TouchableOpacity style={[styles.mainButton, { marginTop: 30 }]} onPress={toggleStatus}>
          <Text style={styles.mainButtonText}>🔄 Alterar Status</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.mainButton, { backgroundColor: '#dc3545', marginTop: 12 }]} onPress={deleteItem}>
          <Text style={styles.mainButtonText}>🗑️ Excluir Registro</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// NAVEGAÇÃO
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Create" component={CreateScreen} options={{ title: 'Nova Doação' }} />
        <Stack.Screen name="Edit" component={EditScreen} options={{ title: 'Detalhes da Doação' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ESTILOS VISUAIS
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 15 },
  headerTitle: { fontSize: 28, color: '#333' },
  headerTitleBold: { fontSize: 28, fontWeight: 'bold', color: '#007bff' },
  subtitle: { paddingHorizontal: 20, color: '#6c757d', marginBottom: 15, fontSize: 14 },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  cardIcon: { fontSize: 24, marginRight: 12 },

