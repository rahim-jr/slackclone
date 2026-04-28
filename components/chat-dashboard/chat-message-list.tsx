import type { ChatMessage, ChatThread, Participant, ParticipantId } from "@/lib/chat-types";

type ChatMessageListProps = {
  activeThread: ChatThread;
  activeMessages: ChatMessage[];
  viewerId: ParticipantId;
  participantsById: Record<ParticipantId, Participant>;
};

export function ChatMessageList({
  activeThread,
  activeMessages,
  viewerId,
  participantsById,
}: ChatMessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-zinc-100/35 px-4 py-4 sm:px-6">
      <div className="mx-auto flex h-full w-full max-w-4xl flex-col justify-end gap-3">
        {activeMessages.length === 0 ? (
          <p className="text-sm text-zinc-400">Send a message to start the conversation.</p>
        ) : (
          activeMessages.map((message) => {
            const sender = participantsById[message.senderId];
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
  );
}
