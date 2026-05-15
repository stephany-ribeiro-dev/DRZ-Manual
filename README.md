# DRZ – Consulta MC-70 | Teste Técnico Full Stack + IA

Mini aplicação Full Stack com React + TypeScript (Vite) no frontend e Node.js + Express no backend, integrada ao Google Gemini para responder perguntas exclusivamente com base no Manual do Elevador MC-70.

---

## 📁 Estrutura do Projeto

```
drz-test-fixed/
├── backend/
│   ├── src/
│   │   └── index.js        ← API Express (endpoints /upload-text e /ask)
│   ├── .env        ← modelo do arquivo de variáveis de ambiente
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── UploadScreen.tsx   ← Tela 1: enviar texto
│   │   │   └── ChatScreen.tsx     ← Tela 2: perguntas e respostas
│   │   ├── services/
│   │   │   └── api.ts             ← chamadas ao backend
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   └── package.json
└── README.md
```

---

## 🔑 Pré-requisito: Chave de API do Gemini (gratuita)

1. Acesse https://aistudio.google.com/app/apikey
2. Faça login com uma conta Google
3. Clique em **"Create API key"**
4. Copie a chave gerada

---

## 🚀 Passo a Passo para Rodar no VS Code

### 1. Abrir o projeto

1. Extraia o arquivo `.zip`
2. No VS Code: **File → Open Folder** → selecione a pasta `drz-test-fixed`

---

### 2. Configurar o Backend

**Abra um terminal no VS Code** (`Ctrl + `` ` `` ` ou **Terminal → New Terminal**)

```bash
# Entrar na pasta do backend
cd backend

# Instalar dependências
npm install

# Criar o arquivo de variáveis de ambiente
cp .env
```

Agora **abra o arquivo `backend/.env`** e substitua pela sua chave:

```env
GEMINI_API_KEY=SUA_CHAVE_AQUI
PORT=3001
```

**Iniciar o backend:**

```bash
npm run dev
```

Você verá no terminal:
```
🚀 Backend rodando em http://localhost:3001
```

> Deixe este terminal aberto.

---

### 3. Configurar o Frontend

**Abra um segundo terminal** no VS Code (`Ctrl + Shift + `` ` `` ` → Split ou New Terminal)

```bash
# Entrar na pasta do frontend
cd frontend

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

Você verá:
```
  VITE v5.x.x  ready in Xms

  ➜  Local:   http://localhost:5173/
```

---

### 4. Usar a Aplicação

1. **Abra o navegador** em `http://localhost:5173`
2. Na **Tela 1** o texto do manual já vem preenchido — clique em **"Enviar Texto para a IA"**
3. Após o envio, você será redirecionado para a **Tela 2**
4. Digite qualquer pergunta sobre o MC-70 e clique em **"Perguntar"**

---

## 🔌 Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/upload-text` | Recebe `{ text: string }` e armazena em memória |
| `POST` | `/ask` | Recebe `{ question: string }` e retorna `{ answer: string }` |
| `GET`  | `/health` | Status do servidor e se há texto carregado |

---

## 🧠 Decisões Técnicas

### Backend
- **Node.js + Express** – leve, sem necessidade de banco de dados (texto em memória conforme especificado)
- **Gemini 1.5 Flash** – modelo gratuito e rápido do Google AI Studio
- **Temperature 0.1** – respostas mais precisas e menos criativas, ideal para RAG
- **Prompt restritivo** – instrução explícita para responder apenas com base no texto fornecido

### Frontend
- **React + TypeScript + Vite** – setup moderno, tipagem segura, DX rápida
- **Identidade visual DRZ** – paleta dark navy/verde neón, tipografia Rajdhani + Share Tech Mono, grid overlay e efeitos de scanline
- **Sem bibliotecas de UI** – 100% CSS customizado para manter a identidade da marca
- **UX em 2 telas** – fluxo claro: carregar texto → consultar IA

---

## ⚙️ Versões Necessárias

- Node.js 18+ (recomendado 20+)
- npm 9+

Para verificar: `node -v && npm -v`
