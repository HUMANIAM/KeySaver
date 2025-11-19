"""
Key Entry Schemas
Pydantic schemas for encrypted key-value pair operations
"""
from typing import List, Optional
from pydantic import BaseModel, Field, field_validator


class KeyEntryCreateSchema(BaseModel):
    """Schema for creating a new key entry"""
    key: str = Field(..., min_length=1, max_length=255)
    value: str = Field(..., min_length=1)  # Encrypted value from client
    tags: List[str] = Field(default_factory=list)
    
    @field_validator('tags')
    @classmethod
    def validate_tags(cls, v):
        """Clean tags: remove duplicates and empty strings"""
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
        """Clean tags: remove duplicates and empty strings"""
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
