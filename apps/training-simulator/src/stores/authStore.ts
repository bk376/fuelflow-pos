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

// Mock user data for training simulator
const mockTraineeUser: User = {
  id: 'trainee-001',
  tenantId: 'tenant-001',
  email: 'trainee@gasstation.com',
  firstName: 'Alex',
  lastName: 'Trainee',
  employeeId: 'TRN001',
  status: 'active',
  lastLogin: new Date(),
  settings: {
    theme: 'system',
    trainingLevel: 'beginner',
    soundEnabled: true,
    animationsEnabled: true
  },
  locations: [
    {
      id: 'loc-001',
      userId: 'trainee-001',
      locationId: 'location-training',
      roleId: 'role-trainee',
      status: 'active',
      startedAt: new Date('2024-01-01'),
      role: {
        id: 'role-trainee',
        tenantId: 'tenant-001',
        name: 'Trainee',
        description: 'Training access to simulator',
        permissions: [
          { resource: 'training', action: 'participate' },
          { resource: 'scenarios', action: 'play' },
          { resource: 'progress', action: 'view' }
        ],
        isSystemRole: true
      },
      location: {
        id: 'location-training',
        tenantId: 'tenant-001',
        name: 'Training Center - Virtual Station',
        code: 'TRAIN01',
        address: {
          street: 'Virtual Training Environment',
          city: 'Simulator City',
          state: 'Digital',
          zipCode: '00000',
          country: 'Virtual'
        },
        timezone: 'America/Chicago',
        phone: '+1-555-TRAIN',
        email: 'training@gasstation.com',
        status: 'active',
        operatingHours: {
          monday: { open: '00:00', close: '23:59' },
          tuesday: { open: '00:00', close: '23:59' },
          wednesday: { open: '00:00', close: '23:59' },
          thursday: { open: '00:00', close: '23:59' },
          friday: { open: '00:00', close: '23:59' },
          saturday: { open: '00:00', close: '23:59' },
          sunday: { open: '00:00', close: '23:59' }
        },
        fuelGrades: ['Regular', 'Plus', 'Premium', 'Diesel'],
        services: ['Training Scenarios', 'Skill Assessment', 'Progress Tracking'],
        settings: {
          gamificationEnabled: true,
          difficultyScaling: true,
          achievementsEnabled: true
        }
      }
    }
  ]
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

      // Demo credentials for training simulator
      if (credentials.email === 'trainee@gasstation.com' && credentials.password === 'train123') {
        const token = 'mock-trainee-jwt-token';
        
        // Store in localStorage
        localStorage.setItem('training-token', token);
        localStorage.setItem('training-user', JSON.stringify(mockTraineeUser));

        set({
          user: mockTraineeUser,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        throw new Error('Invalid training credentials');
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('training-token');
    localStorage.removeItem('training-user');
    
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  refreshToken: async () => {
    const storedToken = localStorage.getItem('training-token');
    const storedUser = localStorage.getItem('training-user');

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