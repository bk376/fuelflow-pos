import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, LoginCredentials, User } from '@gas-station/types';

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true });
        
        try {
          // Mock login - replace with actual API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock successful login
          const mockUser: User = {
            id: '1',
            tenantId: 'tenant-1',
            email: credentials.email,
            firstName: 'John',
            lastName: 'Doe',
            employeeId: 'EMP001',
            status: 'active',
            settings: {},
            locations: [{
              id: 'location-1',
              userId: '1',
              locationId: credentials.locationId || 'loc-1',
              roleId: 'cashier-role',
              status: 'active',
              startedAt: new Date(),
              role: {
                id: 'cashier-role',
                tenantId: 'tenant-1',
                name: 'Cashier',
                description: 'POS Terminal Cashier',
                permissions: [
                  { resource: 'transactions', action: 'create' },
                  { resource: 'transactions', action: 'read' },
                  { resource: 'products', action: 'read' },
                  { resource: 'fuel', action: 'authorize' },
                ],
                isSystemRole: true,
              },
              location: {
                id: 'loc-1',
                tenantId: 'tenant-1',
                name: 'Main Street Gas Station',
                code: 'MAIN001',
                address: {
                  street: '123 Main Street',
                  city: 'Anytown',
                  state: 'CA',
                  zipCode: '12345',
                  country: 'USA',
                },
                timezone: 'America/Los_Angeles',
                phone: '(555) 123-4567',
                email: 'main@gasstation.com',
                status: 'active',
                operatingHours: {
                  monday: { open: '06:00', close: '22:00' },
                  tuesday: { open: '06:00', close: '22:00' },
                  wednesday: { open: '06:00', close: '22:00' },
                  thursday: { open: '06:00', close: '22:00' },
                  friday: { open: '06:00', close: '23:00' },
                  saturday: { open: '07:00', close: '23:00' },
                  sunday: { open: '08:00', close: '21:00' },
                },
                fuelGrades: ['regular', 'mid', 'premium', 'diesel'],
                services: ['car_wash', 'convenience_store', 'lottery'],
                settings: {},
              },
            }],
          };

          const mockToken = 'mock-jwt-token-' + Date.now();

          set({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      refreshToken: async () => {
        const { token } = get();
        if (!token) {
          throw new Error('No token available');
        }

        set({ isLoading: true });
        
        try {
          // Mock token refresh - replace with actual API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const newToken = 'refreshed-jwt-token-' + Date.now();
          
          set({
            token: newToken,
            isLoading: false,
          });
        } catch (error) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;