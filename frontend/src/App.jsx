import { useState, useRef } from 'react';
import Header from './components/Header';
import LoginForm from './components/auth/LoginForm';

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const loginFormRef = useRef(null);

  const handleLoginClick = () => {
    // Trigger focus on email field in LoginForm
    if (loginFormRef.current) {
      loginFormRef.current.focusEmail();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onLoginClick={handleLoginClick} />
      {showLogin && <LoginForm ref={loginFormRef} onClose={() => setShowLogin(false)} />}
    </div>
  );
}

export default App;
