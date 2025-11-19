"""
Key management routes
REFACTORED: Uses middleware, service layer, standardized responses
"""
from flask import Blueprint, request, g, current_app
from pydantic import ValidationError

from schemas import KeyEntryCreateSchema, KeyEntryUpdateSchema  # From schemas package
from services.key_service import KeyService, KeyExistsError, KeyNotFoundError
from middleware.auth import require_auth
from utils.responses import (
    success_response, created_response, validation_error_response,
    not_found_response, conflict_response, internal_error_response
)

keys_bp = Blueprint('keys', __name__, url_prefix='/api/keys')


@keys_bp.route('', methods=['GET'])
@require_auth
def get_keys():
    """
    Get all keys for authenticated user
    WHY: @require_auth decorator eliminates boilerplate
    BENEFIT: 10+ lines reduced to 1 decorator
    """
    try:
        keys = KeyService.get_user_keys(g.current_user)
        return success_response(data={'keys': [key.to_dict() for key in keys]})
    except Exception as e:
        current_app.logger.error(f"Get keys error: {str(e)}")
        return internal_error_response()


@keys_bp.route('', methods=['POST'])
@require_auth
def create_key():
    """
    Create a new key entry
    WHY: Service layer handles DB operations, responses standardized
    """
    try:
        data = KeyEntryCreateSchema(**request.json)
        key_entry = KeyService.create_key(
            user=g.current_user,
            key_name=data.key,
            encrypted_value=data.value,
            tags=data.tags
        )
        return created_response(data={'key': key_entry.to_dict()})
    except ValidationError as e:
        return validation_error_response(e.errors())
    except KeyExistsError as e:
        return conflict_response(str(e))
    except Exception as e:
        current_app.logger.error(f"Create key error: {str(e)}")
        return internal_error_response()


@keys_bp.route('/<int:key_id>', methods=['PUT'])
@require_auth
def update_key(key_id):
    """Update an existing key entry"""
    try:
        key_entry = KeyService.get_key_by_id(g.current_user, key_id)
        if not key_entry:
            return not_found_response("Key not found")
        
        data = KeyEntryUpdateSchema(**request.json)
        updated_key = KeyService.update_key(
            key_entry=key_entry,
            key_name=data.key,
            encrypted_value=data.value,
            tags=data.tags
        )
        return success_response(data={'key': updated_key.to_dict()})
    except ValidationError as e:
        return validation_error_response(e.errors())
    except Exception as e:
        current_app.logger.error(f"Update key error: {str(e)}")
        return internal_error_response()


@keys_bp.route('/<int:key_id>', methods=['DELETE'])
@require_auth
def delete_key(key_id):
    """Delete a key entry"""
    try:
        key_entry = KeyService.get_key_by_id(g.current_user, key_id)
        if not key_entry:
            return not_found_response("Key not found")
        
        KeyService.delete_key(key_entry)
        return success_response(message='Key deleted successfully')
    except Exception as e:
        current_app.logger.error(f"Delete key error: {str(e)}")
        return internal_error_response()
