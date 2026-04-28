import type {
  ChatMessage,
  ChatSnapshot,
  ChatThread,
  Participant,
  ParticipantId,
} from "@/lib/chat-types";

const participants: Record<ParticipantId, Participant> = {
  jane: {
    id: "jane",
    name: "Jane Smith",
    detail: "Owner",
    accent: "bg-indigo-200",
  },
  jhon: {
    id: "jhon",
    name: "Jhon Smith",
    detail: "You",
    accent: "bg-violet-200",
  },
};

const threads: ChatThread[] = [
  {
    id: "chat-group",
    label: "jane x threads team",
    isGroup: true,
    memberIds: ["jane", "jhon"],
  },
  {
    id: "chat-direct",
    label: "Direct",
    isGroup: false,
    memberIds: ["jane", "jhon"],
  },
];

const messagesByChatId: Record<string, ChatMessage[]> = {
  "chat-group": [
    {
      id: "seed-group-1",
      chatId: "chat-group",
      senderId: "jane",
      text: "Morning team! Let's test this thread.",
      createdAt: 1,
    },
    {
      id: "seed-group-2",
      chatId: "chat-group",
      senderId: "jhon",
      text: "Looks good. I can send here.",
      createdAt: 2,
    },
  ],
  "chat-direct": [
    {
      id: "seed-direct-1",
      chatId: "chat-direct",
      senderId: "jane",
      text: "Ping! This direct thread is shared by both of us.",
      createdAt: 3,
    },
    {
      id: "seed-direct-2",
      chatId: "chat-direct",
      senderId: "jhon",
      text: "Yep, now DM should sync in both tabs.",
      createdAt: 4,
    },
  ],
};

let nextMessageSequence = 5;

export function viewerIdFromRouteId(routeId: string): ParticipantId | null {
  if (routeId === "1") {
    return "jhon";
  }

  if (routeId === "2") {
    return "jane";
  }

  return null;
}

export function getSnapshotForViewer(viewerId: ParticipantId): ChatSnapshot {
  const defaultChatId = "chat-direct";

  return {
    viewerId,
    participants,
    threads,
    messagesByChatId,
    defaultChatId,
  };
}

export function getThread(threadId: string): ChatThread | null {
  return threads.find((thread) => thread.id === threadId) ?? null;
}

export function getThreadMessages(threadId: string): ChatMessage[] {
  return messagesByChatId[threadId] ?? [];
}

export function appendThreadMessage(
  threadId: string,
  senderId: ParticipantId,
  text: string,
): ChatMessage {
  const trimmedText = text.trim();
  const message: ChatMessage = {
    id: `${threadId}-${nextMessageSequence}`,
    chatId: threadId,
    senderId,
    text: trimmedText,
    createdAt: nextMessageSequence,
  };

  nextMessageSequence += 1;
  const existingMessages = messagesByChatId[threadId] ?? [];
  messagesByChatId[threadId] = [...existingMessages, message];

  return message;
}
