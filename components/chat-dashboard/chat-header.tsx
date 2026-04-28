import {
  LuEllipsis,
  LuRefreshCw,
  LuSquareChevronLeft,
  LuSquareChevronRight,
  LuZap,
} from "react-icons/lu";
import { getThreadLabel } from "@/lib/chat-utils";
import type { ChatThread, Participant, ParticipantId } from "@/lib/chat-types";

type ChatHeaderProps = {
  activeThread: ChatThread;
  viewerId: ParticipantId;
  participantsById: Record<ParticipantId, Participant>;
  onOpenLeftPanel: () => void;
  onOpenRightPanel: () => void;
};

export function ChatHeader({
  activeThread,
  viewerId,
  participantsById,
  onOpenLeftPanel,
  onOpenRightPanel,
}: ChatHeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-zinc-200 px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex items-center gap-2 xl:hidden">
          <button
            type="button"
            aria-label="Open left sidebar"
            className="text-zinc-400 hover:text-zinc-700"
            onClick={onOpenLeftPanel}
          >
            <LuSquareChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Open right sidebar"
            className="text-zinc-400 hover:text-zinc-700"
            onClick={onOpenRightPanel}
          >
            <LuSquareChevronRight className="h-5 w-5" />
          </button>
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-zinc-800">
            {getThreadLabel(activeThread, viewerId, participantsById)}
          </p>
          <p className="truncate text-xs text-zinc-500">
            {activeThread.isGroup ? "Group conversation" : "Direct message"}
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
  );
}
