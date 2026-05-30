# AjudeAgora - Plataforma de Doações

## 👥 Integrantes do Grupo
- **Thaiara Santana** (RA: 202402541031)

---

## 🌍 Descrição do Problema Social

O aplicativo **AjudeAgora** foi desenvolvido para conectar pessoas que desejam doar alimentos, roupas e móveis a pessoas ou instituições que precisam desses recursos.

### Problema Social Atendido
- Desperdício de itens em boas condições
- Falta de canais simples para organizar doações
- Dificuldade de conectar doadores e necessidades reais da comunidade

### Solução Proposta
O app permite cadastrar, visualizar, editar e excluir doações, organizando as informações em uma interface simples e acessível no celular.

---

## 🛠️ Tecnologias Utilizadas

- **React Native**
- **Expo**
- **React Navigation (Stack Navigator)**
- **AsyncStorage** para persistência de dados
- **StyleSheet**

---

## ✅ Funcionalidades (CRUD)

### CREATE
- Cadastro de novas doações
- Campos: item, categoria, descrição e doador

### READ
- Listagem de todas as doações cadastradas

### UPDATE
- Edição completa da doação:
  - Nome do item
  - Categoria
  - Descrição
  - Nome do doador
  - Status (Disponível / Entregue)

### DELETE
- Exclusão de doações com confirmação

---

## 📲 Telas do Aplicativo

### 🏠 Home
- Lista todas as doações
- Exibe informações principais
- Botão "+" para nova doação

### 📝 Nova Doação
- Formulário de cadastro
- Validação de campos obrigatórios

### ✏️ Editar Doação
- Permite editar informações completas
- Permite alterar status
- Permite excluir registro

---

## 💾 Persistência de Dados

Os dados são armazenados localmente no dispositivo utilizando **AsyncStorage**.

### Estrutura dos dados:

```json
{
  "id": "1717099912345",
  "titulo": "Cestas Básicas",
  "categoria": "Alimento",
  "descricao": "5 cestas com alimentos",
  "doador": "Maria Silva",
  "status": "Disponível",
  "data": "30/05/2026",
  "createdAt": 1717099912345
}
``
