from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

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


class KeyEntry(db.Model):
    """Model for encrypted key-value pairs"""
    __tablename__ = 'key_entries'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    key_name = db.Column(db.String(255), nullable=False)
    encrypted_value = db.Column(db.Text, nullable=False)  # Client-side encrypted value
    tags = db.Column(db.JSON, default=list, nullable=False)  # List of tags
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Unique constraint: one key name per user
    __table_args__ = (
        db.UniqueConstraint('user_id', 'key_name', name='unique_user_key'),
    )
    
    def __repr__(self):
        return f'<KeyEntry {self.key_name}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'key': self.key_name,
            'value': self.encrypted_value,
            'tags': self.tags or [],
            'createdAt': int(self.created_at.timestamp() * 1000),  # Unix timestamp in ms
            'updatedAt': int(self.updated_at.timestamp() * 1000)
        }
