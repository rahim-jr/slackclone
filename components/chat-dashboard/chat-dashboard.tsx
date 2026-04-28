"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChatComposer } from "@/components/chat-dashboard/chat-composer";
import { ChatDetailsPanel } from "@/components/chat-dashboard/chat-details-panel";
import { ChatHeader } from "@/components/chat-dashboard/chat-header";
import { ChatMessageList } from "@/components/chat-dashboard/chat-message-list";
import { ChatSidebar } from "@/components/chat-dashboard/chat-sidebar";
import { useChatSnapshotPolling } from "@/components/chat-dashboard/hooks/use-chat-snapshot-polling";
import { useSwipePanels } from "@/components/chat-dashboard/hooks/use-swipe-panels";
import { getDicebearAvatar } from "@/components/chat-dashboard/dicebear-avatar";
import { postChatMessage } from "@/lib/chat-api";
import { getThreadLabel, getViewerRouteId } from "@/lib/chat-utils";
import type {
  ChatMessage,
  ChatThread,
  Participant,
  ParticipantId,
  ViewerRouteId,
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

const chatThreads: ChatThread[] = [
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

const initialMessagesByChatId: Record<string, ChatMessage[]> = {
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

export function ChatDashboard() {
  const searchParams = useSearchParams();
  const viewerRouteId: ViewerRouteId = getViewerRouteId(searchParams.get("viewer"));
  const initialViewerId: ParticipantId = viewerRouteId === "2" ? "jane" : "jhon";

  const {
    activeChatId,
    setActiveChatId,
    chatThreadsState,
    loadSnapshot,
    messagesByChatId,
    participantsState,
    viewerId,
  } = useChatSnapshotPolling({
    viewerRouteId,
    initialParticipants: participants,
    initialThreads: chatThreads,
    initialMessagesByChatId: initialMessagesByChatId,
    initialViewerId,
    initialActiveChatId: "chat-direct",
  });

  const [draftByChatId, setDraftByChatId] = useState<Record<string, string>>({
    "chat-group": "",
    "chat-direct": "",
  });
  const {
    closePanels,
    handleTouchEnd,
    handleTouchStart,
    isLeftPanelOpen,
    isRightPanelOpen,
    openLeftPanel,
    openRightPanel,
    setIsLeftPanelOpen,
    setIsRightPanelOpen,
  } = useSwipePanels();

  const account = participantsState[viewerId] ?? participantsState.jhon;
  const sidebarAvatarSrc = getDicebearAvatar(account.name);
  const visibleThreads = chatThreadsState;
  const activeThread =
    visibleThreads.find((thread) => thread.id === activeChatId) ??
    visibleThreads[0] ??
    chatThreadsState[0] ??
    chatThreads[0];
  const activeMessages = messagesByChatId[activeThread.id] ?? [];
  const activeDraft = draftByChatId[activeThread.id] ?? "";
  const activeMembers = activeThread.memberIds.map(
    (memberId) => participantsState[memberId],
  );

  // Push a non-empty message into the active thread, then clear that thread draft.
  const handleSendMessage = async () => {
    const trimmedMessage = activeDraft.trim();

    if (!trimmedMessage) {
      return;
    }

    setDraftByChatId((previousDraftByChatId) => ({
      ...previousDraftByChatId,
      [activeThread.id]: "",
    }));

    const sent = await postChatMessage(activeThread.id, {
      senderId: viewerId,
      text: trimmedMessage,
    });

    if (!sent) {
      return;
    }

    await loadSnapshot();
  };

  return (
    <main className="min-h-screen bg-[#f6f6f7] p-2 sm:p-3">
      {/* Backdrop for slide-over side panels on small/medium screens. */}
      {(isLeftPanelOpen || isRightPanelOpen) && (
        <button
          type="button"
          aria-label="Close side panel"
          className="fixed inset-0 z-30 bg-black/30 xl:hidden"
          onClick={closePanels}
        />
      )}

      <div className="mx-auto grid h-[calc(100vh-1rem)] w-full max-w-full grid-cols-1 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm sm:h-[calc(100vh-1.5rem)] xl:grid-cols-[260px_minmax(0,1fr)_280px]">
        <ChatSidebar
          isLeftPanelOpen={isLeftPanelOpen}
          visibleThreads={visibleThreads}
          activeThreadId={activeThread.id}
          viewerId={viewerId}
          participantsById={participantsState}
          accountName={account.name}
          sidebarAvatarSrc={sidebarAvatarSrc}
          onCloseLeftPanel={() => setIsLeftPanelOpen(false)}
          onSelectThread={setActiveChatId}
        />

        {/* Center panel: active conversation header, messages, and composer. */}
        <section
          className="flex min-w-0 flex-1 flex-col"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <ChatHeader
            activeThread={activeThread}
            viewerId={viewerId}
            participantsById={participantsState}
            onOpenLeftPanel={openLeftPanel}
            onOpenRightPanel={openRightPanel}
          />

          <div className="flex min-h-0 flex-1 flex-col">
            <ChatMessageList
              activeThread={activeThread}
              activeMessages={activeMessages}
              viewerId={viewerId}
              participantsById={participantsState}
            />
            <ChatComposer
              placeholder={`Message ${getThreadLabel(activeThread, viewerId, participantsState)}`}
              draft={activeDraft}
              onDraftChange={(value) =>
                setDraftByChatId((previousDraftByChatId) => ({
                  ...previousDraftByChatId,
                  [activeThread.id]: value,
                }))
              }
              onSubmit={() => {
                void handleSendMessage();
              }}
            />
          </div>
        </section>

        <ChatDetailsPanel
          isRightPanelOpen={isRightPanelOpen}
          activeMembers={activeMembers}
          viewerId={viewerId}
          onCloseRightPanel={() => setIsRightPanelOpen(false)}
        />
      </div>
    </main>
  );
}
