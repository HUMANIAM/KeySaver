from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature
from flask import current_app

def generate_token(email: str, purpose: str = 'email-verification') -> str:
    """
    Generate a secure token for email verification or login
    
    Args:
        email: User's email address
        purpose: Token purpose (email-verification, login)
    
    Returns:
        Secure token string
    """
    serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    return serializer.dumps(email, salt=purpose)


def verify_token(token: str, purpose: str = 'email-verification', max_age: int = 3600) -> str:
    """
    Verify and decode a token
    
    Args:
        token: Token to verify
        purpose: Expected token purpose
        max_age: Maximum age in seconds
    
    Returns:
        Email address if valid
    
    Raises:
        SignatureExpired: If token has expired
        BadSignature: If token is invalid
    """
    serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    try:
        email = serializer.loads(token, salt=purpose, max_age=max_age)
        return email
    except SignatureExpired:
        raise ValueError('Token has expired')
    except BadSignature:
        raise ValueError('Invalid token')
