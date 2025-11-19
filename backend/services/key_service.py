"""
Key management business logic service
WHY: Separate data access from HTTP layer
BENEFITS:
- Business logic isolated and testable
- Can be reused in different contexts
- Clear data access patterns
"""

from typing import List, Optional
from sqlalchemy.exc import IntegrityError
from models import db, KeyEntry, User


class KeyExistsError(Exception):
    """Raised when attempting to create duplicate key"""
    pass


class KeyNotFoundError(Exception):
    """Raised when key doesn't exist"""
    pass


class KeyService:
    """Handles key entry business logic"""
    
    @staticmethod
    def get_user_keys(user: User) -> List[KeyEntry]:
        """
        Get all keys for a user
        
        Args:
            user: User object
            
        Returns:
            List of KeyEntry objects
        """
        return KeyEntry.query.filter_by(user_id=user.id).order_by(KeyEntry.created_at.desc()).all()
    
    @staticmethod
    def create_key(user: User, key_name: str, encrypted_value: str, tags: List[str]) -> KeyEntry:
        """
        Create new key entry
        
        Args:
            user: Owner user
            key_name: Key identifier
            encrypted_value: Encrypted secret value
            tags: List of tag strings
            
        Returns:
            Created KeyEntry object
            
        Raises:
            KeyExistsError: If key with same name already exists
        """
        try:
            key_entry = KeyEntry(
                user_id=user.id,
                key_name=key_name,
                encrypted_value=encrypted_value,
                tags=tags
            )
            db.session.add(key_entry)
            db.session.commit()
            return key_entry
        except IntegrityError:
            db.session.rollback()
            raise KeyExistsError(f'Key "{key_name}" already exists')
    
    @staticmethod
    def get_key_by_id(user: User, key_id: int) -> Optional[KeyEntry]:
        """
        Get key by ID for specific user
        
        Args:
            user: User object
            key_id: Key entry ID
            
        Returns:
            KeyEntry or None
        """
        return KeyEntry.query.filter_by(id=key_id, user_id=user.id).first()
    
    @staticmethod
    def update_key(
        key_entry: KeyEntry,
        key_name: Optional[str] = None,
        encrypted_value: Optional[str] = None,
        tags: Optional[List[str]] = None
    ) -> KeyEntry:
        """
        Update key entry fields
        
        Args:
            key_entry: KeyEntry to update
            key_name: New key name (optional)
            encrypted_value: New encrypted value (optional)
            tags: New tags list (optional)
            
        Returns:
            Updated KeyEntry
        """
        if key_name is not None:
            key_entry.key_name = key_name
        if encrypted_value is not None:
            key_entry.encrypted_value = encrypted_value
        if tags is not None:
            key_entry.tags = tags
        
        db.session.commit()
        return key_entry
    
    @staticmethod
    def delete_key(key_entry: KeyEntry) -> None:
        """
        Delete key entry
        
        Args:
            key_entry: KeyEntry to delete
        """
        db.session.delete(key_entry)
        db.session.commit()
