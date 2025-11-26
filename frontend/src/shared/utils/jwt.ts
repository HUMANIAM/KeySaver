/**
 * JWT token utilities for frontend validation
 * Backend generates real JWTs for session tokens with exp/iat claims
 * Frontend can decode and validate token expiration client-side
 */

interface JWTPayload {
  exp: number;     // Expiration timestamp (Unix epoch seconds)
  email: string;   // User's email address
  iat: number;     // Issued at timestamp (Unix epoch seconds)
}

function base64UrlDecode(str : string) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    return atob(str);
}

/**
 * Decode JWT token without verification (frontend validation only)
 * @param token JWT token string
 * @returns Decoded payload or null if invalid
 */
function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    return payload;
  } catch {
    return null;
  }
}

/**
 * Check if JWT token is expired
 * @param token JWT token string
 * @returns true if expired or invalid, false if valid
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return true;
  
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

