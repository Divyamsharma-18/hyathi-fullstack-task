
import React from 'react';
import { Button } from '@/components/ui/button';
import { Coins } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface NavBarProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onLoginClick, onRegisterClick }) => {
  const { user, isAuthenticated, logout } = useAuth();
  
  return (
    <nav className="bg-pokemon-blue text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-xl font-bold">Hyathi's Pokémon Adoption</span>
          </div>
          
          {/* Nav actions */}
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                {/* User coins */}
                <div className="flex items-center bg-blue-800 rounded-full px-3 py-1">
                  <Coins className="h-4 w-4 mr-1 text-pokemon-yellow" />
                  <span className="font-medium">{user.coins}</span>
                </div>
                
                {/* Username */}
                <div className="hidden md:block">
                  <span className="font-medium">Trainer {user.username}</span>
                </div>
                
                {/* Logout button */}
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/20"
                  onClick={logout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-white/20"
                  onClick={onLoginClick}
                >
                  Login
                </Button>
                <Button 
                  className="bg-pokemon-yellow text-black hover:bg-yellow-400"
                  onClick={onRegisterClick}
                >
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
