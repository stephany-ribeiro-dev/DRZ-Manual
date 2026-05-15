const BASE_URL = 'http://localhost:3001';

export async function uploadText(text: string): Promise<{ message: string; length: number }> {
  const res = await fetch(`${BASE_URL}/upload-text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erro desconhecido' }));
    throw new Error(err.error || 'Falha ao enviar texto');
  }
  return res.json();
}

export async function askQuestion(question: string): Promise<{ answer: string }> {
  const res = await fetch(`${BASE_URL}/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erro desconhecido' }));
    throw new Error(err.error || 'Falha ao obter resposta');
  }
  return res.json();
}
