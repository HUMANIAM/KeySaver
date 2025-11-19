# KeySaver Quick Start Guide

## ✅ What's Been Done

- ✅ Backend API implemented with Flask
- ✅ Email verification system configured
- ✅ Client-side encryption integrated
- ✅ Frontend connected to backend
- ✅ All localStorage references removed

## 🚀 Start the Application

### Terminal 1: Start Backend

```bash
cd backend
source venv/bin/activate  # Already activated
python app.py
```

**Backend runs on:** `http://localhost:5000`

### Terminal 2: Start Frontend

```bash
cd frontend
npm run dev
```

**Frontend runs on:** `http://localhost:5173`

## 📧 Test the Flow

1. **Open** http://localhost:5173
2. **Enter your email** (eng.i.saad94@gmail.com)
3. **Check your Gmail** for verification/login link
4. **Click the link** in email
5. **Enter passphrase** (create a strong one)
6. **Start adding encrypted keys!**

## 🔐 How It Works

1. **Email Verification**: User enters email → receives magic link
2. **Passphrase Setup**: After verification, user sets encryption passphrase
3. **Client-Side Encryption**: All values encrypted with AES before sending to server
4. **Zero-Knowledge**: Server stores encrypted data, cannot decrypt it
5. **Session Persistence**: Auth token in localStorage, passphrase in memory only

## 🔑 Key Features

- **Passwordless Auth**: No passwords to remember
- **Client-Side Encryption**: CryptoJS AES encryption
- **Passphrase Never Sent**: Stays on your device only
- **Session Management**: Token persists, passphrase cleared on refresh
- **Secure by Design**: Zero-knowledge architecture

## 🛠️ Architecture

```
User Input → Encrypt (client) → API → SQLite (encrypted)
                ↓
          Passphrase (memory only)
```

## 📝 Configuration

**Backend** (`.env`):
- ✅ Email credentials configured
- ✅ SECRET_KEY set
- ✅ Frontend URL configured

**Frontend** (`.env.local`):
- ✅ API URL set to localhost:5000

## 🔒 Security Notes

- Passphrase stored in memory only (cleared on refresh)
- Auth token in localStorage (persists across refreshes)
- All values encrypted before leaving browser
- Server cannot decrypt your data
- Email verification required for all accounts

## 🐛 Troubleshooting

**Backend won't start:**
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

**Frontend errors:**
```bash
cd frontend
npm install
npm run dev
```

**Email not sending:**
- Check `.env` credentials
- Verify Gmail app password is correct
- Check spam folder

**"Passphrase not set" error:**
- Refresh forces passphrase re-entry
- This is by design for security
- Enter passphrase again after page reload

## ✨ You're All Set!

The app is fully integrated and ready to use. Enjoy secure, encrypted key management! 🎉
