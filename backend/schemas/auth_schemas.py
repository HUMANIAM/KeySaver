"""
Authentication Schemas
Pydantic schemas for user authentication and verification
"""
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
        """Ensure validator is not empty or whitespace only"""
        if not v or not v.strip():
            raise ValueError("Validator cannot be empty")
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "validator": "encrypted_validation_test_string"
            }
        }
