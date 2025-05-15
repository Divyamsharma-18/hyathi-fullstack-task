
import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService, mockApiService } from '../services/api';
import { User } from '../types/types';
import { useToast } from '../hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // For demo purposes, also check for daily login reward
  useEffect(() => {
    const checkDailyReward = async () => {
      if (isAuthenticated && user) {
        try {
          const lastLogin = new Date(user.lastLogin);
          const currentDate = new Date();
          const dayDiff = (currentDate.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24);
          
          // If it's a new day (more than 24 hours)
          if (dayDiff >= 1) {
            const response = await mockApiService.getDailyLoginReward();
            setUser(response.user);
            toast({
              title: "Daily Reward!",
              description: "You've received 10 coins for logging in today!",
            });
          }
        } catch (err) {
          console.error('Daily reward check failed:', err);
        }
      }
    };

    checkDailyReward();
  }, [isAuthenticated, user, toast]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // For demo purposes use mock service
      const data = await mockApiService.login({ email, password });
      
      setUser(data.user);
      setIsAuthenticated(true);
      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.user.username}!`,
      });
    } catch (err: any) {
      setError(err.message || 'Login failed');
      toast({
        title: "Login Failed",
        description: err.message || 'Login failed. Please try again.',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // For demo purposes use mock service
      const data = await mockApiService.register({ username, email, password });
      
      setUser(data.user);
      setIsAuthenticated(true);
      toast({
        title: "Registration Successful",
        description: `Welcome to Hyathi's Pokémon Adoption Center, ${username}!`,
      });
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      toast({
        title: "Registration Failed",
        description: err.message || 'Registration failed. Please try again.',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('pokemon_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
