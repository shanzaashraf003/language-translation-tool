from pydantic import BaseModel, Field, field_validator
 
 
class TranslationRequest(BaseModel):
    text: str = Field(
        ...,
        min_length=1,
        max_length=5000,
        description="The text to translate",
    )
    source_lang: str = Field(
        ...,
        min_length=2,
        max_length=5,
        description="Source language code, e.g. 'en'. Use 'auto' to auto-detect.",
    )
    target_lang: str = Field(
        ...,
        min_length=2,
        max_length=5,
        description="Target language code, e.g. 'fr'",
    )
 
    @field_validator("text")
    @classmethod
    def text_must_not_be_blank(cls, value: str) -> str:
        # min_length=1 catches an empty string, but NOT a string that's
        # just whitespace (e.g. "   "). We catch that case explicitly.
        if not value.strip():
            raise ValueError("Text must not be blank or whitespace-only")
        return value
 
    class Config:
        json_schema_extra = {
            "example": {
                "text": "Hello, how are you?",
                "source_lang": "en",
                "target_lang": "fr",
            }
        }
 
 
class TranslationResponse(BaseModel):
    translated_text: str
    source_lang: str
    target_lang: str
 
