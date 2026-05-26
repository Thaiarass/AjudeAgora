# AjudeAgora - Plataforma de Doações

## 👥 Integrantes do Grupo
- **Thaiara Santana** (RA: 202402541031)

---

## 🌍 Descrição do Problema Social

O aplicativo **"AjudeAgora"** visa conectar pessoas que possuem surplus de alimentos, roupas ou móveis com pessoas ou instituições carentes. 

### Problema Resolvido
- ❌ Carência de recursos básicos em comunidades vulneráveis
- ❌ Desperdício de alimentos, roupas e móveis em boas condições
- ❌ Falta de canais acessíveis para doações

### Solução Proposta
✅ Plataforma mobile que facilita:
- Cadastro de doações (alimentos, roupas, móveis)
- Gerenciamento do status (Disponível/Entregue)
- Organização de doadores e receptores em um único lugar
- Impacto social direto na redução da desigualdade

---

## 🛠️ Tecnologias Usadas

| Tecnologia | Descrição |
|-----------|-----------|
| **React Native** | Framework para desenvolvimento mobile cross-platform |
| **Expo** | Plataforma para facilitar desenvolvimento React Native |
| **React Navigation** | Navegação entre telas (Stack Navigator) |
| **AsyncStorage** | Banco de dados local para persistência de dados |
| **StyleSheet** | Sistema de estilos do React Native |

---

## ✅ Funcionalidades (CRUD Completo)

### 📝 CREATE - Criar Doação
- Tela de cadastro com formulário
- Campos: Nome do item, Categoria, Descrição, Nome do Doador
- Validação de campos obrigatórios
- Salvamento automático com data

### 📖 READ - Listar Doações
- Tela Home com listagem de todas as doações
- Cards visuais com ícones por categoria
- Exibição de status (Disponível/Entregue)
- Informações do doador e data de cadastro

### ✏️ UPDATE - Editar Status
- Tela de detalhes com informações completas
- Botão para alternar status (Disponível ↔ Entregue)
- Persistência da alteração no banco de dados

### 🗑️ DELETE - Excluir Doação
- Botão de exclusão com confirmação
- Remoção segura do registro do banco de dados
- Feedback visual ao usuário

---

## 📲 Estrutura das Telas

### Tela 1: HOME (HomeScreen)
- Lista todas as doações cadastradas
- Cada doação é um card clicável
- Botão flutuante (+) para adicionar nova doação
- Estado vazio com mensagem indicativa

### Tela 2: CADASTRAR (CreateScreen)
- Formulário para inserir nova doação
- Seletor de categoria com ícones
- Campo de descrição com múltiplas linhas
- Botão Salvar com validação

### Tela 3: DETALHES (EditScreen)
- Visualização completa da doação
- Botão para marcar como Entregue
- Botão para excluir a doação
- Confirmação antes de deletar

---

## 💾 Banco de Dados (AsyncStorage)

```json
{
  "id": "1234567890",
  "titulo": "Cestas Básicas",
  "categoria": "Alimento",
  "descricao": "5 cestas com alimentos para famílias carentes",
  "doador": "Maria Silva",
  "status": "Disponível",
  "data": "26/05/2026"
}
```

### Estrutura de Dados
- **id**: Identificador único (timestamp)
- **titulo**: Nome do item doado
- **categoria**: Alimento / Roupa / Móvel
- **descricao**: Detalhes da doação
- **doador**: Pessoa responsável pela doação
- **status**: Disponível ou Entregue
- **data**: Data do cadastro (formato BR)

---

## 🚀 Instruções para Rodar o Projeto

### ✅ Pré-requisitos
- **Node.js** (versão 14+) instalado
- **npm** ou **yarn**
- **Expo Go** no celular OU emulador Android/iOS

### 📦 Passo 1: Clonar o Repositório
```bash
git clone https://github.com/Thaiarass/AjudeAgora.git
cd AjudeAgora
```

