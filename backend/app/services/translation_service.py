"""
Translation service — the ONLY file in this project that knows anything
about MyMemory's API shape.

If we ever swap providers, this is the only file that changes. The route
layer (api/translate.py) and the frontend never need to know or care.
"""

import httpx

from app.config.settings import settings
from app.schemas.translation import TranslationRequest, TranslationResponse
from app.core.exceptions import (
    TranslationAPIUnavailableError,
    TranslationAPIResponseError,
    SameLanguageError,
)


async def translate_text(request: TranslationRequest) -> TranslationResponse:
    """
    Calls the MyMemory API to translate `request.text` from
    `request.source_lang` to `request.target_lang`.

    Raises:
        SameLanguageError: if source and target languages are identical
        TranslationAPIUnavailableError: if MyMemory can't be reached
        TranslationAPIResponseError: if MyMemory responds with bad data
    """
    if request.source_lang != "auto" and request.source_lang == request.target_lang:
        raise SameLanguageError("Source and target languages must differ")

    params = {
        "q": request.text,
        "langpair": f"{request.source_lang}|{request.target_lang}",
    }
    if settings.mymemory_api_key:
        params["key"] = settings.mymemory_api_key

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(settings.mymemory_api_url, params=params)
    except httpx.RequestError as exc:
        raise TranslationAPIUnavailableError(
            f"Could not reach translation provider: {exc}"
        ) from exc

    if response.status_code != 200:
        raise TranslationAPIResponseError(
            f"Translation provider returned status {response.status_code}"
        )

    data = response.json()

    try:
        translated_text = data["responseData"]["translatedText"]
    except (KeyError, TypeError) as exc:
        raise TranslationAPIResponseError(
            "Translation provider returned an unexpected response shape"
        ) from exc

    return TranslationResponse(
        translated_text=translated_text,
        source_lang=request.source_lang,
        target_lang=request.target_lang,
    )