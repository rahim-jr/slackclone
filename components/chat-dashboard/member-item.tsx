import { Avatar } from "radix-ui";

type MemberItemProps = {
  name: string;
  detail: string;
  accent?: string;
};

export function MemberItem({
  name,
  detail,
  accent = "bg-violet-300",
}: MemberItemProps) {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-zinc-100">
      <Avatar.Root className="inline-flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-md bg-zinc-200 align-middle">
        <Avatar.Fallback
          className={`flex h-full w-full items-center justify-center text-[10px] font-semibold text-zinc-700 ${accent}`}
        >
          {initials}
        </Avatar.Fallback>
      </Avatar.Root>
      <div className="min-w-0">
        <p className="truncate text-sm text-zinc-800">{name}</p>
        <p className="truncate text-xs text-zinc-500">{detail}</p>
      </div>
    </div>
  );
}
