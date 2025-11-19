# Frontend-Backend Integration Guide

This guide explains how to integrate the KeySaver frontend with the backend API.

## Overview

The KeySaver application uses:
- **Backend**: Flask API with email-based authentication
- **Frontend**: React + TypeScript
- **Encryption**: Client-side encryption of values using user's passphrase
- **Storage**: Encrypted values stored in SQLite database

## Authentication Flow

### 1. Registration & Verification

```typescript
// Step 1: User enters email
const response = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: userEmail })
});

// Backend sends verification email
// User clicks link with token

// Step 2: Verify email token
const verifyResponse = await fetch('http://localhost:5000/api/auth/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ token: tokenFromURL })
});

const { token, user } = await verifyResponse.json();
// Store token in localStorage/sessionStorage
localStorage.setItem('authToken', token);
```

### 2. Login Flow

```typescript
// Step 1: Request login link
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: userEmail })
});

// Backend sends login link to email
// User clicks link with token

// Step 2: Verify login token
const loginResponse = await fetch('http://localhost:5000/api/auth/verify-login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ token: tokenFromURL })
});

const { token } = await loginResponse.json();
localStorage.setItem('authToken', token);
```

## Client-Side Encryption

### Encryption Utility (to add to frontend)

Create `frontend/src/utils/encryption.ts`:

```typescript
import CryptoJS from 'crypto-js';

export const encryptValue = (value: string, passphrase: string): string => {
  return CryptoJS.AES.encrypt(value, passphrase).toString();
};

export const decryptValue = (encryptedValue: string, passphrase: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedValue, passphrase);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Store passphrase in memory only (never localStorage)
let currentPassphrase: string | null = null;

export const setPassphrase = (passphrase: string) => {
  currentPassphrase = passphrase;
};

export const getPassphrase = (): string | null => {
  return currentPassphrase;
};

export const clearPassphrase = () => {
  currentPassphrase = null;
};
```

Install crypto-js:
```bash
npm install crypto-js
npm install --save-dev @types/crypto-js
```

## API Integration

### Key Management

```typescript
const API_URL = 'http://localhost:5000/api';

// Get auth token
const getAuthHeader = () => ({
  'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
  'Content-Type': 'application/json'
});

// Fetch all keys
export const fetchKeys = async () => {
  const response = await fetch(`${API_URL}/keys`, {
    headers: getAuthHeader()
  });
  return response.json();
};

// Create new key (with encryption)
export const createKey = async (key: string, value: string, tags: string[]) => {
  const passphrase = getPassphrase();
  if (!passphrase) throw new Error('Passphrase not set');
  
  const encryptedValue = encryptValue(value, passphrase);
  
  const response = await fetch(`${API_URL}/keys`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify({ key, value: encryptedValue, tags })
  });
  return response.json();
};

// Update key
export const updateKey = async (id: string, key: string, value: string, tags: string[]) => {
  const passphrase = getPassphrase();
  if (!passphrase) throw new Error('Passphrase not set');
  
  const encryptedValue = encryptValue(value, passphrase);
  
  const response = await fetch(`${API_URL}/keys/${id}`, {
    method: 'PUT',
    headers: getAuthHeader(),
    body: JSON.stringify({ key, value: encryptedValue, tags })
  });
  return response.json();
};

// Delete key
export const deleteKey = async (id: string) => {
  const response = await fetch(`${API_URL}/keys/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader()
  });
  return response.json();
};
```

## Frontend Updates Needed

### 1. Update LoginForm Component

```typescript
// After email verification, show passphrase input
const [step, setStep] = useState<'email' | 'passphrase'>('email');
const [token, setToken] = useState('');

// Handle verification from URL
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const verifyToken = urlParams.get('token');
  if (verifyToken) {
    verifyEmail(verifyToken);
  }
}, []);

const verifyEmail = async (token: string) => {
  const response = await fetch('http://localhost:5000/api/auth/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  });
  
  if (response.ok) {
    const { token: authToken } = await response.json();
    setToken(authToken);
    setStep('passphrase');
  }
};

const handlePassphraseSubmit = (passphrase: string) => {
  setPassphrase(passphrase); // Store in memory
  localStorage.setItem('authToken', token);
  onLoginSuccess();
};
```

### 2. Update KeyManager Component

```typescript
import { fetchKeys, createKey, updateKey, deleteKey } from '../services/api';

// Load keys from backend
useEffect(() => {
  loadKeys();
}, []);

const loadKeys = async () => {
  try {
    const { keys } = await fetchKeys();
    // Decrypt values on display
    const passphrase = getPassphrase();
    const decryptedKeys = keys.map(key => ({
      ...key,
      value: decryptValue(key.value, passphrase)
    }));
    setEntries(decryptedKeys);
  } catch (error) {
    console.error('Failed to load keys:', error);
  }
};

const addEntry = async (key: string, value: string, tags: string[]) => {
  try {
    await createKey(key, value, tags);
    await loadKeys();
  } catch (error) {
    console.error('Failed to add key:', error);
  }
};
```

### 3. Create Passphrase Dialog Component

```typescript
// frontend/src/components/PassphraseDialog.tsx
export function PassphraseDialog({ onSubmit }: { onSubmit: (passphrase: string) => void }) {
  const [passphrase, setPassphrase] = useState('');
  
  return (
    <Dialog open={true}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Your Passphrase</DialogTitle>
          <DialogDescription>
            This passphrase will be used to encrypt your keys. 
            It will never be sent to our servers. Please remember it!
          </DialogDescription>
        </DialogHeader>
        <Input
          type="password"
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
          placeholder="Enter a strong passphrase"
        />
        <Button onClick={() => onSubmit(passphrase)}>
          Continue
        </Button>
      </DialogContent>
    </Dialog>
  );
}
```

## Environment Variables

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Testing the Integration

### 1. Start Backend
```bash
cd backend
./run.sh  # or run.bat on Windows
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Test Flow
1. Enter email in login form
2. Check email for verification link
3. Click link
4. Set passphrase
5. Start adding encrypted keys

## Security Considerations

✅ **Passphrase never sent to server**
✅ **Values encrypted client-side**
✅ **Passphrase stored in memory only**
✅ **Email verification required**
✅ **Token-based authentication**
✅ **Secure token generation**

⚠️ **Important**: The passphrase is cleared on page refresh. Users must re-enter it after refreshing.

## Error Handling

```typescript
try {
  const response = await fetch(url, options);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }
  return response.json();
} catch (error) {
  // Show error to user
  console.error(error);
  // Handle token expiration, network errors, etc.
}
```

## Next Steps

1. Install crypto-js in frontend
2. Create encryption utility functions
3. Update LoginForm for email verification flow
4. Add passphrase dialog component
5. Update KeyManager to use API endpoints
6. Add error handling and loading states
7. Test complete flow end-to-end
