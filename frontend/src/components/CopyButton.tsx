import { useState } from "react";

interface CopyButtonProps {
  text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text) return;
    // navigator.clipboard.writeText is the modern browser API for clipboard
    // access. It requires a secure context (https, or localhost for dev).
    await navigator.clipboard.writeText(text);
    setCopied(true);
    // Reset the "Copied!" state after 2 seconds so the button is reusable
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={!text}
      className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md
                 text-[#8A8D93] hover:text-[#EDEEF0] hover:bg-[#2A2E38]
                 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
      {copied ? (
        <span className="text-[#E8A94C]">Copied</span>
      ) : (
        <span>Copy</span>
      )}
    </button>
  );
}