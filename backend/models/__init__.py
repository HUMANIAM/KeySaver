"""
Models package for KeySaver
Separates database models for better organization
"""
from flask_sqlalchemy import SQLAlchemy

# Initialize SQLAlchemy
db = SQLAlchemy()

# Import models for easy access
from .user import User
from .key_entry import KeyEntry

__all__ = ['db', 'User', 'KeyEntry']
