import type { ReactNode } from "react";

type NavItemProps = {
  label: string;
  active?: boolean;
  count?: number;
  icon?: ReactNode;
  onClick?: () => void;
};

export function NavItem({ label, active, count, icon, onClick }: NavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors ${
        active
          ? "bg-zinc-200/80 text-zinc-900"
          : "text-zinc-600 hover:bg-zinc-200/50 hover:text-zinc-900"
      }`}
    >
      {icon ? <span className="mr-2 text-zinc-500">{icon}</span> : null}
      <span className="truncate">{label}</span>
      {typeof count === "number" ? (
        <span className="ml-auto rounded bg-zinc-200 px-2 py-0.5 text-xs text-zinc-600">
          {count}
        </span>
      ) : null}
    </button>
  );
}
