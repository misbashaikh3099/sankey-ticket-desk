const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8085';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function generateSmartReply(
  title: string,
  description: string,
  messages: Message[] = []
): Promise<string> {

  const response = await fetch(`${BACKEND_URL}/api/ai/reply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, description, messages }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error('Backend Error:', err);
    throw new Error('API_ERROR');
  }

  return await response.text();
}