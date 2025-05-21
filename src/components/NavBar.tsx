
// import React, { useState, useEffect } from 'react';
// import { Coins, VolumeX, Volume2 } from 'lucide-react';
// import { useAuth } from '@/context/AuthContext';

// interface NavBarProps {
//   onLoginClick: () => void;
//   onRegisterClick: () => void;
// }

// const NavBar: React.FC<NavBarProps> = ({ onLoginClick, onRegisterClick }) => {
//   const { user, isAuthenticated, logout } = useAuth();
//   const [isMuted, setIsMuted] = useState(false);
  
//   // Handle background music
//   useEffect(() => {
//     const bgMusic = document.getElementById('bgMusic') as HTMLAudioElement | null;
//     if (bgMusic) {
//       bgMusic.muted = isMuted;
//     }
//   }, [isMuted]);
  
//   const toggleMute = () => {
//     setIsMuted(prev => !prev);
//   };
  
//   return (
//     <nav className="bg-[#0a1128] border-b border-blue-900 shadow-md">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16 items-center">
//           {/* Logo */}
//           <div className="flex-shrink-0 flex items-center">
//             <div className="w-8 h-8 bg-pokemon-blue rounded-full mr-2 flex items-center justify-center">
//               <span className="text-white font-bold">H</span>
//             </div>
//             <span className="pokemon-font text-lg text-blue-300">Hyathi Center</span>
//           </div>
          
//           {/* Nav actions */}
//           <div className="flex items-center gap-4">
//             {isAuthenticated && user ? (
//               <>
//                 {/* Coins display */}
//                 <div className="flex items-center gap-1 bg-pokemon-gold/20 px-3 py-1 rounded-full">
//                   <Coins size={16} className="text-pokemon-yellow" />
//                   <span className="text-pokemon-yellow pokemon-font text-xs">{user?.coins || 0}</span>
//                 </div>
                
//                 {/* Volume icon */}
//                 <button className="text-white hover:text-blue-300" onClick={toggleMute}>
//                   <span className="sr-only">Toggle sound</span>
//                   {isMuted ? (
//                     <VolumeX size={18} />
//                   ) : (
//                     <Volume2 size={18} />
//                   )}
//                 </button>
                
//                 {/* Username */}
//                 <div className="text-white ml-2">
//                   {user.username}
//                 </div>
                
//                 {/* Logout button */}
//                 <button 
//                   onClick={logout}
//                   className="text-white hover:text-blue-300"
//                 >
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <>
//                 <button 
//                   className="text-white hover:text-blue-300"
//                   onClick={onLoginClick}
//                 >
//                   Login
//                 </button>
//                 <button 
//                   className="text-white bg-blue-800 px-3 py-1 rounded hover:bg-blue-700"
//                   onClick={onRegisterClick}
//                 >
//                   Register
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default NavBar;




import React, { useState, useEffect } from 'react';
import { Coins, VolumeX, Volume2, User, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface NavBarProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onLoginClick, onRegisterClick }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMuted, setIsMuted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Handle background music
  useEffect(() => {
    const bgMusic = document.getElementById('bgMusic') as HTMLAudioElement | null;
    if (bgMusic) {
      bgMusic.muted = isMuted;
    }
  }, [isMuted]);
  
  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };
  
  return (
    <nav className="bg-[#0a1128] border-b border-blue-900 shadow-md">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 xs:h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <div className="w-7 h-7 xs:w-8 xs:h-8 bg-pokemon-blue rounded-full mr-2 flex items-center justify-center">
              <span className="text-white font-bold text-xs xs:text-sm">H</span>
            </div>
            <span className="pokemon-font text-base xs:text-lg text-blue-300">Hyathi Center</span>
          </div>
          
          {/* Mobile menu button - now using User icon instead of hamburger */}
          <div className="md:hidden">
            <button 
              className="text-white p-1"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <User size={20} />}
            </button>
          </div>
          
          {/* Desktop nav actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                {/* Coins display */}
                <div className="flex items-center gap-1 bg-pokemon-gold/20 px-3 py-1 rounded-full">
                  <Coins size={16} className="text-pokemon-yellow" />
                  <span className="text-pokemon-yellow pokemon-font text-xs">{user?.coins || 0}</span>
                </div>
                
                {/* Volume icon */}
                <button className="text-white hover:text-blue-300" onClick={toggleMute}>
                  <span className="sr-only">Toggle sound</span>
                  {isMuted ? (
                    <VolumeX size={18} />
                  ) : (
                    <Volume2 size={18} />
                  )}
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
        
        {/* Mobile menu - Now showing coins and mute button */}
        {isMenuOpen && (
          <div className="md:hidden py-2 border-t border-blue-900">
            <div className="space-y-2 px-2">
              {isAuthenticated && user ? (
                <>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-white">{user.username}</span>
                    <div className="flex items-center gap-3">
                      {/* Added mute button */}
                      <button className="text-white hover:text-blue-300" onClick={toggleMute}>
                        <span className="sr-only">Toggle sound</span>
                        {isMuted ? (
                          <VolumeX size={18} />
                        ) : (
                          <Volume2 size={18} />
                        )}
                      </button>
                      
                      {/* Coins display */}
                      <div className="flex items-center gap-1 bg-pokemon-gold/20 px-2 py-1 rounded-full">
                        <Coins size={14} className="text-pokemon-yellow" />
                        <span className="text-pokemon-yellow pokemon-font text-xs">{user?.coins || 0}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-t border-blue-900/50">
                    <button 
                      onClick={logout}
                      className="text-white bg-blue-800 px-3 py-1 text-sm rounded hover:bg-blue-700"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <button 
                    className="text-white py-2 text-left"
                    onClick={() => {
                      onLoginClick();
                      setIsMenuOpen(false);
                    }}
                  >
                    Login
                  </button>
                  <button 
                    className="text-white bg-blue-800 px-3 py-1 rounded hover:bg-blue-700"
                    onClick={() => {
                      onRegisterClick();
                      setIsMenuOpen(false);
                    }}
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;