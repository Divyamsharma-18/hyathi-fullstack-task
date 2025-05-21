
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterCredentials } from '@/types/types';
import { mockApiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await mockApiService.getCurrentUser();
        if (currentUser) {
          // If we have a user, also fetch their adopted Pokémon
          // No need to update the user here as getUserPokemons will handle filtering
          const adoptedPokemons = await mockApiService.getUserPokemons();
          
          // Update the user with their adopted Pokémon (if any)
          if (currentUser) {
            setUser({
              ...currentUser,
              adoptedPokemons: adoptedPokemons || []
            });
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Clear any invalid session data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response = await mockApiService.login(credentials);
      
      // After successful login, get user's Pokémon - these are already filtered by user ID
      const adoptedPokemons = await mockApiService.getUserPokemons();
      
      // Set the user with their Pokémon
      const updatedUser = {
        ...response.user,
        adoptedPokemons
      };
      
      setUser(updatedUser);
      
      toast({
        title: "Welcome back!",
        description: `Logged in as ${response.user.username}`,
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || 'An error occurred during login',
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      setIsLoading(true);
      const response = await mockApiService.register(credentials);
      
      // New users start with no Pokémon
      setUser({
        ...response.user,
        adoptedPokemons: []
      });
      
      toast({
        title: "Registration successful!",
        description: `Welcome, ${response.user.username}!`,
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || 'An error occurred during registration',
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await mockApiService.logout();
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || 'An error occurred during logout',
        variant: "destructive",
      });
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    
    // Also update in localStorage to persist changes
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user,
        isLoading, 
        login, 
        register, 
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// This is the important part - making sure we export the useAuth hook correctly
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
