import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { FuelState, FuelDispenser, FuelTank, FuelPrice, FuelSale } from '@gas-station/types';

const useFuelStore = create<FuelState>()(
  subscribeWithSelector((set, get) => ({
    dispensers: [],
    tanks: [],
    prices: [],
    selectedDispenser: null,
    activeFuelSales: [],

    authorizePump: async (dispenserId: string, amount: number) => {
      const { dispensers } = get();
      const dispenser = dispensers.find(d => d.id === dispenserId);
      
      if (!dispenser || dispenser.status !== 'active') {
        throw new Error('Dispenser not available');
      }

      // Mock authorization process
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newSale: FuelSale = {
        id: `sale-${Date.now()}`,
        dispenserId,
        nozzleId: dispenser.nozzles[0].id, // Default to first nozzle
        authorizedAmount: amount,
        currentAmount: 0,
        gallons: 0,
        pricePerGallon: dispenser.nozzles[0].pricePerUnit,
        status: 'authorized',
        startedAt: new Date(),
      };

      set(state => ({
        activeFuelSales: [...state.activeFuelSales, newSale],
      }));

      // Simulate fuel dispensing
      setTimeout(() => {
        get().simulateFuelDispensing(newSale.id);
      }, 2000);
    },

    completeFuelSale: async (saleId: string) => {
      const { activeFuelSales } = get();
      const sale = activeFuelSales.find(s => s.id === saleId);
      
      if (!sale) {
        throw new Error('Sale not found');
      }

      // Update sale status to completed
      set(state => ({
        activeFuelSales: state.activeFuelSales.map(s =>
          s.id === saleId
            ? { ...s, status: 'completed', completedAt: new Date() }
            : s
        ),
      }));

      // Remove completed sale after a delay
      setTimeout(() => {
        set(state => ({
          activeFuelSales: state.activeFuelSales.filter(s => s.id !== saleId),
        }));
      }, 5000);
    },

    updatePrices: async (prices: FuelPrice[]) => {
      // Mock price update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set({ prices });

      // Update dispenser nozzle prices
      const { dispensers } = get();
      const updatedDispensers = dispensers.map(dispenser => ({
        ...dispenser,
        nozzles: dispenser.nozzles.map(nozzle => {
          const priceUpdate = prices.find(p => p.productId === nozzle.tankId);
          return priceUpdate
            ? { ...nozzle, pricePerUnit: priceUpdate.price }
            : nozzle;
        }),
      }));

      set({ dispensers: updatedDispensers });
    },

    // Private method to simulate fuel dispensing
    simulateFuelDispensing: async (saleId: string) => {
      const sale = get().activeFuelSales.find(s => s.id === saleId);
      if (!sale || sale.status !== 'authorized') return;

      // Start dispensing
      set(state => ({
        activeFuelSales: state.activeFuelSales.map(s =>
          s.id === saleId ? { ...s, status: 'dispensing' } : s
        ),
      }));

      let currentAmount = 0;
      const targetAmount = sale.authorizedAmount;
      const pricePerGallon = sale.pricePerGallon;

      const interval = setInterval(() => {
        const increment = Math.random() * 2 + 1; // Random increment between 1-3 dollars
        currentAmount = Math.min(currentAmount + increment, targetAmount);
        const gallons = currentAmount / pricePerGallon;

        set(state => ({
          activeFuelSales: state.activeFuelSales.map(s =>
            s.id === saleId
              ? { ...s, currentAmount, gallons }
              : s
          ),
        }));

        // Complete when target reached or random stop
        if (currentAmount >= targetAmount || Math.random() < 0.1) {
          clearInterval(interval);
          get().completeFuelSale(saleId);
        }
      }, 1000);
    },
  }))
);

