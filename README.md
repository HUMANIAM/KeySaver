# Key Saver

A secure and intuitive web application for managing key-value pairs with tag-based organization and client-side encryption. Built with React, TypeScript, Flask, and SQLAlchemy.

## 📋 Overview

Key Saver is a full-stack application that allows users to securely store, search, update, and delete key-value pairs (such as API keys, passwords, configuration values, etc.) with client-side encryption and an organized tagging system for easy categorization and retrieval.

**Security First**: All sensitive values are encrypted on the client-side using your passphrase before being sent to the server. Your passphrase never leaves your device.

## ✨ Main Functionalities

### 🔐 Add Keys
- Store key-value pairs with custom names
- Secure value input with password masking (show/hide toggle)
- Add multiple tags for categorization
- Tag management with easy add/remove functionality
- Form validation to ensure data integrity

### 🔍 Search Keys
- Real-time search by key name or tags
- Filter entries instantly as you type
- View stored values with reveal/hide toggle for security
- Display all associated tags for each entry
- Clean, organized card-based layout

### ✏️ Update Keys
- Select existing entries from a dropdown
- Modify key names, values, and tags
- Pre-populated form for easy editing
- Maintain data consistency across updates

### 🗑️ Delete Keys
- Browse all stored entries
- Select and remove unwanted key-value pairs
- Confirmation workflow to prevent accidental deletions
- Clean removal from storage

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 6.3.5
- **UI Components**: Radix UI primitives
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Encryption**: CryptoJS (client-side AES)
- **State Management**: Custom hooks with composition pattern

### Backend
- **Framework**: Flask 3.0 (Python)
- **ORM**: SQLAlchemy
- **Database**: SQLite
- **Validation**: Pydantic
- **Email**: Flask-Mail
- **Authentication**: Token-based (itsdangerous)


## 🚀 Getting Started

### Prerequisites
- **Node.js** (v20 or higher)
- **Python** (3.8 or higher)
- **pip** (Python package manager)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment and install dependencies:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Configure environment:
```bash
cp .env.example .env
```

   Then edit `.env` file:
   
   **a) Generate SECRET_KEY:**
   ```bash
   python -c 'import secrets; print(secrets.token_hex(32))'
   ```
   
   **b) Configure for Gmail (example):**
   ```env
   # Flask Configuration
   FLASK_APP=app.py
   
   # Environment: 'development' for local, 'production' for deployment
   FLASK_ENV=development
   
   # Debug Mode: True for development, False for production (IMPORTANT!)
   FLASK_DEBUG=True
   
   # SECURITY: Use the generated secret key from step a)
   SECRET_KEY=a1b2c3d4e5f6789...
   
   DATABASE_URL=sqlite:///keysaver.db
   
   # Email Configuration (Gmail example)
   MAIL_SERVER=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USE_TLS=True
   MAIL_USERNAME=yourname@gmail.com
   MAIL_PASSWORD=abcd efgh ijkl mnop  # 16-char App Password
   MAIL_DEFAULT_SENDER=yourname@gmail.com
   
   # Frontend URL: Update to your actual domain in production
   FRONTEND_URL=http://localhost:5173
   ```
   
   **⚠️ For Production Deployment:**
   ```env
   FLASK_ENV=production
   FLASK_DEBUG=False  # MUST be False in production!
   SECRET_KEY=<strong-random-key>  # Generate a new one
   DATABASE_URL=postgresql://user:pass@host/db  # Use production database
   FRONTEND_URL=https://yourdomain.com  # Your actual domain
   ```
   
   **To get Gmail App Password:**
   - Visit: https://myaccount.google.com/apppasswords
   - Enable 2FA first if not enabled
   - Generate app password for "Mail"
   - Copy the 16-character password

4. Run the backend server:
```bash
python app.py
# Or use: ./run.sh (Linux/Mac) 
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

### Quick Start (Both Servers)

**Terminal 1 - Backend:**
```bash
cd backend
./run.sh  # or run.bat on Windows
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## 🔐 Authentication Flow

### For New Users (First Time):
1. Enter your email address
2. Receive verification email with a link
3. Click the verification link
4. Set your encryption passphrase
5. Start using KeySaver

### For Existing Users (Login):
1. Enter your email address
2. **Immediately** prompted for your passphrase
3. Enter your passphrase
4. Access your encrypted keys


## 🔒 Security Features

- ✅ **Client-side Encryption**: All values encrypted before sending to server
- ✅ **Email Verification**: Only verified users can access the system
- ✅ **Passwordless Auth**: No passwords to remember or store
- ✅ **Token-based Sessions**: Secure authentication tokens
- ✅ **Passphrase Never Stored**: Your passphrase stays on your device
- ✅ **Zero-knowledge Architecture**: Server cannot decrypt your data


