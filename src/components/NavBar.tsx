
import React from 'react';
import { Coins } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface NavBarProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onLoginClick, onRegisterClick }) => {
  const { user, isAuthenticated, logout } = useAuth();
  
  return (
    <nav className="bg-[#0a1128] border-b border-blue-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <div className="w-8 h-8 bg-pokemon-blue rounded-full mr-2 flex items-center justify-center">
              <span className="text-white font-bold">H</span>
            </div>
            <span className="pokemon-font text-lg text-blue-300">Hyathi Center</span>
          </div>
          
          {/* Nav actions */}
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                {/* Coins display */}
                <div className="flex items-center gap-1 bg-pokemon-gold/20 px-3 py-1 rounded-full">
                  <Coins size={16} className="text-pokemon-yellow" />
                  <span className="text-pokemon-yellow pokemon-font text-xs">{user?.coins || 0}</span>
                </div>
                
                {/* Volume icon */}
                <button className="text-white">
                  <span className="sr-only">Toggle sound</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19.07 4.93C20.9447 6.80528 21.9979 9.34836 22 12C22 14.6522 20.9464 17.1957 19.07 19.07M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17 12C17 13.3316 16.4722 14.6044 15.54 15.54" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                {/* Username */}
                <div className="text-white ml-2">
                  {user.username}
                </div>
                
                {/* Logout button */}
                <button 
                  onClick={logout}
                  className="text-white hover:text-blue-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  className="text-white hover:text-blue-300"
                  onClick={onLoginClick}
                >
                  Login
                </button>
                <button 
                  className="text-white bg-blue-800 px-3 py-1 rounded hover:bg-blue-700"
                  onClick={onRegisterClick}
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
