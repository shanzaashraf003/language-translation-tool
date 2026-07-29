import { useState } from "react";
import { LanguageSelector } from "../components/LanguageSelector";
import { SwapButton } from "../components/SwapButton";
import { CopyButton } from "../components/CopyButton";
import { Spinner } from "../components/Spinner";
import { useTranslate } from "../hooks/useTranslate";

const MAX_CHARS = 5000;

export function TranslatorPage() {
  const [sourceText, setSourceText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("fr");

  const { translatedText, isLoading, error, translate, reset } = useTranslate();

  const isOverLimit = sourceText.length > MAX_CHARS;
  const isBlank = sourceText.trim().length === 0;

  const handleTranslate = () => {
    if (isBlank || isOverLimit) return;
    translate({ text: sourceText, source_lang: sourceLang, target_lang: targetLang });
  };

  // Cmd+Enter (Mac) or Ctrl+Enter (Windows/Linux) is the conventional
  // shortcut for "submit" in a multi-line text field, since plain Enter
  // needs to still insert a newline.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleTranslate();
    }
  };

  const handleSwap = () => {
    if (sourceLang === "auto") return; // can't swap TO "auto detect"
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    reset();
  };

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#EDEEF0] flex flex-col items-center px-4 py-12">
      <header className="mb-10 text-center">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Language Translator
        </h1>
        <p className="text-sm text-[#8A8D93] mt-2">
          Translate text instantly between languages
        </p>
      </header>

      <main className="w-full max-w-3xl">
        <div className="flex items-end justify-center gap-4 mb-4">
          <div className="flex-1">
            <LanguageSelector label="From" value={sourceLang} onChange={setSourceLang} />
          </div>
          <div className="pb-0.5">
            <SwapButton onClick={handleSwap} disabled={sourceLang === "auto"} />
          </div>
          <div className="flex-1">
            <LanguageSelector
              label="To"
              value={targetLang}
              onChange={setTargetLang}
              excludeAuto
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Source panel */}
          <div className="bg-[#161922] border border-[#2A2E38] rounded-xl p-4 flex flex-col">
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter text to translate..."
              rows={8}
              aria-label="Text to translate"
              className="bg-transparent resize-none outline-none text-sm placeholder:text-[#5A5D66] flex-1
                         focus-visible:ring-2 focus-visible:ring-[#7C6FF0] rounded"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-[#5A5D66] hidden sm:inline">
                ⌘/Ctrl + Enter to translate
              </span>
              <span
                className={`text-xs ${
                  isOverLimit ? "text-red-400" : "text-[#5A5D66]"
                }`}
              >
                {sourceText.length} / {MAX_CHARS}
              </span>
            </div>
          </div>

          {/* Result panel */}
          <div className="bg-[#161922] border border-[#2A2E38] rounded-xl p-4 flex flex-col">
            <div className="flex-1 text-sm" aria-live="polite" aria-atomic="true">
              {isLoading ? (
                <div className="flex items-center gap-2 text-[#8A8D93]">
                  <Spinner />
                  <span>Translating...</span>
                </div>
              ) : error ? (
                <p className="text-red-400" role="alert">{error}</p>
              ) : translatedText ? (
                <p>{translatedText}</p>
              ) : (
                <p className="text-[#5A5D66]">Translation will appear here</p>
              )}
            </div>
            <div className="flex justify-end mt-2">
              <CopyButton text={translatedText} />
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={handleTranslate}
            disabled={isBlank || isOverLimit || isLoading}
            className="bg-[#7C6FF0] text-white text-sm font-medium px-8 py-2.5 rounded-lg
                       hover:bg-[#6D5FE8] disabled:opacity-40 disabled:cursor-not-allowed
                       transition-colors"
          >
            {isLoading ? "Translating..." : "Translate"}
          </button>
        </div>
      </main>
    </div>
  );
}