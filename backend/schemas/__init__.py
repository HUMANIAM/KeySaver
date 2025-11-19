"""
Schemas package for KeySaver
Pydantic validation schemas for request/response data
"""

# Authentication schemas
from .auth_schemas import (
    UserRegisterSchema,
    UserLoginSchema,
    SetPassphraseSchema,
    SetValidatorSchema
)

# Key entry schemas
from .key_schemas import (
    KeyEntryCreateSchema,
    KeyEntryUpdateSchema,
    KeyEntryResponseSchema
)

__all__ = [
    # Auth schemas
    'UserRegisterSchema',
    'UserLoginSchema',
    'SetPassphraseSchema',
    'SetValidatorSchema',
    # Key schemas
    'KeyEntryCreateSchema',
    'KeyEntryUpdateSchema',
    'KeyEntryResponseSchema',
]
