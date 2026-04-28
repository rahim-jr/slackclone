import { useCallback, useEffect, useState } from "react";
import { fetchUserSnapshot } from "@/lib/chat-api";
import type {
  ChatMessage,
  ChatThread,
  Participant,
  ParticipantId,
  ViewerRouteId,
} from "@/lib/chat-types";

type UseChatSnapshotPollingArgs = {
  viewerRouteId: ViewerRouteId;
  initialParticipants: Record<ParticipantId, Participant>;
  initialThreads: ChatThread[];
  initialMessagesByChatId: Record<string, ChatMessage[]>;
  initialViewerId: ParticipantId;
  initialActiveChatId: string;
};

export function useChatSnapshotPolling({
  viewerRouteId,
  initialParticipants,
  initialThreads,
  initialMessagesByChatId,
  initialViewerId,
  initialActiveChatId,
}: UseChatSnapshotPollingArgs) {
  const [participantsState, setParticipantsState] =
    useState<Record<ParticipantId, Participant>>(initialParticipants);
  const [chatThreadsState, setChatThreadsState] =
    useState<ChatThread[]>(initialThreads);
  const [viewerId, setViewerId] = useState<ParticipantId>(initialViewerId);
  const [messagesByChatId, setMessagesByChatId] = useState<
    Record<string, ChatMessage[]>
  >(initialMessagesByChatId);
  const [activeChatId, setActiveChatId] = useState(initialActiveChatId);

  const loadSnapshot = useCallback(async () => {
    const snapshot = await fetchUserSnapshot(viewerRouteId);
    if (!snapshot) {
      return;
    }

    setViewerId(snapshot.viewerId);
    setParticipantsState(snapshot.participants);
    setChatThreadsState(snapshot.threads);
    setMessagesByChatId(snapshot.messagesByChatId);

    const visibleThreadIds = snapshot.threads.map((thread) => thread.id);
    const fallbackThreadId = visibleThreadIds[0] ?? snapshot.defaultChatId;

    setActiveChatId((previousChatId) =>
      visibleThreadIds.includes(previousChatId)
        ? previousChatId
        : fallbackThreadId,
    );
  }, [viewerRouteId]);

  useEffect(() => {
    const initialTimerId = window.setTimeout(() => {
      void loadSnapshot();
    }, 0);
    const timerId = window.setInterval(() => {
      void loadSnapshot();
    }, 1200);

    return () => {
      window.clearTimeout(initialTimerId);
      window.clearInterval(timerId);
    };
  }, [loadSnapshot]);

  return {
    activeChatId,
    setActiveChatId,
    chatThreadsState,
    loadSnapshot,
    messagesByChatId,
    participantsState,
    viewerId,
  };
}
