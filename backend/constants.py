"""
Application constants
WHY: Centralize magic numbers and strings for maintainability
BENEFIT: Single source of truth, easy to modify, semantic meaning
"""

# Token expiration times (in seconds)
SESSION_TOKEN_MAX_AGE = 86400 * 30  # 30 days
EMAIL_VERIFICATION_TOKEN_MAX_AGE = 900  # 15 minutes  
EMAIL_VERIFICATION_PURPOSE = 'email-verification'
SESSION_PURPOSE = 'session'

# Passphrase validation
PASSPHRASE_VALIDATION_STRING = "PASSPHRASE_VALIDATION_TEST"

# HTTP Status Codes (for clarity)
HTTP_OK = 200
HTTP_CREATED = 201
HTTP_BAD_REQUEST = 400
HTTP_UNAUTHORIZED = 401
HTTP_NOT_FOUND = 404
HTTP_CONFLICT = 409
HTTP_INTERNAL_ERROR = 500

# Error messages (standardized)
ERROR_UNAUTHORIZED = "Unauthorized"
ERROR_INVALID_TOKEN = "Invalid or expired token"
ERROR_USER_NOT_FOUND = "User not found"
ERROR_INVALID_DATA = "Invalid data"
ERROR_INTERNAL = "An error occurred"
