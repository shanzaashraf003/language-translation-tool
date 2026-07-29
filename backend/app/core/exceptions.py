"""
Custom exceptions for the translation domain.
"""


class TranslationServiceError(Exception):
    """Base exception for anything that goes wrong in the translation service."""
    pass


class TranslationAPIUnavailableError(TranslationServiceError):
    """Raised when the external translation provider (MyMemory) is
    unreachable or times out."""
    pass


class TranslationAPIResponseError(TranslationServiceError):
    """Raised when the external provider responds, but with an error
    status or a response we can't parse."""
    pass


class SameLanguageError(TranslationServiceError):
    """Raised when source and target languages are identical."""
    pass