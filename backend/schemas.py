from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field, field_validator

class UserRegisterSchema(BaseModel):
    """Schema for user registration"""
    email: EmailStr
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com"
            }
        }


class UserLoginSchema(BaseModel):
    """Schema for login request"""
    email: EmailStr
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com"
            }
        }


class SetPassphraseSchema(BaseModel):
    """Schema for setting passphrase after verification"""
    token: str = Field(..., min_length=1)
    
    class Config:
        json_schema_extra = {
            "example": {
                "token": "verification-token-here"
            }
        }


class SetValidatorSchema(BaseModel):
    """Schema for setting passphrase validator (encrypted test string)"""
    validator: str = Field(..., min_length=1, description="Encrypted validation test string")
    
    @field_validator('validator')
    @classmethod
    def validate_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("Validator cannot be empty")
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "validator": "encrypted_validation_test_string"
            }
        }


class KeyEntryCreateSchema(BaseModel):
    """Schema for creating a new key entry"""
    key: str = Field(..., min_length=1, max_length=255)
    value: str = Field(..., min_length=1)  # Encrypted value from client
    tags: List[str] = Field(default_factory=list)
    
    @field_validator('tags')
    @classmethod
    def validate_tags(cls, v):
        if v is None:
            return []
        # Remove duplicates and empty strings
        return list(set(filter(None, [tag.strip() for tag in v])))
    
    class Config:
        json_schema_extra = {
            "example": {
                "key": "API_KEY",
                "value": "encrypted_value_here",
                "tags": ["production", "api"]
            }
        }


class KeyEntryUpdateSchema(BaseModel):
    """Schema for updating a key entry"""
    key: Optional[str] = Field(None, min_length=1, max_length=255)
    value: Optional[str] = Field(None, min_length=1)
    tags: Optional[List[str]] = None
    
    @field_validator('tags')
    @classmethod
    def validate_tags(cls, v):
        if v is None:
            return None
        return list(set(filter(None, [tag.strip() for tag in v])))
    
    class Config:
        json_schema_extra = {
            "example": {
                "key": "API_KEY",
                "value": "new_encrypted_value",
                "tags": ["production", "api", "v2"]
            }
        }


class KeyEntryResponseSchema(BaseModel):
    """Schema for key entry response"""
    id: int
    key: str
    value: str
    tags: List[str]
    createdAt: int
    updatedAt: int
    
    class Config:
        from_attributes = True
