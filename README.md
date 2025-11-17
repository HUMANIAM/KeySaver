# Key Saver

A secure and intuitive web application for managing key-value pairs with tag-based organization. Built with React, TypeScript, and modern UI components.

## 📋 Overview

Key Saver is a client-side application that allows users to securely store, search, update, and delete key-value pairs (such as API keys, passwords, configuration values, etc.) with an organized tagging system for easy categorization and retrieval.

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

- **Frontend Framework**: React 18.3.1
- **Language**: TypeScript
- **Build Tool**: Vite 6.3.5
- **UI Components**: Radix UI primitives
- **Styling**: Tailwind CSS
- **Form Management**: React Hook Form
- **Icons**: Lucide React


## 🚀 Getting Started

### Prerequisites
- Node.js (v20 or higher recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone git@github.com:HUMANIAM/KeySaver.git
cd KeySaver
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

The optimized production build will be available in the `dist/` directory.


