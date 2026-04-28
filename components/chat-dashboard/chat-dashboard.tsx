"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Avatar, ScrollArea, Separator } from "radix-ui";
import {
  LuArrowRight,
  LuAtSign,
  LuAudioLines,
  LuCalendarDays,
  LuChevronDown,
  LuClock3,
  LuEllipsis,
  LuFileText,
  LuHash,
  LuMail,
  LuPlus,
  LuPuzzle,
  LuRefreshCw,
  LuSettings2,
  LuSquareChevronLeft,
  LuSquareChevronRight,
  LuUserRound,
  LuUsers,
  LuX,
  LuZap,
} from "react-icons/lu";
import {
  ComposerAction,
  MemberItem,
  NavItem,
} from "@/components/chat-dashboard";
import { getDicebearAvatar } from "@/components/chat-dashboard/dicebear-avatar";

type ParticipantId = "jane" | "jhon";

type Participant = {
  id: ParticipantId;
  name: string;
  detail: string;
  accent: string;
};

type ChatThread = {
  id: string;
  label: string;
  isGroup: boolean;
  memberIds: ParticipantId[];
};

type ChatMessage = {
  id: string;
  chatId: string;
  senderId: ParticipantId;
  text: string;
  createdAt: number;
};

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

type SnapshotResponse = {
  viewerId: ParticipantId;
  participants: Record<ParticipantId, Participant>;
  threads: ChatThread[];
  messagesByChatId: Record<string, ChatMessage[]>;
  defaultChatId: string;
};

function getViewerRouteId(viewerParam: string | null): "1" | "2" {
  return viewerParam === "2" ? "2" : "1";
}

function getThreadLabel(
  thread: ChatThread,
  viewerId: ParticipantId,
  participantsById: Record<ParticipantId, Participant>,
): string {
  if (thread.isGroup) {
    return thread.label;
  }

  const otherMemberId = thread.memberIds.find(
    (memberId) => memberId !== viewerId,
  );
  return otherMemberId
    ? (participantsById[otherMemberId]?.name ?? thread.label)
    : thread.label;
}