// Initialize with mock data
useFuelStore.setState({
  dispensers: [
    {
      id: 'disp-1',
      locationId: 'loc-1',
      dispenserNumber: 1,
      manufacturer: 'Wayne',
      model: 'Ovation',
      serialNumber: 'WO12345',
      status: 'active',
      lastMaintenanceAt: new Date('2024-07-15'),
      calibrationDate: new Date('2024-06-01'),
      settings: {},
      nozzles: [
        {
          id: 'nozzle-1-1',
          dispenserId: 'disp-1',
          tankId: 'tank-1',
          nozzleNumber: 1,
          fuelGrade: 'Regular 87',
          pricePerUnit: 3.459,
          status: 'active',
          tank: {
            id: 'tank-1',
            locationId: 'loc-1',
            tankNumber: 1,
            productId: 'prod-regular',
            capacity: 10000,
            currentLevel: 7500,
            waterLevel: 0,
            temperature: 68.5,
            status: 'active',
            product: {
              id: 'prod-regular',
              tenantId: 'tenant-1',
              categoryId: 'fuel-category',
              sku: 'FUEL-REG-87',
              name: 'Regular Gasoline 87',
              unitType: 'gallon',
              isFuel: true,
              isAgeRestricted: false,
              minAge: 0,
              isTaxable: true,
              costPrice: 3.20,
              retailPrice: 3.459,
              marginPercent: 8.1,
              status: 'active',
              attributes: { octane: 87, ethanol: 10 },
            },
          },
        },
        {
          id: 'nozzle-1-2',
          dispenserId: 'disp-1',
          tankId: 'tank-2',
          nozzleNumber: 2,
          fuelGrade: 'Mid 89',
          pricePerUnit: 3.659,
          status: 'active',
          tank: {
            id: 'tank-2',
            locationId: 'loc-1',
            tankNumber: 2,
            productId: 'prod-mid',
            capacity: 8000,
            currentLevel: 6200,
            waterLevel: 0,
            temperature: 68.8,
            status: 'active',
            product: {
              id: 'prod-mid',
              tenantId: 'tenant-1',
              categoryId: 'fuel-category',
              sku: 'FUEL-MID-89',
              name: 'Mid-Grade Gasoline 89',
              unitType: 'gallon',
              isFuel: true,
              isAgeRestricted: false,
              minAge: 0,
              isTaxable: true,
              costPrice: 3.40,
              retailPrice: 3.659,
              marginPercent: 7.6,
              status: 'active',
              attributes: { octane: 89, ethanol: 10 },
            },
          },
        },
      ],
    },
    {
      id: 'disp-2',
      locationId: 'loc-1',
      dispenserNumber: 2,
      manufacturer: 'Wayne',
      model: 'Ovation',
      serialNumber: 'WO12346',
      status: 'active',
      lastMaintenanceAt: new Date('2024-07-15'),
      calibrationDate: new Date('2024-06-01'),
      settings: {},
      nozzles: [
        {
          id: 'nozzle-2-1',
          dispenserId: 'disp-2',
          tankId: 'tank-3',
          nozzleNumber: 1,
          fuelGrade: 'Premium 91',
          pricePerUnit: 3.859,
          status: 'active',
          tank: {
            id: 'tank-3',
            locationId: 'loc-1',
            tankNumber: 3,
            productId: 'prod-premium',
            capacity: 8000,
            currentLevel: 5800,
            waterLevel: 0,
            temperature: 69.2,
            status: 'active',
            product: {
              id: 'prod-premium',
              tenantId: 'tenant-1',
              categoryId: 'fuel-category',
              sku: 'FUEL-PREM-91',
              name: 'Premium Gasoline 91',
              unitType: 'gallon',
              isFuel: true,
              isAgeRestricted: false,
              minAge: 0,
              isTaxable: true,
              costPrice: 3.60,
              retailPrice: 3.859,
              marginPercent: 7.2,
              status: 'active',
              attributes: { octane: 91, ethanol: 10 },
            },
          },
        },
        {
          id: 'nozzle-2-2',
          dispenserId: 'disp-2',
          tankId: 'tank-4',
          nozzleNumber: 2,
          fuelGrade: 'Diesel',
          pricePerUnit: 3.999,
          status: 'active',
          tank: {
            id: 'tank-4',
            locationId: 'loc-1',
            tankNumber: 4,
            productId: 'prod-diesel',
            capacity: 12000,
            currentLevel: 9500,
            waterLevel: 0,
            temperature: 70.1,
            status: 'active',
            product: {
              id: 'prod-diesel',
              tenantId: 'tenant-1',
              categoryId: 'fuel-category',
              sku: 'FUEL-DIESEL',
              name: 'Diesel Fuel',
              unitType: 'gallon',
              isFuel: true,
              isAgeRestricted: false,
              minAge: 0,
              isTaxable: true,
              costPrice: 3.70,
              retailPrice: 3.999,
              marginPercent: 8.1,
              status: 'active',
              attributes: { sulfur: 'low', biodiesel: 5 },
            },
          },
        },
      ],
    },
  ],
  prices: [
    {
      id: 'price-1',
      locationId: 'loc-1',
      productId: 'prod-regular',
      price: 3.459,
      cost: 3.20,
      margin: 0.259,
      effectiveFrom: new Date(),
      createdBy: 'system',
    },
    {
      id: 'price-2',
      locationId: 'loc-1',
      productId: 'prod-mid',
      price: 3.659,
      cost: 3.40,
      margin: 0.259,
      effectiveFrom: new Date(),
      createdBy: 'system',
    },
    {
      id: 'price-3',
      locationId: 'loc-1',
      productId: 'prod-premium',
      price: 3.859,
      cost: 3.60,
      margin: 0.259,
      effectiveFrom: new Date(),
      createdBy: 'system',
    },
    {
      id: 'price-4',
      locationId: 'loc-1',
      productId: 'prod-diesel',
      price: 3.999,
      cost: 3.70,
      margin: 0.299,
      effectiveFrom: new Date(),
      createdBy: 'system',
    },
  ],
});

export default useFuelStore;