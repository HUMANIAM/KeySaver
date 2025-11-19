"""
Standardized API response formatters
WHY: Ensure consistent response format across all endpoints
BEFORE: Inconsistent response structures make frontend parsing difficult
AFTER: Predictable, well-structured responses
BENEFITS:
- Frontend can reliably parse responses
- Better error handling
- Self-documenting API
- Easier to version
"""

from typing import Any, Dict, Optional
from flask import jsonify
from constants import *


def success_response(data: Any = None, message: Optional[str] = None, status: int = HTTP_OK):
    """
    Standard success response
    
    Args:
        data: Response payload
        message: Optional success message
        status: HTTP status code
        
    Returns:
        Flask JSON response
    """
    response = {}
    if message:
        response['message'] = message
    if data is not None:
        response['data'] = data
    
    return jsonify(response), status


def error_response(error: str, details: Any = None, status: int = HTTP_BAD_REQUEST):
    """
    Standard error response
    
    Args:
        error: Error message
        details: Optional error details (validation errors, etc.)
        status: HTTP status code
        
    Returns:
        Flask JSON response
    """
    response = {'error': error}
    if details:
        response['details'] = details
    
    return jsonify(response), status


def created_response(data: Any, message: str = "Created successfully"):
    """Shorthand for 201 Created response"""
    return success_response(data=data, message=message, status=HTTP_CREATED)


def unauthorized_response(message: str = ERROR_UNAUTHORIZED):
    """Shorthand for 401 Unauthorized"""
    return error_response(error=message, status=HTTP_UNAUTHORIZED)


def not_found_response(message: str = ERROR_USER_NOT_FOUND):
    """Shorthand for 404 Not Found"""
    return error_response(error=message, status=HTTP_NOT_FOUND)


def conflict_response(message: str):
    """Shorthand for 409 Conflict"""
    return error_response(error=message, status=HTTP_CONFLICT)


def validation_error_response(errors: Any):
    """Shorthand for validation errors"""
    return error_response(
        error=ERROR_INVALID_DATA,
        details=errors,
        status=HTTP_BAD_REQUEST
    )


def internal_error_response(message: str = ERROR_INTERNAL):
    """Shorthand for 500 Internal Error"""
    return error_response(error=message, status=HTTP_INTERNAL_ERROR)
