"""
Authentication business logic service
WHY: Separate business logic from HTTP concerns (Single Responsibility Principle)
BEFORE: Route handlers mixed HTTP, validation, DB, and business logic
AFTER: Clean separation - routes handle HTTP, services handle business logic
BENEFITS:
- Testable without Flask context
- Reusable across different interfaces (REST, GraphQL, CLI)
- Clear separation of concerns
- Easier to mock for testing
"""

from datetime import datetime
from typing import Dict, Optional, Tuple
from models import db, User  # Models from models package
from utils.tokens import generate_token
from utils.email import send_verification_email


class AuthService:
    """Handles authentication business logic"""
    
    @staticmethod
    def get_or_create_user(email: str) -> User:
        """
        Get existing user or create new one
        
        Args:
            email: User email address
            
        Returns:
            User object
        """
        user = User.query.filter_by(email=email).first()
        if not user:
            user = User(email=email, is_verified=False)
            db.session.add(user)
            db.session.commit()
        return user
    
    @staticmethod
    def generate_and_send_verification_link(user: User, frontend_url: str) -> str:
        """
        Generate verification token and send email
        
        Args:
            user: User object
            frontend_url: Base URL for frontend
            
        Returns:
            Generated token string
        """
        token = generate_token(user.email, purpose='email-verification')
        verification_url = f"{frontend_url}?token={token}"
        send_verification_email(user.email, verification_url)
        return token
    
    @staticmethod
    def verify_user(user: User) -> str:
        """
        Mark user as verified and generate session token
        
        Args:
            user: User object to verify
            
        Returns:
            Session token string
        """
        user.is_verified = True
        user.last_login = datetime.utcnow()
        db.session.commit()
        return generate_token(user.email, 'session')
    
    @staticmethod
    def create_session_for_user(user: User) -> str:
        """
        Generate session token for already verified user
        
        Args:
            user: Verified user object
            
        Returns:
            Session token string
        """
        return generate_token(user.email, 'session')
    
    @staticmethod
    def set_passphrase_validator(user: User, encrypted_validator: str) -> None:
        """
        Store encrypted passphrase validator for user
        
        Args:
            user: User object
            encrypted_validator: Encrypted validation string
        """
        user.passphrase_validator = encrypted_validator
        db.session.commit()
    
    @staticmethod
    def get_user_by_email(email: str) -> Optional[User]:
        """
        Fetch user by email
        
        Args:
            email: User email
            
        Returns:
            User object or None
        """
        return User.query.filter_by(email=email).first()
