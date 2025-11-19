import { useState, useRef } from 'react';
import Header from './components/Header';
import LoginForm from './components/auth/LoginForm';
import KeyManager from './components/KeyManager';

function App() {
  // State: Controls login form visibility
  const [showLogin, setShowLogin] = useState(true);
  
  // State: Track if user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Ref: Access to LoginForm's exposed methods
  const loginFormRef = useRef(null);

  // Handler: Focus email field when login button is clicked
  const handleLoginClick = () => {
    setShowLogin(true);
    loginFormRef.current?.focusEmail();
  };

  // Handler: Handle successful login
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowLogin(false);
  };

  // Handler: Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowLogin(true);
  };

  // Handler: Close login form
  const handleCloseLogin = () => {
    setShowLogin(false);
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
