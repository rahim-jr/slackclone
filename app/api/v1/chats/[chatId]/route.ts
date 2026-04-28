import { NextResponse } from "next/server";
import {
  appendThreadMessage,
  getThread,
  getThreadMessages,
} from "@/lib/chat-store";
import type { ParticipantId } from "@/lib/chat-types";

type Context = {
  params: Promise<{ chatId: string }>;
};

export async function GET(_request: Request, context: Context) {
  const { chatId } = await context.params;
  const thread = getThread(chatId);

  if (!thread) {
    return NextResponse.json({ error: "Unknown chat id." }, { status: 404 });
  }

  return NextResponse.json({
    thread,
    messages: getThreadMessages(chatId),
  });
}

export async function POST(request: Request, context: Context) {
  const { chatId } = await context.params;
  const thread = getThread(chatId);

  if (!thread) {
    return NextResponse.json({ error: "Unknown chat id." }, { status: 404 });
  }

  const body = (await request.json()) as {
    senderId?: ParticipantId;
    text?: string;
  };

  if (!body.senderId || !thread.memberIds.includes(body.senderId)) {
    return NextResponse.json(
      { error: "Invalid sender for this chat." },
      { status: 400 },
    );
  }

  if (!body.text || !body.text.trim()) {
    return NextResponse.json(
      { error: "Message text is required." },
      { status: 400 },
    );
  }

  const message = appendThreadMessage(chatId, body.senderId, body.text);
  return NextResponse.json({ message }, { status: 201 });
}
