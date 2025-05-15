
import React, { useState } from 'react';
import EntryScreen from '@/components/EntryScreen';
import TrainerIntro from '@/components/TrainerIntro';
import AdoptionCenter from '@/pages/AdoptionCenter';
import NavBar from '@/components/NavBar';
import AuthForms from '@/components/AuthForms';
import { AuthProvider } from '@/context/AuthContext';

enum AppState {
  Entry,
  TrainerIntro,
  AdoptionCenter
}

const Index: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.Entry);
  const [showAuthForms, setShowAuthForms] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  
  // Function to handle progression through app states
  const handleProgressToState = (state: AppState) => {
    setAppState(state);
  };
  
  // Handle login modal
  const handleOpenLogin = () => {
    setAuthTab('login');
    setShowAuthForms(true);
  };
  
  // Handle register modal
  const handleOpenRegister = () => {
    setAuthTab('register');
    setShowAuthForms(true);
  };
  
  const handleCloseAuth = () => {
    setShowAuthForms(false);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        {appState === AppState.Entry && (
          <EntryScreen onEnter={() => handleProgressToState(AppState.TrainerIntro)} />
        )}
        
        {appState > AppState.Entry && (
          <NavBar
            onLoginClick={handleOpenLogin}
            onRegisterClick={handleOpenRegister}
          />
        )}
        
        {appState === AppState.TrainerIntro && (
          <div className="container mx-auto pt-8">
            <TrainerIntro onContinue={() => handleProgressToState(AppState.AdoptionCenter)} />
          </div>
        )}
        
        {appState === AppState.AdoptionCenter && (
          <AdoptionCenter />
        )}
        
        <AuthForms
          isOpen={showAuthForms}
          onClose={handleCloseAuth}
          defaultTab={authTab}
        />
      </div>
    </AuthProvider>
  );
};

export default Index;
