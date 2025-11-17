import logo from '../assets/logo.png';
import { LogIn } from 'lucide-react';

// Logo Component
const Logo = () => {
  return (
    <div className="flex flex-col items-center">
      <img src={logo} alt="KeySaver Logo" className="h-14" />
      <span className="text-sm font-semibold text-gray-800 tracking-wide mt-1">Key Saver</span>
    </div>
  );
};

// Login Icon Component
const LoginIcon = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
      aria-label="Login"
    >
      <LogIn className="w-5 h-5" />
      <span>Login</span>
    </button>
  );
};

// Banner Component
const Banner = () => {
  return (
    <div className="flex items-center px-6 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-lg">
      <span className="text-white font-semibold text-sm tracking-wide">
        Securely manage your key-value pairs with tags
      </span>
    </div>
  );
};

interface HeaderProps {
  onLoginClick?: () => void;
}

export default function Header({ onLoginClick }: HeaderProps) {
  return (
    <header className="w-full bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Logo />
        <Banner />
        <LoginIcon onClick={onLoginClick} />
      </div>
    </header>
  );
}
