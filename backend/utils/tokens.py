from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature
from flask import current_app
import jwt
from datetime import datetime, timedelta
from constants import (
    EMAIL_VERIFICATION_PURPOSE, SESSION_PURPOSE, 
    JWT_ALGORITHM, JWT_SESSION_DURATION_MINUTES,
    EMAIL_VERIFICATION_TOKEN_MAX_AGE
)

def generate_token(email: str, purpose: str = EMAIL_VERIFICATION_PURPOSE) -> str:
    """
    Generate a secure token for email verification or session authentication
    
    Args:
        email: User's email address
        purpose: Token purpose (${EMAIL_VERIFICATION_PURPOSE} or ${SESSION_PURPOSE})
    
    Returns:
        Secure token string (itsdangerous for email, JWT for session)
    """
    secret_key = current_app.config['SECRET_KEY']
    
    if purpose == SESSION_PURPOSE:
        # JWT for session tokens - frontend can decode and read exp/iat
        payload = {
            'email': email,
            'iat': datetime.utcnow(),
            'exp': datetime.utcnow() + timedelta(minutes=JWT_SESSION_DURATION_MINUTES)
        }
        return jwt.encode(payload, secret_key, algorithm=JWT_ALGORITHM)
    else:
        # itsdangerous for email verification - one-time, timed, URL-safe
        serializer = URLSafeTimedSerializer(secret_key)
        return serializer.dumps({'email': email}, salt=purpose)


def verify_token(token: str, purpose: str = EMAIL_VERIFICATION_PURPOSE, max_age: int = EMAIL_VERIFICATION_TOKEN_MAX_AGE) -> str:
    """
    Verify and decode a token
    
    Args:
        token: Token to verify
        purpose: Expected Token purpose (${EMAIL_VERIFICATION_PURPOSE} or ${SESSION_PURPOSE})       
        max_age: Maximum age in seconds (used for itsdangerous tokens)
    
    Returns:
        Email address if valid
    
    Raises:
        ValueError: If token has expired or is invalid
    """
    secret_key = current_app.config['SECRET_KEY']
    
    if purpose == SESSION_PURPOSE:
        # JWT verification - exp is built into the token
        try:
            payload = jwt.decode(token, secret_key, algorithms=[JWT_ALGORITHM])
            return payload['email']
        except jwt.ExpiredSignatureError:
            raise ValueError('Token has expired')
        except jwt.InvalidTokenError:
            raise ValueError('Invalid token')
    else:
        # itsdangerous verification with max_age
        serializer = URLSafeTimedSerializer(secret_key)
        try:
            data = serializer.loads(token, salt=purpose, max_age=max_age)
            return data['email']
        except SignatureExpired:
            raise ValueError('Token has expired')
        except BadSignature:
            raise ValueError('Invalid token')
