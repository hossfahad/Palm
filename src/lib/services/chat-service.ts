export type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export type ChatResponse = {
  choices: Array<{
    message: Message;
  }>;
};

export class ChatService {
  private static async fetchAPI(messages: Message[]): Promise<ChatResponse> {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch chat response');
    }

    return response.json();
  }

  static async sendMessage(messages: Message[]): Promise<Message> {
    try {
      const response = await this.fetchAPI(messages);
      return response.choices[0].message;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
} 