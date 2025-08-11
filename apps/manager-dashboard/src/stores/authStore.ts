import { create } from 'zustand';
import type { User, LoginCredentials } from '@gas-station/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

// Mock user data for development
const mockManagerUser: User = {
  id: 'manager-001',
  tenantId: 'tenant-001',
  email: 'manager@gasstation.com',
  firstName: 'John',
  lastName: 'Manager',
  employeeId: 'MGR001',
  status: 'active',
  lastLoginAt: new Date(),
  settings: {
    theme: 'system',
    notifications: true,
    dashboardLayout: 'default'
  },
  locations: [
    {
      id: 'loc-001',
      userId: 'manager-001',
      locationId: 'location-main',
      roleId: 'role-manager',
      status: 'active',
      startedAt: new Date('2024-01-01'),
      role: {
        id: 'role-manager',
        tenantId: 'tenant-001',
        name: 'Store Manager',
        description: 'Full access to location management',
        permissions: [
          { resource: 'dashboard', action: 'read' },
          { resource: 'analytics', action: 'read' },
          { resource: 'employees', action: 'manage' },
          { resource: 'inventory', action: 'manage' },
          { resource: 'fuel', action: 'manage' },
          { resource: 'reports', action: 'generate' },
          { resource: 'settings', action: 'manage' }
        ],
        isSystemRole: true
      },
      location: {
        id: 'location-main',
        tenantId: 'tenant-001',
        name: 'Main Street Gas Station',
        code: 'MAIN001',
        address: {
          street: '123 Main Street',
          city: 'Springfield',
          state: 'IL',
          zipCode: '62701',
          country: 'USA'
        },
        timezone: 'America/Chicago',
        phone: '+1-555-0123',
        email: 'main@gasstation.com',
        status: 'active',
        operatingHours: {
          monday: { open: '06:00', close: '22:00' },
          tuesday: { open: '06:00', close: '22:00' },
          wednesday: { open: '06:00', close: '22:00' },
          thursday: { open: '06:00', close: '22:00' },
          friday: { open: '06:00', close: '23:00' },
          saturday: { open: '07:00', close: '23:00' },
          sunday: { open: '08:00', close: '21:00' }
        },
        fuelGrades: ['Regular', 'Plus', 'Premium', 'Diesel'],
        services: ['ATM', 'Car Wash', 'Air Pump', 'Propane Exchange'],
        settings: {
          taxRate: 0.08,
          currency: 'USD',
          enableLoyalty: true
        }
      }
    }
  ],
  createdAt: new Date(),
  updatedAt: new Date()
};

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Demo credentials for manager dashboard
      if (credentials.email === 'manager@gasstation.com' && credentials.password === 'manager123') {
        const token = 'mock-manager-jwt-token';
        
        // Store in localStorage
        localStorage.setItem('manager-token', token);
        localStorage.setItem('manager-user', JSON.stringify(mockManagerUser));

        set({
          user: mockManagerUser,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        throw new Error('Invalid manager credentials');
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('manager-token');
    localStorage.removeItem('manager-user');
    
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  refreshToken: async () => {
    const storedToken = localStorage.getItem('manager-token');
    const storedUser = localStorage.getItem('manager-user');

    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        set({
          user,
          token: storedToken,
          isAuthenticated: true,
        });
      } catch (error) {
        // Invalid stored data, clear and logout
        get().logout();
      }
    }
  },
}));

export default useAuthStore;