### 📥 Passo 2: Instalar Dependências
```bash
npm install
# ou
yarn install
```

### 🧬 Passo 3: Instalar Dependências Específicas
```bash
npx expo install @react-navigation/native @react-navigation/stack
npx expo install react-native-screens react-native-safe-area-context
npx expo install @react-native-async-storage/async-storage
```

### ▶️ Passo 4: Iniciar o App
```bash
npm start
# ou
yarn start
```

### 📱 Passo 5: Testar
- **No celular**: Abra o app **Expo Go** e scaneie o QR code
- **No emulador**: Pressione `i` para iOS ou `a` para Android no terminal

---

## 🎮 Como Usar o App

### 1️⃣ Adicionar Doação
1. Clique no botão **+** na tela inicial
2. Preencha o **Nome do Item** (obrigatório)
3. Escolha a **Categoria** (Alimento, Roupa ou Móvel)
4. Adicione uma **Descrição** (opcional)
5. Digite seu **Nome** (obrigatório)
6. Clique em **💾 Salvar Doação**

### 2️⃣ Visualizar Doações
1. A tela inicial mostra todas as doações cadastradas
2. Cada card exibe ícone, nome, categoria e status
3. Clique em qualquer card para ver detalhes

### 3️⃣ Marcar como Entregue
1. Clique em uma doação para abrir detalhes
2. Clique no botão **✅ Marcar como Entregue**
3. O status muda para "Entregue" (cinza)
4. Pode voltar a marcar como "Disponível"

### 4️⃣ Excluir Doação
1. Abra os detalhes da doação
2. Clique em **🗑️ Excluir Doação**
3. Confirme a exclusão na janela de aviso
4. A doação será removida da lista

---

## 🎨 Interface Visual

- **Cores**: Azul (#2196F3) como cor principal
- **Status Ativo**: Verde (#4CAF50) para Disponível
- **Status Entregue**: Cinza (#9E9E9E) para Entregue
- **Ícones**: Emojis para cada categoria
- **Design**: Clean e intuitivo, otimizado para mobile

---

## 📁 Estrutura do Projeto

```
AjudeAgora/
├── App.js                 # Arquivo principal (3 telas + estilos)
├── package.json          # Dependências do projeto
├── .gitignore            # Arquivos ignorados pelo Git
└── README.md             # Este arquivo
```

---

## ⚙️ Dependências Principais

```json
{
  "dependencies": {
    "react": "18.x",
    "react-native": "0.72.x",
    "expo": "~49.0.0",
    "@react-navigation/native": "^6.x",
    "@react-navigation/stack": "^6.x",
    "@react-native-async-storage/async-storage": "^1.17.x",
    "react-native-screens": "^3.x",
    "react-native-safe-area-context": "^4.x"
  }
}
```

---

## 🔍 Verificação de Requisitos

| Requisito | Status |
|-----------|--------|
| App funcional em React Native | ✅ |
| CRUD (Create, Read, Update, Delete) | ✅ |
| Banco de dados (AsyncStorage) | ✅ |
| Navegação entre telas | ✅ |
| Tema com impacto social | ✅ |
| Código organizado no GitHub | ✅ |
| README detalhado | ✅ |
| Repositório público | ✅ |

---

## 💡 Melhorias Futuras

- [ ] Integração com backend (Firebase/API)
- [ ] Autenticação de usuários
- [ ] Mapa com localização das doações
- [ ] Sistema de avaliação de doadores
- [ ] Notificações em tempo real
- [ ] Filtros avançados de busca
- [ ] Compartilhamento em redes sociais

---

## 📞 Suporte

Para dúvidas ou issues, abra uma **Issue** no repositório GitHub.

---

## 📄 Licença

Este projeto é de código aberto e disponível para fins educacionais.

---

**Desenvolvido com ❤️ para impacto social**

Repositório: https://github.com/Thaiarass/AjudeAgora