export function ChatDashboard() {
  const searchParams = useSearchParams();
  const viewerRouteId = getViewerRouteId(searchParams.get("viewer"));

  const [participantsState, setParticipantsState] =
    useState<Record<ParticipantId, Participant>>(participants);
  const [chatThreadsState, setChatThreadsState] =
    useState<ChatThread[]>(chatThreads);
  const [viewerId, setViewerId] = useState<ParticipantId>(
    viewerRouteId === "2" ? "jane" : "jhon",
  );

  // Local in-memory thread/message state for UI-only chat simulation.
  const [activeChatId, setActiveChatId] = useState("chat-direct");
  const [draftByChatId, setDraftByChatId] = useState<Record<string, string>>({
    "chat-group": "",
    "chat-direct": "",
  });
  const [messagesByChatId, setMessagesByChatId] = useState<
    Record<string, ChatMessage[]>
  >(initialMessagesByChatId);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

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

  const loadSnapshot = useCallback(async () => {
    const response = await fetch(`/api/v1/users/${viewerRouteId}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return;
    }

    const snapshot = (await response.json()) as SnapshotResponse;
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

    const response = await fetch(`/api/v1/chats/${activeThread.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        senderId: viewerId,
        text: trimmedMessage,
      }),
    });

    if (!response.ok) {
      return;
    }

    await loadSnapshot();
  };

  // Open left/right panels with a horizontal swipe on smaller screens.
  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    setTouchStartX(event.changedTouches[0]?.clientX ?? null);
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    if (touchStartX === null) {
      return;
    }

    const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX;
    const swipeDistance = touchEndX - touchStartX;
    const swipeThreshold = 70;

    if (swipeDistance > swipeThreshold) {
      setIsLeftPanelOpen(true);
      setIsRightPanelOpen(false);
    } else if (swipeDistance < -swipeThreshold) {
      setIsRightPanelOpen(true);
      setIsLeftPanelOpen(false);
    }

    setTouchStartX(null);
  };

  return (
    <main className="min-h-screen bg-[#f6f6f7] p-2 sm:p-3">
      {/* Backdrop for slide-over side panels on small/medium screens. */}
      {(isLeftPanelOpen || isRightPanelOpen) && (
        <button
          type="button"
          aria-label="Close side panel"
          className="fixed inset-0 z-30 bg-black/30 xl:hidden"
          onClick={() => {
            setIsLeftPanelOpen(false);
            setIsRightPanelOpen(false);
          }}
        />
      )}

      <div className="mx-auto grid h-[calc(100vh-1rem)] w-full max-w-full grid-cols-1 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm sm:h-[calc(100vh-1.5rem)] xl:grid-cols-[260px_minmax(0,1fr)_280px]">
        {/* Left sidebar: workspace navigation, chats, channels, and integrations. */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-[260px] min-h-0 flex-col border-r border-zinc-200 bg-zinc-50/95 shadow-xl transition-transform duration-300 xl:static xl:w-auto xl:translate-x-0 xl:bg-zinc-50/70 xl:shadow-none ${
            isLeftPanelOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-lg font-bold text-zinc-800">Janes Studio</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="text-zinc-500 hover:text-zinc-700"
              >
                <LuChevronDown className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Close left sidebar"
                className="text-zinc-500 hover:text-zinc-700 xl:hidden"
                onClick={() => setIsLeftPanelOpen(false)}
              >
                <LuX className="h-4 w-4" />
              </button>
            </div>
          </div>

          <ScrollArea.Root className="min-h-0 flex-1 overflow-hidden">
            <ScrollArea.Viewport className="h-full w-full px-2 pb-3">
              <div className="space-y-1 px-2">
                <NavItem
                  label="Unread"
                  count={1}
                  icon={<LuMail className="h-4 w-4" />}
                />
                <NavItem
                  label="Threads"
                  icon={<LuUsers className="h-4 w-4" />}
                />
                <NavItem
                  label="Drafts"
                  icon={<LuFileText className="h-4 w-4" />}
                />
              </div>

              <Separator.Root className="mx-2 my-3 h-px bg-zinc-200" />

              <div className="px-2">
                <p className="px-1 pb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Chat
                </p>
                <div className="space-y-1">
                  {visibleThreads.map((thread) => (
                    <NavItem
                      key={thread.id}
                      label={getThreadLabel(
                        thread,
                        viewerId,
                        participantsState,
                      )}
                      active={thread.id === activeThread.id}
                      icon={
                        thread.isGroup ? (
                          <LuUsers className="h-4 w-4" />
                        ) : (
                          <LuUserRound className="h-4 w-4" />
                        )
                      }
                      onClick={() => setActiveChatId(thread.id)}
                    />
                  ))}
                </div>
              </div>

              <Separator.Root className="mx-2 my-3 h-px bg-zinc-200" />

              <div className="px-2">
                <p className="px-1 pb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Channels
                </p>
                <div className="space-y-1">
                  <NavItem
                    label="general"
                    icon={<LuHash className="h-4 w-4" />}
                  />
                  <NavItem
                    label="Add channel"
                    icon={<LuPlus className="h-4 w-4" />}
                  />
                </div>
              </div>

              <Separator.Root className="mx-2 my-3 h-px bg-zinc-200" />

              <div className="px-2">
                <p className="px-1 pb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Apps
                </p>
                <div className="space-y-1">
                  <NavItem
                    label="Google Calendar"
                    icon={<LuCalendarDays className="h-4 w-4" />}
                  />
                  <NavItem
                    label="Add integration"
                    icon={<LuPuzzle className="h-4 w-4" />}
                  />
                </div>
              </div>
            </ScrollArea.Viewport>
          </ScrollArea.Root>

          <div className="flex items-center justify-between border-t border-zinc-200 px-4 py-3">
            <div className="flex min-w-0 items-center gap-2">
              <Avatar.Root className="inline-flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-zinc-200">
                <Avatar.Image
                  className="h-full w-full object-cover"
                  src={sidebarAvatarSrc}
                  alt="Account avatar"
                />
                <Avatar.Fallback className="text-xs font-semibold text-zinc-700">
                  JM
                </Avatar.Fallback>
              </Avatar.Root>
              <p className="truncate text-sm text-zinc-700">{account.name}</p>
            </div>
            <button type="button" className="text-zinc-400 hover:text-zinc-700">
              <LuSettings2 className="h-4 w-4" />
            </button>
          </div>
        </aside>

        {/* Center panel: active conversation header, messages, and composer. */}
        <section
          className="flex min-w-0 flex-1 flex-col"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <header className="flex h-14 items-center justify-between border-b border-zinc-200 px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex items-center gap-2 xl:hidden">
                <button
                  type="button"
                  aria-label="Open left sidebar"
                  className="text-zinc-400 hover:text-zinc-700"
                  onClick={() => {
                    setIsLeftPanelOpen(true);
                    setIsRightPanelOpen(false);
                  }}
                >
                  <LuSquareChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Open right sidebar"
                  className="text-zinc-400 hover:text-zinc-700"
                  onClick={() => {
                    setIsRightPanelOpen(true);
                    setIsLeftPanelOpen(false);
                  }}
                >
                  <LuSquareChevronRight className="h-5 w-5" />
                </button>
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-zinc-800">
                  {getThreadLabel(activeThread, viewerId, participantsState)}
                </p>
                <p className="truncate text-xs text-zinc-500">
                  {activeThread.isGroup
                    ? "Group conversation"
                    : "Direct message"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-zinc-400">
              <button type="button" className="hover:text-zinc-700">
                <LuRefreshCw className="h-4 w-4" />
              </button>
              <button type="button" className="hover:text-zinc-700">
                <LuZap className="h-4 w-4" />
              </button>
              <button type="button" className="hover:text-zinc-700">
                <LuEllipsis className="h-4 w-4" />
              </button>
            </div>
          </header>

          <div className="flex min-h-0 flex-1 flex-col">
            {/* Scrollable message area with sender-aware left/right message bubbles. */}
            <div className="flex-1 overflow-y-auto bg-zinc-100/35 px-4 py-4 sm:px-6">
              <div className="mx-auto flex h-full w-full max-w-4xl flex-col justify-end gap-3">
                {activeMessages.length === 0 ? (
                  <p className="text-sm text-zinc-400">
                    Send a message to start the conversation.
                  </p>
                ) : (
                  activeMessages.map((message) => {
                    const sender = participantsState[message.senderId];
                    const isCurrentSender = message.senderId === viewerId;

                    return (
                      <div
                        key={message.id}
                        className={`max-w-[80%] ${isCurrentSender ? "self-end" : "self-start"}`}
                      >
                        {activeThread.isGroup && (
                          <p className="mb-1 px-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                            {sender.name}
                          </p>
                        )}
                        <div
                          className={`rounded-2xl px-4 py-2 text-sm shadow-sm ${
                            isCurrentSender
                              ? "bg-violet-200 text-violet-700"
                              : "bg-white text-zinc-700"
                          }`}
                        >
                          {message.text}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            {/* Message composer with quick actions and submit/send control. */}
            <div className="border-t border-zinc-200 bg-white p-4 sm:p-5">
              <form
                className="mx-auto max-w-4xl rounded-xl border border-zinc-200 bg-white p-3 shadow-sm"
                onSubmit={(event) => {
                  event.preventDefault();
                  void handleSendMessage();
                }}
              >
                <input
                  aria-label="Message input"
                  placeholder={`Message ${getThreadLabel(activeThread, viewerId, participantsState)}`}
                  value={activeDraft}
                  onChange={(event) =>
                    setDraftByChatId((previousDraftByChatId) => ({
                      ...previousDraftByChatId,
                      [activeThread.id]: event.target.value,
                    }))
                  }
                  className="w-full border-none bg-transparent px-2 py-1 text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none"
                />
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <ComposerAction
                      label="Add"
                      icon={<LuPlus className="h-4 w-4" />}
                    />
                    <ComposerAction
                      label="Voice input"
                      icon={<LuAudioLines className="h-4 w-4" />}
                    />
                    <ComposerAction
                      label="Schedule"
                      icon={<LuClock3 className="h-4 w-4" />}
                    />
                    <ComposerAction
                      label="Mention"
                      icon={<LuAtSign className="h-4 w-4" />}
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-md bg-violet-200 px-4 py-1.5 text-sm font-medium text-violet-700 transition hover:bg-violet-300"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Right sidebar: channel/member metadata and quick thread shortcuts. */}
        <aside
          className={`fixed inset-y-0 right-0 z-40 flex w-[280px] flex-col border-l border-zinc-200 bg-zinc-50/95 p-4 shadow-xl transition-transform duration-300 xl:static xl:w-auto xl:translate-x-0 xl:border-t-0 xl:bg-zinc-50/40 xl:shadow-none ${
            isRightPanelOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="mb-2 flex justify-end xl:hidden">
            <button
              type="button"
              aria-label="Close right sidebar"
              className="text-zinc-500 hover:text-zinc-700"
              onClick={() => setIsRightPanelOpen(false)}
            >
              <LuX className="h-4 w-4" />
            </button>
          </div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              {activeMembers.length} Members
            </p>
            <button
              type="button"
              className="text-xs text-zinc-500 hover:text-zinc-700"
            >
              View
            </button>
          </div>

          <div className="space-y-1">
            {activeMembers.map((member) => (
              <MemberItem
                key={member.id}
                name={member.name}
                detail={member.id === viewerId ? "You" : member.detail}
                accent={member.accent}
              />
            ))}
          </div>

          <Separator.Root className="my-5 h-px bg-zinc-200" />

          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Private Threads
            </p>
            <button type="button" className="text-zinc-400 hover:text-zinc-700">
              <LuArrowRight className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-left shadow-sm transition hover:border-zinc-300"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-indigo-100 text-xs font-semibold text-indigo-700">
              TL
            </span>
            <span className="text-sm text-zinc-700">TL;DR</span>
          </button>
        </aside>
      </div>
    </main>
  );
}
