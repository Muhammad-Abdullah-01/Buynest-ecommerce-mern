import React, { createContext, useState, useEffect } from 'react';
import * as authService from '../services/authService.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Perform silent refresh check on load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const data = await authService.refresh();
        if (data?.success && data?.user) {
          setUser(data.user);
        }
      } catch (err) {
        console.log('Silent token refresh failed, user is guest');
      } finally {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const loginUser = async (email, password) => {
    setIsLoading(true);
    try {
      const data = await authService.login({ email, password });
      if (data?.success && data?.user) {
        setUser(data.user);
      }
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (name, email, password) => {
    setIsLoading(true);
    try {
      const data = await authService.register({ name, email, password });
      if (data?.success && data?.user) {
        setUser(data.user);
      }
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  const logoutUser = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    setIsLoading(true);
    try {
      const data = await authService.updateProfile(profileData);
      if (data?.success && data?.user) {
        setUser(data.user);
      }
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isLoading,
        login: loginUser,
        register: registerUser,
        logout: logoutUser,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
