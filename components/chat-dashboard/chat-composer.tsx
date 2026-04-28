import { LuAtSign, LuAudioLines, LuClock3, LuPlus } from "react-icons/lu";
import { ComposerAction } from "@/components/chat-dashboard/composer-action";

type ChatComposerProps = {
  placeholder: string;
  draft: string;
  onDraftChange: (value: string) => void;
  onSubmit: () => void;
};

export function ChatComposer({
  placeholder,
  draft,
  onDraftChange,
  onSubmit,
}: ChatComposerProps) {
  return (
    <div className="border-t border-zinc-200 bg-white p-4 sm:p-5">
      <form
        className="mx-auto max-w-4xl rounded-xl border border-zinc-200 bg-white p-3 shadow-sm"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <input
          aria-label="Message input"
          placeholder={placeholder}
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          className="w-full border-none bg-transparent px-2 py-1 text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none"
        />
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <ComposerAction label="Add" icon={<LuPlus className="h-4 w-4" />} />
            <ComposerAction
              label="Voice input"
              icon={<LuAudioLines className="h-4 w-4" />}
            />
            <ComposerAction
              label="Schedule"
              icon={<LuClock3 className="h-4 w-4" />}
            />
            <ComposerAction label="Mention" icon={<LuAtSign className="h-4 w-4" />} />
          </div>
          <button
            type="submit"
            className="rounded-md bg-violet-200 px-4 py-1.5 text-sm font-medium text-violet-700 transition hover:bg-violet-300"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
