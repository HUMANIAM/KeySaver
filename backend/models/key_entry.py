"""
KeyEntry Model
Handles encrypted key-value pair storage
"""
from datetime import datetime
from . import db


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
        """Convert key entry to dictionary"""
        return {
            'id': self.id,
            'key': self.key_name,
            'value': self.encrypted_value,
            'tags': self.tags or [],
            'createdAt': int(self.created_at.timestamp() * 1000),  # Unix timestamp in ms
            'updatedAt': int(self.updated_at.timestamp() * 1000)
        }
