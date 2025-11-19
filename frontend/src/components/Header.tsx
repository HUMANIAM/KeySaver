import logo from '../assets/logo.png';

// Logo Component
const Logo = () => {
  return (
    <div className="flex flex-col items-center">
      <img src={logo} alt="KeySaver Logo" className="h-14" />
      <span className="text-sm font-semibold text-gray-800 tracking-wide mt-1">Key Saver</span>
    </div>
  );
};

// Auth Button Component (Login/Logout)
const AuthButton = ({ onClick, isLoggedIn }: { onClick?: () => void; isLoggedIn?: boolean }) => {
  return (
    <button
      onClick={onClick}
      className="px-6 py-2 bg-gray-50 text-gray-900 font-medium rounded-md border border-gray-200 hover:bg-gray-100 transition-colors"
      aria-label={isLoggedIn ? "Logout" : "Login"}
    >
      {isLoggedIn ? "Log out" : "Log in"}
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
  onAuthClick?: () => void;
  isLoggedIn?: boolean;
}

export default function Header({ onAuthClick, isLoggedIn }: HeaderProps) {
  return (
    <header className="w-full bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Logo />
        <Banner />
        <AuthButton onClick={onAuthClick} isLoggedIn={isLoggedIn} />
      </div>
    </header>
  );
}
