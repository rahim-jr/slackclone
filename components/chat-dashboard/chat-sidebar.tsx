import { Avatar, ScrollArea, Separator } from "radix-ui";
import {
  LuCalendarDays,
  LuChevronDown,
  LuFileText,
  LuHash,
  LuMail,
  LuPlus,
  LuPuzzle,
  LuSettings2,
  LuUserRound,
  LuUsers,
  LuX,
} from "react-icons/lu";
import { NavItem } from "@/components/chat-dashboard/nav-item";
import { getThreadLabel } from "@/lib/chat-utils";
import type { ChatThread, Participant, ParticipantId } from "@/lib/chat-types";

type ChatSidebarProps = {
  isLeftPanelOpen: boolean;
  visibleThreads: ChatThread[];
  activeThreadId: string;
  viewerId: ParticipantId;
  participantsById: Record<ParticipantId, Participant>;
  accountName: string;
  sidebarAvatarSrc: string;
  onCloseLeftPanel: () => void;
  onSelectThread: (threadId: string) => void;
};

export function ChatSidebar({
  isLeftPanelOpen,
  visibleThreads,
  activeThreadId,
  viewerId,
  participantsById,
  accountName,
  sidebarAvatarSrc,
  onCloseLeftPanel,
  onSelectThread,
}: ChatSidebarProps) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-[260px] min-h-0 flex-col border-r border-zinc-200 bg-zinc-50/95 shadow-xl transition-transform duration-300 xl:static xl:w-auto xl:translate-x-0 xl:bg-zinc-50/70 xl:shadow-none ${
        isLeftPanelOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-lg font-bold text-zinc-800">Janes Studio</p>
        <div className="flex items-center gap-2">
          <button type="button" className="text-zinc-500 hover:text-zinc-700">
            <LuChevronDown className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Close left sidebar"
            className="text-zinc-500 hover:text-zinc-700 xl:hidden"
            onClick={onCloseLeftPanel}
          >
            <LuX className="h-4 w-4" />
          </button>
        </div>
      </div>

      <ScrollArea.Root className="min-h-0 flex-1 overflow-hidden">
        <ScrollArea.Viewport className="h-full w-full px-2 pb-3">
          <div className="space-y-1 px-2">
            <NavItem label="Unread" count={1} icon={<LuMail className="h-4 w-4" />} />
            <NavItem label="Threads" icon={<LuUsers className="h-4 w-4" />} />
            <NavItem label="Drafts" icon={<LuFileText className="h-4 w-4" />} />
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
                  label={getThreadLabel(thread, viewerId, participantsById)}
                  active={thread.id === activeThreadId}
                  icon={
                    thread.isGroup ? (
                      <LuUsers className="h-4 w-4" />
                    ) : (
                      <LuUserRound className="h-4 w-4" />
                    )
                  }
                  onClick={() => onSelectThread(thread.id)}
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
              <NavItem label="general" icon={<LuHash className="h-4 w-4" />} />
              <NavItem label="Add channel" icon={<LuPlus className="h-4 w-4" />} />
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
              <NavItem label="Add integration" icon={<LuPuzzle className="h-4 w-4" />} />
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
          <p className="truncate text-sm text-zinc-700">{accountName}</p>
        </div>
        <button type="button" className="text-zinc-400 hover:text-zinc-700">
          <LuSettings2 className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
