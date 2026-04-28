import { Suspense } from "react";
import { ChatDashboard } from "@/components/chat-dashboard";

export default function Home() {
  return (
    <Suspense fallback={null}>
      <ChatDashboard />
    </Suspense>
  );
}
