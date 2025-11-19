#!/usr/bin/env python3
"""
Reset database to apply new schema changes:
- Unique constraint on user_id + key_name
- Passphrase validator field for User
WARNING: This will delete all existing data!
"""
import os
from app import create_app
from models import db

if __name__ == '__main__':
    app = create_app()
    
    with app.app_context():
        print("⚠️  Resetting database...")
        print("   This will add:")
        print("   - Unique constraint on key names per user")
        print("   - Passphrase validation system")
        
        # Drop all tables
        db.drop_all()
        print("✓ Dropped all tables")
        
        # Create all tables with new schema
        db.create_all()
        print("✓ Created tables with new schema")
        
        print("✅ Database reset complete!")
        print("\nNew features:")
        print("   🔐 Passphrase validation on login")
        print("   🚫 Duplicate key prevention")
