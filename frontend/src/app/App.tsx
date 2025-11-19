import { useState, useRef, useEffect } from 'react';
import Header from '../shared/components/Header';
import LoginForm from '../features/auth/LoginForm';
import KeyManager from '../features/keys/KeyManager';
import { getToken, clearToken } from '../services/api';
import { clearPassphrase } from '../shared/utils/encryption';
import type { LoginFormRef } from '../features/auth/LoginForm';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const loginFormRef = useRef<LoginFormRef>(null);

  // Check for existing token on mount - always show login initially
  useEffect(() => {
    setShowLogin(true);
  }, []);

  const handleLoginClick = () => {
    setShowLogin(true);
    loginFormRef.current?.focusEmail();
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    clearToken();
    clearPassphrase();
    setIsAuthenticated(false);
    setShowLogin(true);
  };

  const handleCloseLogin = () => {
    if (getToken()) {
      setShowLogin(false);
    }
  };

  // If authenticated, show KeyManager with Header
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <Header onAuthClick={handleLogout} isLoggedIn={true} />
        <KeyManager />
      </div>
    );
  }

  // Otherwise, show login screen
  return (
    <div className="min-h-screen bg-white">
      <Header onAuthClick={handleLoginClick} isLoggedIn={false} />
      {showLogin && (
        <LoginForm 
          ref={loginFormRef} 
          onClose={handleCloseLogin}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}

export default App;
