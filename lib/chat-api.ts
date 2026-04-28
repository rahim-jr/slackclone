import type { ChatSnapshot, SendMessageRequest, ViewerRouteId } from "@/lib/chat-types";

export async function fetchUserSnapshot(
  viewerRouteId: ViewerRouteId,
): Promise<ChatSnapshot | null> {
  const response = await fetch(`/api/v1/users/${viewerRouteId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as ChatSnapshot;
}

export async function postChatMessage(
  chatId: string,
  payload: SendMessageRequest,
): Promise<boolean> {
  const response = await fetch(`/api/v1/chats/${chatId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return response.ok;
}
