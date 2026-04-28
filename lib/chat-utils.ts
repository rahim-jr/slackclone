import type {
  ChatThread,
  Participant,
  ParticipantId,
  ViewerRouteId,
} from "@/lib/chat-types";

export function getViewerRouteId(viewerParam: string | null): ViewerRouteId {
  return viewerParam === "2" ? "2" : "1";
}

export function getThreadLabel(
  thread: ChatThread,
  viewerId: ParticipantId,
  participantsById: Record<ParticipantId, Participant>,
): string {
  if (thread.isGroup) {
    return thread.label;
  }

  const otherMemberId = thread.memberIds.find((memberId) => memberId !== viewerId);
  return otherMemberId
    ? (participantsById[otherMemberId]?.name ?? thread.label)
    : thread.label;
}
