from flask import Blueprint, request, g, current_app
from pydantic import ValidationError

from schemas import UserLoginSchema, SetPassphraseSchema, SetValidatorSchema  # From schemas package
from services.auth_service import AuthService
from middleware.auth import require_auth
from utils.responses import (
    success_response, validation_error_response,
    unauthorized_response, not_found_response, internal_error_response
)
from utils.tokens import verify_token
from constants import EMAIL_VERIFICATION_TOKEN_MAX_AGE, EMAIL_VERIFICATION_PURPOSE, SESSION_PURPOSE

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@auth_bp.route('/send-link', methods=['POST'])
def send_link():
    """\n    Send authentication link\n    WHY: Service layer handles business logic, route only handles HTTP\n    """
    try:
        data = UserLoginSchema(**request.json)
        user = AuthService.get_or_create_user(data.email)
        
        if user.is_verified:
            # User already verified - return session token WITH validator for decryption
            session_token = AuthService.create_session_for_user(user)
            return success_response(data={
                'message': 'User verified',
                'token': session_token,
                'verified': True,
                'user': user.to_dict(include_validator=True)  # Include validator for login
            })
        
        # Generate and send verification link for unverified users
        frontend_url = current_app.config['FRONTEND_URL']
        AuthService.generate_and_send_verification_link(user, frontend_url)
        
        return success_response(data={
            'message': 'Verification link sent! Check your email.',
            'verified': False
        })
        
    except ValidationError as e:
        return validation_error_response(e.errors())
    except Exception as e:
        current_app.logger.error(f"Send link error: {str(e)}")
        return internal_error_response()


@auth_bp.route('/verify', methods=['POST'])
def verify_email():
    """\n    Verify email address using token\n    WHY: Service layer handles verification logic\n    """
    try:
        token = request.json.get('token')
        if not token:
            return validation_error_response({'token': 'Token is required'})
        
        # Verify token
        email = verify_token(token, EMAIL_VERIFICATION_PURPOSE, max_age=EMAIL_VERIFICATION_TOKEN_MAX_AGE)
        if not email:
            return unauthorized_response('Invalid or expired token')
        
        # Get user
        user = AuthService.get_user_by_email(email)
        if not user:
            return not_found_response('User not found')
        
        # Verify user and generate session
        session_token = AuthService.verify_user(user)
        
        return success_response(data={
            'message': 'Email verified successfully',
            'token': session_token,
            'user': user.to_dict()  # Don't include validator yet - user needs to set it
        })
        
    except Exception as e:
        current_app.logger.error(f"Verification error: {str(e)}")
        return internal_error_response()


@auth_bp.route('/set-validator', methods=['POST'])
@require_auth
def set_validator():
    """
    Store encrypted passphrase validator
    WHY: @require_auth eliminates boilerplate, service layer handles storage
    """
    try:
        data = SetValidatorSchema(**request.json)
        AuthService.set_passphrase_validator(g.current_user, data.validator)
        
        return success_response(message='Validator set successfully')
        
    except ValidationError as e:
        return validation_error_response(e.errors())
    except Exception as e:
        current_app.logger.error(f"Set validator error: {str(e)}")
        return internal_error_response()


@auth_bp.route('/user-validator', methods=['GET'])
@require_auth
def get_user_validator():
    """
    Get user's passphrase validator for validation on refresh
    WHY: Needed when user refreshes page and needs to re-enter passphrase
    """
    try:
        return success_response(data={
            'validator': g.current_user.passphrase_validator
        })
    except Exception as e:
        current_app.logger.error(f"Get user validator error: {str(e)}")
        return internal_error_response()


@auth_bp.route('/validate-session', methods=['POST'])
@require_auth
def validate_session():
    """\n    Validate if session token is still valid\n    WHY: @require_auth handles all validation, route just returns user data\n    """
    try:
        return success_response(data={
            'valid': True,
            'user': g.current_user.to_dict()
        })
    except Exception as e:
        current_app.logger.error(f"Validate session error: {str(e)}")
        return internal_error_response()
