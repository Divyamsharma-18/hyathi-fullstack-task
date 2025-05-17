import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';

interface AuthFormsProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

const AuthForms: React.FC<AuthFormsProps> = ({ isOpen, onClose, defaultTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const { login, register, isLoading } = useAuth();

  const validateLoginForm = () => {
    const errors: Record<string, string> = {};
    
    if (!loginForm.email) {
      errors.email = 'Email is required';
    }
    
    if (!loginForm.password) {
      errors.password = 'Password is required';
    }
    
    return errors;
  };

  const validateRegisterForm = () => {
    const errors: Record<string, string> = {};
    
    if (!registerForm.username) {
      errors.username = 'Username is required';
    }
    
    if (!registerForm.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(registerForm.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!registerForm.password) {
      errors.password = 'Password is required';
    } else if (registerForm.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }
    
    if (registerForm.password !== registerForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateLoginForm();
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      try {
        // Fix the login call - pass only the required credentials
        await login({ email: loginForm.email, password: loginForm.password });
        onClose();
      } catch (error) {
        // Error is handled in the auth context
      }
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateRegisterForm();
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      try {
        // Fix the register call - pass only the required credentials
        await register({ username: registerForm.username, email: registerForm.email, password: registerForm.password });
        onClose();
      } catch (error) {
        // Error is handled in the auth context
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome Trainer!</DialogTitle>
          <DialogDescription>
            Join Hyathi's Pokémon Adoption Center to adopt and care for Pokémon.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'register')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLoginSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input 
                  id="login-email"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                />
                {formErrors.email && <p className="text-red-500 text-xs">{formErrors.email}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input 
                  id="login-password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                />
                {formErrors.password && <p className="text-red-500 text-xs">{formErrors.password}</p>}
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
              
              <p className="text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <button 
                  type="button" 
                  onClick={() => setActiveTab('register')} 
                  className="text-pokemon-blue hover:underline"
                >
                  Register
                </button>
              </p>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleRegisterSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="register-username">Username</Label>
                <Input 
                  id="register-username"
                  value={registerForm.username}
                  onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                />
                {formErrors.username && <p className="text-red-500 text-xs">{formErrors.username}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input 
                  id="register-email"
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                />
                {formErrors.email && <p className="text-red-500 text-xs">{formErrors.email}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <Input 
                  id="register-password"
                  type="password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                />
                {formErrors.password && <p className="text-red-500 text-xs">{formErrors.password}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-confirm-password">Confirm Password</Label>
                <Input 
                  id="register-confirm-password"
                  type="password"
                  value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                />
                {formErrors.confirmPassword && <p className="text-red-500 text-xs">{formErrors.confirmPassword}</p>}
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Registering...' : 'Register'}
              </Button>
              
              <p className="text-center text-sm text-gray-500">
                Already have an account?{' '}
                <button 
                  type="button" 
                  onClick={() => setActiveTab('login')} 
                  className="text-pokemon-blue hover:underline"
                >
                  Login
                </button>
              </p>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthForms;
