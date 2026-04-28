import { NextResponse } from "next/server";
import { getSnapshotForViewer, viewerIdFromRouteId } from "@/lib/chat-store";

type Context = {
  params: Promise<{ userId: string }>;
};

export async function GET(_request: Request, context: Context) {
  const { userId } = await context.params;
  const viewerId = viewerIdFromRouteId(userId);

  if (!viewerId) {
    return NextResponse.json(
      {
        error:
          "Unknown user id. Use /api/v1/users/1 (Jhon) or /api/v1/users/2 (Jane).",
      },
      { status: 404 },
    );
  }

  return NextResponse.json(getSnapshotForViewer(viewerId));
}
