'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserLogin, UserRegister } from '@/types/auth.types';
import { authService } from '@/lib/auth';
import { logger } from '@/lib/logger';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: UserLogin) => Promise<void>;
  register: (userData: UserRegister) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = authService.getCurrentUser();
        if (storedUser && authService.isAuthenticated()) {
          setUser(storedUser);
          logger.info('User loaded from localStorage', { username: storedUser.username });
        }
      } catch (error) {
        logger.error('Failed to load user', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (credentials: UserLogin) => {
    try {
      setLoading(true);
      const { user: loggedInUser } = await authService.login(credentials);
      setUser(loggedInUser);
      logger.info('User logged in via context', { username: loggedInUser.username });
    } catch (error) {
      logger.error('Login failed in context', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: UserRegister) => {
    try {
      setLoading(true);
      await authService.register(userData);
      logger.info('User registered via context', { username: userData.username });
      // Auto-login after registration
      await login({ username: userData.username, password: userData.password });
    } catch (error) {
      logger.error('Registration failed in context', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    logger.info('User logged out via context');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
