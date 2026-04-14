
import { useState, useEffect } from 'react';

export interface User {
  id: string;
  full_name: string;
  email: string;
  profile_slug: string;
  is_admin: boolean;
  community_role: string;
  functional_role?: string;
  company_name: string;
  designation: string;
  phone?: string;
  profile_photo_url?: string;
  about_yourself?: string;
  building_description?: string;
  startup_support_needs?: string;
  experiences_interests_skills?: string;
  about_company?: string;
}

export function useAuth() {
  // Mock auth state for frontend-only mode
  const [user, setUser] = useState<User | null>({
    id: '1',
    full_name: 'John Doe',
    email: 'john@cedat.in',
    profile_slug: 'john-doe',
    is_admin: true,
    community_role: 'Founder',
    company_name: 'Cedat Nexus',
    designation: 'Ecosystem Lead',
    phone: '+91 9876543210',
  });
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (data: any) => {
    console.log('Login attempt:', data);
    setIsAuthenticated(true);
  };

  const register = async (data: any) => {
    console.log('Register attempt:', data);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const refreshUser = async () => {
    console.log('Refreshing user...');
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    isLoginLoading: false,
    loginError: null,
    register,
    isRegisterLoading: false,
    registerError: null,
    logout,
    refreshUser,
  };
}
