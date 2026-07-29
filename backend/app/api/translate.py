"""
Translation route.

Notice how thin this is — it does exactly three things:
  1. Receive a validated TranslationRequest (validation happens
     automatically via the type hint, before this function even runs)
  2. Call the service
  3. Translate service exceptions into HTTP responses

No business logic lives here. That's intentional.
"""

from fastapi import APIRouter, HTTPException

from app.schemas.translation import TranslationRequest, TranslationResponse
from app.services import translation_service
from app.core.exceptions import (
    TranslationAPIUnavailableError,
    TranslationAPIResponseError,
    SameLanguageError,
)

router = APIRouter(prefix="/api", tags=["Translation"])


@router.post("/translate", response_model=TranslationResponse)
async def translate(request: TranslationRequest) -> TranslationResponse:
    try:
        return await translation_service.translate_text(request)
    except SameLanguageError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except TranslationAPIUnavailableError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    except TranslationAPIResponseError as exc:
        raise HTTPException(status_code=502, detail=str(exc))