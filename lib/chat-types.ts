export type ParticipantId = "jane" | "jhon";
export type ViewerRouteId = "1" | "2";

export type Participant = {
  id: ParticipantId;
  name: string;
  detail: string;
  accent: string;
};

export type ChatThread = {
  id: string;
  label: string;
  isGroup: boolean;
  memberIds: ParticipantId[];
};

export type ChatMessage = {
  id: string;
  chatId: string;
  senderId: ParticipantId;
  text: string;
  createdAt: number;
};

export type ChatSnapshot = {
  viewerId: ParticipantId;
  participants: Record<ParticipantId, Participant>;
  threads: ChatThread[];
  messagesByChatId: Record<string, ChatMessage[]>;
  defaultChatId: string;
};

export type SendMessageRequest = {
  senderId: ParticipantId;
  text: string;
};
