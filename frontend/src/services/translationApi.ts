import axios, { AxiosError } from "axios";
import type { TranslationRequest, TranslationResponse } from "../types/translation";

// Why an env variable instead of hardcoding "http://localhost:8000"?
// Because this URL changes between development and production (e.g. a deployed
// Render/Railway backend URL). Vite exposes env vars prefixed with VITE_ to the
// browser bundle; everything else is stripped out for security.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// A small custom error class so components can display a clean message
// instead of digging through Axios's error object shape themselves.
export class TranslationError extends Error {
  statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = "TranslationError";
    this.statusCode = statusCode;
  }
}

export async function translateText(
  request: TranslationRequest,
  signal?: AbortSignal
): Promise<TranslationResponse> {
  try {
    const response = await apiClient.post<TranslationResponse>(
      "/api/translate",
      request,
      { signal }
    );
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      // Request was intentionally cancelled by a newer request — not a real
      // error, so we re-throw it as-is and let the caller ignore it.
      throw error;
    }

    const axiosError = error as AxiosError<{ detail: string }>;

    if (axiosError.response) {
      // The backend responded, but with an error status (400/422/502/503)
      const detail = axiosError.response.data?.detail;
      throw new TranslationError(
        detail || "Translation failed. Please try again.",
        axiosError.response.status
      );
    }

    if (axiosError.request) {
      // Request was sent but no response came back at all (backend down, no network)
      throw new TranslationError(
        "Could not reach the translation server. Check your connection."
      );
    }

    throw new TranslationError("An unexpected error occurred.");
  }
}