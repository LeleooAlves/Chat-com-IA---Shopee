export const generateResponse = async (prompt: string, history: any[] = []): Promise<{ text: string, history: any[] }> => {
  const response = await fetch('http://localhost:3001/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, history }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Erro na API');
  return data;
}; 