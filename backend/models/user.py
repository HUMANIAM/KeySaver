"""
User Model
Handles user authentication and account management
"""
from datetime import datetime
from . import db


class User(db.Model):
    """User model for authentication"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    is_verified = db.Column(db.Boolean, default=False, nullable=False)
    passphrase_validator = db.Column(db.Text, nullable=True)  # Encrypted validation test
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    last_login = db.Column(db.DateTime)
    
    # Relationship to key entries
    key_entries = db.relationship('KeyEntry', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<User {self.email}>'
    
    def to_dict(self, include_validator=False):
        """
        Convert user to dict
        
        Args:
            include_validator: If True, include passphrase_validator (ONLY for login flow)
                              Default False for security
        
        SECURITY: passphrase_validator should ONLY be sent when explicitly needed
        """
        data = {
            'id': self.id,
            'email': self.email,
            'is_verified': self.is_verified,
            'created_at': self.created_at.isoformat(),
            'last_login': self.last_login.isoformat() if self.last_login else None
        }
        
        # Only include validator if explicitly requested (for login flow)
        if include_validator:
            data['passphrase_validator'] = self.passphrase_validator
        
        return data
