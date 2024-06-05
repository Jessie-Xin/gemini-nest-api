declare namespace ChatModuleType {
  interface ChatMessagePart {
    text: string;
  }

  interface ChatMessage {
    role: 'user' | 'model';
    parts: ChatMessagePart[];
  }
}
