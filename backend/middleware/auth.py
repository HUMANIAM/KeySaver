from functools import wraps
from flask import request, jsonify, current_app, g
from models import User  # User model from models package
from utils.tokens import verify_token
from constants import SESSION_TOKEN_MAX_AGE, HTTP_UNAUTHORIZED, ERROR_UNAUTHORIZED


def extract_token_from_header():
    """
    Extract Bearer token from Authorization header
    
    Returns:
        str: Token string or None if not found/invalid format
    """
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    
    try:
        return auth_header.split(' ')[1]
    except IndexError:
        return None


def get_current_user_from_token(token: str):
    """
    Validate token and fetch user
    
    Args:
        token: JWT token string
        
    Returns:
        User object or None if invalid
    """
    try:
        email = verify_token(token, purpose='session', max_age=SESSION_TOKEN_MAX_AGE)
        user = User.query.filter_by(email=email, is_verified=True).first()
        return user
    except (ValueError, Exception) as e:
        current_app.logger.warning(f"Token validation failed: {str(e)}")
        return None


def require_auth(f):
    """
    Decorator to require authentication for endpoint
    
    WHY: Apply authentication consistently across all protected routes
    USAGE:
        @require_auth
        def my_endpoint():
            user = g.current_user  # Automatically available
            ...
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = extract_token_from_header()
        unauth_response = jsonify({'error': ERROR_UNAUTHORIZED}), HTTP_UNAUTHORIZED

        if not token:
            return unauth_response
        
        user = get_current_user_from_token(token)
        if not user:
            return unauth_response
        
        # Store user in Flask's g object for access in route handler
        g.current_user = user
        
        return f(*args, **kwargs)
    
    return decorated_function

