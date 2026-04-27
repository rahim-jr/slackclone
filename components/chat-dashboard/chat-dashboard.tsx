"use client";

import { Avatar, ScrollArea, Separator } from "radix-ui";
import { ComposerAction, MemberItem, NavItem } from "@/components/chat-dashboard";

export function ChatDashboard() {
  return (
    <main className="min-h-screen bg-[#f6f6f7] p-2 sm:p-3">
      <div className="mx-auto grid h-[calc(100vh-1rem)] w-full max-w-[1440px] grid-cols-1 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm sm:h-[calc(100vh-1.5rem)] md:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_280px]">
        <aside className="hidden min-h-0 flex-col border-r border-zinc-200 bg-zinc-50/70 md:flex">
          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-sm font-medium text-zinc-800">Janes Studio</p>
            <span className="text-zinc-500">⌄</span>
          </div>

          <div className="px-4 pb-3">
            <button
              type="button"
              className="w-full rounded-lg bg-violet-500 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-violet-600"
            >
              Compose
            </button>
          </div>

          <ScrollArea.Root className="min-h-0 flex-1 overflow-hidden">
            <ScrollArea.Viewport className="h-full w-full px-2 pb-3">
              <div className="space-y-1 px-2">
                <NavItem label="Inbox" count={1} icon="✉" />
                <NavItem label="Drafts" icon="▢" />
              </div>

              <Separator.Root className="mx-2 my-3 h-px bg-zinc-200" />

              <div className="px-2">
                <p className="px-1 pb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Chat
                </p>
                <div className="space-y-1">
                  <NavItem label="jane x threads team" icon="◈" />
                  <NavItem label="jsmith.mobbin@gmail.com" active icon="✦" />
                  <NavItem label="Jane Smith (you)" icon="◉" />
                  <NavItem label="Add teammates" icon="＋" />
                </div>
              </div>

              <Separator.Root className="mx-2 my-3 h-px bg-zinc-200" />

              <div className="px-2">
                <p className="px-1 pb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Channels
                </p>
                <div className="space-y-1">
                  <NavItem label="general" icon="#" />
                  <NavItem label="Add channel" icon="＋" />
                </div>
              </div>

              <Separator.Root className="mx-2 my-3 h-px bg-zinc-200" />

              <div className="px-2">
                <p className="px-1 pb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Apps
                </p>
                <div className="space-y-1">
                  <NavItem label="Google Calendar" icon="◷" />
                  <NavItem label="Add integration" icon="＋" />
                </div>
              </div>
            </ScrollArea.Viewport>
          </ScrollArea.Root>

          <div className="flex items-center justify-between border-t border-zinc-200 px-4 py-3">
            <div className="flex min-w-0 items-center gap-2">
              <Avatar.Root className="inline-flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-zinc-200">
                <Avatar.Fallback className="text-xs font-semibold text-zinc-700">
                  JM
                </Avatar.Fallback>
              </Avatar.Root>
              <p className="truncate text-sm text-zinc-700">jsmith.mobbin@gmail.com</p>
            </div>
            <button type="button" className="text-zinc-400 hover:text-zinc-700">
              ⌁
            </button>
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 items-center justify-between border-b border-zinc-200 px-4 sm:px-6">
            <p className="truncate text-sm font-medium text-zinc-800">
              jsmith.mobbin@gmail.com
            </p>
            <div className="flex items-center gap-3 text-zinc-400">
              <button type="button" className="hover:text-zinc-700">
                ⟳
              </button>
              <button type="button" className="hover:text-zinc-700">
                ⚡
              </button>
              <button type="button" className="hover:text-zinc-700">
                ⋯
              </button>
            </div>
          </header>

          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 bg-zinc-100/35" />
            <div className="border-t border-zinc-200 bg-white p-4 sm:p-5">
              <div className="mx-auto max-w-4xl rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
                <input
                  aria-label="Message input"
                  placeholder="Message Jane"
                  className="w-full border-none bg-transparent px-2 py-1 text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none"
                />
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <ComposerAction label="+" />
                    <ComposerAction label="|||" />
                    <ComposerAction label="◷" />
                    <ComposerAction label="@" />
                  </div>
                  <button
                    type="button"
                    className="rounded-md bg-violet-200 px-4 py-1.5 text-sm font-medium text-violet-700 transition hover:bg-violet-300"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="hidden border-t border-zinc-200 bg-zinc-50/40 p-4 md:flex md:col-span-2 md:flex-col xl:col-span-1 xl:border-t-0 xl:border-l">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              2 Members
            </p>
            <button type="button" className="text-xs text-zinc-500 hover:text-zinc-700">
              View
            </button>
          </div>

          <div className="space-y-1">
            <MemberItem name="Jane Smith" detail="Owner" accent="bg-indigo-200" />
            <MemberItem
              name="jsmith.mobbin@gmail.com"
              detail="You"
              accent="bg-violet-200"
            />
          </div>

          <Separator.Root className="my-5 h-px bg-zinc-200" />

          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Private Threads
            </p>
            <button type="button" className="text-zinc-400 hover:text-zinc-700">
              →
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
