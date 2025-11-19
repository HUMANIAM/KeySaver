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
- **Encryption**: CryptoJS (client-side)

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
# Edit .env with your email credentials
```

4. Run the backend server:
```bash
python app.py
# Or use: ./run.sh (Linux/Mac) or run.bat (Windows)
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

1. **Registration**:
   - Enter your email address
   - Receive verification email
   - Click verification link
   - Set your encryption passphrase
   - Start using KeySaver

2. **Login**:
   - Enter your email address
   - Receive login link via email
   - Click the link
   - Enter your passphrase (for decryption)
   - Access your encrypted keys

## 📚 Documentation

- **Backend API**: See [backend/README.md](backend/README.md)
- **Integration Guide**: See [INTEGRATION.md](INTEGRATION.md)
- **Frontend Setup**: See [frontend/README.md](frontend/README.md)

## 🔒 Security Features

- ✅ **Client-side Encryption**: All values encrypted before sending to server
- ✅ **Email Verification**: Only verified users can access the system
- ✅ **Passwordless Auth**: No passwords to remember or store
- ✅ **Token-based Sessions**: Secure authentication tokens
- ✅ **Passphrase Never Stored**: Your passphrase stays on your device
- ✅ **Zero-knowledge Architecture**: Server cannot decrypt your data

## 📁 Project Structure

```
KeySaver/
├── backend/              # Flask API server
│   ├── app.py           # Main application
│   ├── models.py        # Database models
│   ├── schemas.py       # Pydantic schemas
│   ├── routes/          # API endpoints
│   └── utils/           # Helper functions
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── types/       # TypeScript types
│   │   └── utils/       # Utility functions
│   └── public/
└── INTEGRATION.md       # Integration guide


