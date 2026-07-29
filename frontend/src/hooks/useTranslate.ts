import { useState, useCallback, useRef } from "react";
import { translateText, TranslationError } from "../services/translationApi";
import axios from "axios";
import type { TranslationRequest } from "../types/translation";

// Why a custom hook instead of putting this logic directly in the component?
// Because it separates "how do I manage translation state" from "how do I
// render a translator UI." This hook could be reused by a completely
// different component (e.g. a browser extension popup) with zero changes.

interface UseTranslateResult {
  translatedText: string;
  isLoading: boolean;
  error: string | null;
  translate: (request: TranslationRequest) => Promise<void>;
  reset: () => void;
}

export function useTranslate(): UseTranslateResult {
  const [translatedText, setTranslatedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // useRef persists across renders WITHOUT triggering a re-render when it
  // changes (unlike useState) — exactly what we want for tracking "the
  // current in-flight request" as a mutable value.
  const abortControllerRef = useRef<AbortController | null>(null);

  const translate = useCallback(async (request: TranslationRequest) => {
    // Cancel any previous request still in flight before starting a new one.
    // This guarantees only the LATEST request can ever update state.
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      const result = await translateText(request, controller.signal);
      setTranslatedText(result.translated_text);
    } catch (err) {
      if (axios.isCancel(err)) {
        // A newer request superseded this one — silently ignore, the
        // newer request's own handler will update state instead.
        return;
      }
      const message =
        err instanceof TranslationError ? err.message : "Something went wrong.";
      setError(message);
      setTranslatedText("");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setTranslatedText("");
    setError(null);
  }, []);

  return { translatedText, isLoading, error, translate, reset };
}