require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// In-memory storage for the base text
let storedText = '';

// POST /upload-text
app.post('/upload-text', (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return res.status(400).json({ error: 'Campo "text" é obrigatório e não pode estar vazio.' });
  }
  storedText = text.trim();
  console.log(`[upload-text] Texto armazenado: ${storedText.length} caracteres.`);
  return res.json({ message: 'Texto armazenado com sucesso.', length: storedText.length });
});

// POST /ask
app.post('/ask', async (req, res) => {
  const { question } = req.body;

  if (!question || typeof question !== 'string' || question.trim() === '') {
    return res.status(400).json({ error: 'Campo "question" é obrigatório.' });
  }

  if (!storedText) {
    return res.status(400).json({ error: 'Nenhum texto-base foi carregado. Use /upload-text primeiro.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY não configurada no servidor.' });
  }

  const prompt = `Você é um assistente técnico especializado. Responda APENAS com base no texto abaixo.
Se a resposta não estiver contida no texto, responda exatamente: "Não sei com base nas informações fornecidas."
Não invente informações. Não use conhecimento externo.

TEXTO-BASE:
"""
${storedText}
"""

PERGUNTA DO USUÁRIO:
${question.trim()}

RESPOSTA:`;

  try {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!geminiRes.ok) {
      const errBody = await geminiRes.text();
      console.error('[ask] Gemini error:', errBody);
      return res.status(502).json({ error: 'Erro ao comunicar com a API do Gemini.', details: errBody });
    }

    const data = await geminiRes.json();
    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Não foi possível obter uma resposta.';

    console.log(`[ask] Pergunta: "${question}" | Resposta: "${answer.substring(0, 80)}..."`);
    return res.json({ answer: answer.trim() });
  } catch (err) {
    console.error('[ask] Erro interno:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.', details: err.message });
  }
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', textLoaded: storedText.length > 0 }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n🚀 Backend rodando em http://localhost:${PORT}`);
  console.log(`   Endpoints disponíveis:`);
  console.log(`   POST http://localhost:${PORT}/upload-text`);
  console.log(`   POST http://localhost:${PORT}/ask`);
  console.log(`   GET  http://localhost:${PORT}/health\n`);
});
