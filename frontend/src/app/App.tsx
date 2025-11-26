import { useState, useRef, useEffect } from 'react';
import Header from '../shared/components/Header';
import LoginForm from '../features/auth/LoginForm';
import KeyManager from '../features/keys/KeyManager';
import { PassphraseModal } from '../features/auth/components/PassphraseModal';
import { getToken, clearToken, setSessionTimeoutCallback } from '../services/api';
import { clearPassphrase, getPassphrase } from '../shared/utils/encryption';
import { isTokenExpired } from '../shared/utils/jwt';
import { 
  startPassphraseTimeout, 
  stopPassphraseTimeout, 
  setPassphraseTimeoutCallback 
} from '../shared/utils/passphraseTimeout';
import type { LoginFormRef } from '../features/auth/LoginForm';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassphraseModal, setShowPassphraseModal] = useState(false);
  const loginFormRef = useRef<LoginFormRef>(null);

  useEffect(() => {
    // Set up session timeout callback
    setSessionTimeoutCallback(() => {
      setIsAuthenticated(false);
      setShowLogin(true);
      setShowPassphraseModal(false);
      stopPassphraseTimeout();
    });

    // Set up passphrase timeout callback
    setPassphraseTimeoutCallback(() => {
      setShowPassphraseModal(true);
    });

    // Check token validity on mount
    const token = getToken();
    const passphrase = getPassphrase();
    
    if (token && !isTokenExpired(token)) {
      // Valid token (JWT with exp claim)
      if (passphrase) {
        // Valid token + passphrase = authenticated
        setIsAuthenticated(true);
        setShowLogin(false);
        startPassphraseTimeout();
      } else {
        // Valid token but no passphrase = show passphrase modal
        setIsAuthenticated(true);
        setShowLogin(false);
        setShowPassphraseModal(true);
      }
    } else {
      // No token or expired token = clear session and show login
      if (token) {
        // Token exists but expired - clean up
        clearToken();
        clearPassphrase();
      }
      setShowLogin(true);
    }

    // Cleanup on unmount
    return () => {
      stopPassphraseTimeout();
    };
  }, []);

  // Monitor JWT expiration while authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkTokenExpiration = () => {
      const token = getToken();
      if (!token || isTokenExpired(token)) {
        // Token expired - logout user
        handleLogout();
      }
    };

    // Check every 10 seconds
    const intervalId = setInterval(checkTokenExpiration, 10000);

    return () => clearInterval(intervalId);
  }, [isAuthenticated]);

  const handleLoginClick = () => {
    setShowLogin(true);
    loginFormRef.current?.focusEmail();
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowLogin(false);
    startPassphraseTimeout();
  };

  const handlePassphraseSuccess = () => {
    setShowPassphraseModal(false);
    startPassphraseTimeout();
  };

  const handleLogout = () => {
    clearToken();
    clearPassphrase();
    setIsAuthenticated(false);
    setShowLogin(true);
    setShowPassphraseModal(false);
    stopPassphraseTimeout();
  };


  // If authenticated, show KeyManager with Header
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <Header onAuthClick={handleLogout} isLoggedIn={true} />
        {showPassphraseModal ? (
          <PassphraseModal 
            isOpen={showPassphraseModal}
            onSuccess={handlePassphraseSuccess}
          />
        ) : (
          <KeyManager />
        )}
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
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}

export default App;
