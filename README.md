# 🎁 AjudeAgora - Plataforma de Doações

## 👥 Integrantes do Grupo
- **Thaiara Santana** (RA: 202402541031)

---

## 🌍 Descrição do Problema Social

O aplicativo **AjudeAgora** foi desenvolvido para conectar pessoas que desejam doar alimentos, roupas e móveis a pessoas ou instituições que precisam desses recursos.

### Problema Social Atendido
- **Desperdício de itens em boas condições**: Muitos itens são descartados quando ainda poderiam ser utilizados
- **Falta de canais simples para organizar doações**: Dificuldade em cadastrar e gerir doações de forma centralizada
- **Dificuldade de conectar doadores e necessidades reais da comunidade**: Não há uma plataforma acessível para facilitar este encontro

### Solução Proposta
O app permite cadastrar, visualizar, editar e excluir doações, organizando as informações em uma interface simples, intuitiva e acessível no celular. A plataforma centraliza todas as doações em um único lugar, facilitando o gerenciamento e a rastreabilidade das mesmas.

---

## 🛠️ Tecnologias Utilizadas

- **React Native** - Framework híbrido para desenvolvimento mobile
- **Expo** - Plataforma para desenvolvimento e deploy de apps React Native
- **React Navigation (Stack Navigator)** - Navegação entre telas
- **AsyncStorage** - Persistência de dados local (banco de dados)
- **StyleSheet** - Estilização de componentes
- **Picker** - Seletor de categorias e status

---

## ✅ Funcionalidades (CRUD Completo)

### 📝 CREATE - Criar Doação
- Cadastro de novas doações com formulário completo
- Campos obrigatórios:
  - **Item**: Nome do item a ser doado
  - **Categoria**: Seleção entre Alimento, Roupa, Móvel, Eletrônicos, Livros ou Outro
  - **Descrição**: Detalhes completos sobre o item
  - **Doador**: Nome completo de quem está doando
- Campo opcional:
  - **Status**: Padrão "Disponível" (pode ser alterado para "Entregue")
- Data de criação é registrada automaticamente

### 📖 READ - Listar Doações
- Tela Home exibe todas as doações cadastradas
- Mostra para cada doação:
  - Nome do item
  - Categoria (com ícone 📦)
  - Descrição resumida
  - Nome do doador (com ícone 👤)
  - Status em badge colorido:
    - Azul para "Disponível"
    - Verde para "Entregue"
  - Data de cadastro
- Clique em qualquer doação para editar

### ✏️ UPDATE - Editar Doação
- Tela de edição permite modificar todos os campos:
  - Nome do item
  - Categoria
  - Descrição
  - Nome do doador
  - Status (Disponível ou Entregue)
- Exibe a data original de cadastro
- Validação de campos obrigatórios
- Mensagem de sucesso ao atualizar

### 🗑️ DELETE - Deletar Doação
- Exclusão com confirmação de segurança
- Garante que não haja deleção acidental
- Mensagem de sucesso ao deletar

---

## 📲 Telas do Aplicativo

### 🏠 Home (Tela Principal)
- **Função**: Listar todas as doações cadastradas
- **Componentes**:
  - Título "AjudeAgora" com ícone de presente (🎁)
  - Subtítulo "Plataforma de Doações"
  - Cards com informações completas de cada doação
  - Botão "+ Nova Doação" para criar novas doações
  - Mensagem "Nenhuma doação cadastrada" quando vazio

### ➕ Nova Doação (Tela de Criação)
- **Função**: Formulário para cadastrar novas doações
- **Campos**:
  - Campo de texto para o item
  - Picker (seletor dropdown) para categoria
  - Campo de texto multilinha para descrição
  - Campo de texto para nome do doador
  - Picker para status (padrão: Disponível)
- **Ações**:
  - Botão "💾 Salvar Doação" para confirmar
  - Botão "Cancelar" para voltar sem salvar
  - Validação de campos obrigatórios

### ✏️ Editar Doação
- **Função**: Modificar informações de uma doação existente
- **Campos**: Mesmos da tela de criação
- **Informações Extras**:
  - Exibe a data original de cadastro
- **Ações**:
  - Botão "✏️ Atualizar" para salvar alterações
  - Botão "🗑️ Excluir" para deletar a doação
  - Botão "Cancelar" para voltar sem salvar

---

## 💾 Persistência de Dados

Os dados são armazenados **localmente no dispositivo** utilizando **AsyncStorage**, garantindo privacidade e funcionamento offline.

### Estrutura dos Dados:

```json
{
  "id": "1717099912345",
  "titulo": "Cestas Básicas",
  "categoria": "Alimento",
  "descricao": "5 cestas com alimentos diversos e não perecíveis",
  "doador": "Maria Silva",
  "status": "Disponível",
  "data": "01/06/2026",
  "createdAt": 1717099912345
}
```

### Campos:
- **id**: Identificador único (baseado em timestamp)
- **titulo**: Nome do item doado
- **categoria**: Tipo de item (Alimento, Roupa, Móvel, Eletrônicos, Livros, Outro)
- **descricao**: Detalhes completos do item
- **doador**: Nome de quem está doando
- **status**: Estado da doação (Disponível ou Entregue)
- **data**: Data de criação da doação (formato: DD/MM/YYYY)
- **createdAt**: Timestamp da criação (para ordenação)

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos:
- Node.js instalado
- npm ou yarn
- Expo CLI instalado globalmente: `npm install -g expo-cli`

### Passos:

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/Thaiarass/AjudeAgora.git
   cd AjudeAgora
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Inicie o aplicativo**:
   ```bash
   expo start
   ```

4. **Execute no emulador ou dispositivo**:
   - **Android**: Pressione `a` no terminal ou escaneie o QR code com seu dispositivo
   - **iOS**: Pressione `i` no terminal (apenas em macOS)

### Alternativa com Expo Go:
- Baixe o app "Expo Go" na Play Store ou App Store
- Escaneie o QR code gerado ao executar `expo start`

---

## 📋 Requisitos Técnicos Atendidos

✅ **Framework**: React Native com Expo  
✅ **Navegação**: React Navigation (Stack Navigator)  
✅ **Persistência**: AsyncStorage para banco de dados local  
✅ **CRUD Completo**: Create, Read, Update e Delete funcionais  
✅ **Interface**: Layout responsivo e intuitivo  
✅ **Componentização**: Código bem estruturado em componentes  
✅ **Hooks**: Uso adequado de useState, useCallback e useFocusEffect  
✅ **Versionamento**: Git/GitHub com commits organizados  
✅ **Validação**: Campos obrigatórios validados  
✅ **Tema Social**: Foco em solidariedade e doações comunitárias  

---

## 🎨 Detalhes de Design

- **Paleta de Cores**:
  - Azul (#007bff) - Cor principal e destaque
  - Vermelho (#dc3545) - Botão de exclusão
  - Verde (#28a745) - Status "Entregue"
  - Cinza (#6c757d) - Botão cancelar
  - Fundo claro (#f8f9fa) - Melhor legibilidade

- **Tipografia**: Fontes claras e tamanhos adequados para leitura em dispositivos móveis

- **Ícones e Emojis**: Uso estratégico para melhor UX e identificação visual rápida

---

## 📝 Notas de Desenvolvimento

- O app funciona completamente offline
- Dados são salvos automaticamente após cada operação
- Confirmação visual com alerts ao criar, atualizar ou deletar
- Interface responsiva para diferentes tamanhos de dispositivo
- Código comentado e bem estruturado para manutenção futura
