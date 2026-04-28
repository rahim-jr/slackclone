import { Separator } from "radix-ui";
import { LuArrowRight, LuX } from "react-icons/lu";
import { MemberItem } from "@/components/chat-dashboard/member-item";
import type { Participant, ParticipantId } from "@/lib/chat-types";

type ChatDetailsPanelProps = {
  isRightPanelOpen: boolean;
  activeMembers: Participant[];
  viewerId: ParticipantId;
  onCloseRightPanel: () => void;
};

export function ChatDetailsPanel({
  isRightPanelOpen,
  activeMembers,
  viewerId,
  onCloseRightPanel,
}: ChatDetailsPanelProps) {
  return (
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
          onClick={onCloseRightPanel}
        >
          <LuX className="h-4 w-4" />
        </button>
      </div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          {activeMembers.length} Members
        </p>
        <button type="button" className="text-xs text-zinc-500 hover:text-zinc-700">
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
  );
}
