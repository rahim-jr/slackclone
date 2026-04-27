type ComposerActionProps = {
  label: string;
};

export function ComposerAction({ label }: ComposerActionProps) {
  return (
    <button
      type="button"
      className="rounded-md px-2 py-1 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
    >
      {label}
    </button>
  );
}
