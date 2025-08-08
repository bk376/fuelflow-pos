// Core Entity Types
export interface Tenant {
  id: string;
  name: string;
  slug: string;
  planType: 'enterprise' | 'professional' | 'basic';
  status: 'active' | 'inactive' | 'suspended';
  settings: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  id: string;
  tenantId: string;
  organizationId?: string;
  name: string;
  code: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  timezone: string;
  phone?: string;
  email?: string;
  status: 'active' | 'inactive' | 'maintenance';
  operatingHours: Record<string, { open: string; close: string }>;
  fuelGrades: string[];
  services: string[];
  settings: Record<string, any>;
}

export interface User {
  id: string;
  tenantId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  employeeId?: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: Date;
  settings: Record<string, any>;
  locations?: UserLocation[];
}

export interface UserLocation {
  id: string;
  userId: string;
  locationId: string;
  roleId: string;
  status: 'active' | 'inactive';
  startedAt: Date;
  endedAt?: Date;
  role: Role;
  location: Location;
}

export interface Role {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  permissions: Permission[];
  isSystemRole: boolean;
}

export interface Permission {
  resource: string;
  action: string;
  conditions?: Record<string, any>;
}

// Product & Inventory Types
export interface Category {
  id: string;
  tenantId: string;
  parentId?: string;
  name: string;
  description?: string;
  isFuel: boolean;
  displayOrder: number;
  status: 'active' | 'inactive';
  children?: Category[];
}

export interface Product {
  id: string;
  tenantId: string;
  categoryId?: string;
  sku: string;
  name: string;
  description?: string;
  brand?: string;
  unitType: string;
  barcode?: string;
  isFuel: boolean;
  isAgeRestricted: boolean;
  minAge: number;
  isTaxable: boolean;
  taxCategory?: string;
  costPrice: number;
  retailPrice: number;
  marginPercent: number;
  status: 'active' | 'inactive';
  attributes: Record<string, any>;
  category?: Category;
}

export interface Inventory {
  id: string;
  locationId: string;
  productId: string;
  currentStock: number;
  reservedStock: number;
  reorderPoint: number;
  maxStock?: number;
  costPrice: number;
  retailPrice: number;
  lastCountedAt?: Date;
  lastReceivedAt?: Date;
  status: 'active' | 'inactive';
  product: Product;
}

// Fuel Management Types
export interface FuelTank {
  id: string;
  locationId: string;
  tankNumber: number;
  productId: string;
  capacity: number;
  currentLevel: number;
  waterLevel: number;
  temperature?: number;
  lastDeliveryAt?: Date;
  lastReadingAt?: Date;
  status: 'active' | 'maintenance' | 'offline';
  product: Product;
}

export interface FuelDispenser {
  id: string;
  locationId: string;
  dispenserNumber: number;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  status: 'active' | 'maintenance' | 'offline';
  lastMaintenanceAt?: Date;
  calibrationDate?: Date;
  settings: Record<string, any>;
  nozzles: FuelNozzle[];
}

export interface FuelNozzle {
  id: string;
  dispenserId: string;
  tankId: string;
  nozzleNumber: number;
  fuelGrade: string;
  pricePerUnit: number;
  status: 'active' | 'maintenance' | 'offline';
  tank: FuelTank;
}

export interface FuelPrice {
  id: string;
  locationId: string;
  productId: string;
  price: number;
  cost: number;
  margin: number;
  effectiveFrom: Date;
  effectiveUntil?: Date;
  createdBy: string;
}

// Transaction Types
export interface Transaction {
  id: string;
  locationId: string;
  registerId?: string;
  transactionNumber: string;
  transactionType: 'sale' | 'refund' | 'void' | 'training';
  customerId?: string;
  cashierId: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  startedAt: Date;
  completedAt?: Date;
  voidedAt?: Date;
  voidedBy?: string;
  voidReason?: string;
  metadata: Record<string, any>;
  items: TransactionItem[];
  payments: Payment[];
  cashier: User;
  customer?: Customer;
}

export interface TransactionItem {
  id: string;
  transactionId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  taxAmount: number;
  lineTotal: number;
  isFuel: boolean;
  dispenserId?: string;
  nozzleId?: string;
  pumpStartReading?: number;
  pumpEndReading?: number;
  metadata: Record<string, any>;
  product: Product;
}

export interface Payment {
  id: string;
  transactionId: string;
  paymentMethod: 'cash' | 'credit' | 'debit' | 'fleet' | 'gift_card';
  paymentProcessor?: string;
  processorTransactionId?: string;
  amount: number;
  currency: string;
  authorizationCode?: string;
  referenceNumber?: string;
  cardLastFour?: string;
  cardBrand?: string;
  status: 'pending' | 'approved' | 'declined' | 'refunded';
  processedAt?: Date;
  metadata: Record<string, any>;
}

export interface Customer {
  id: string;
  tenantId: string;
  customerNumber?: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  address?: Record<string, any>;
  loyaltyTier: string;
  pointsBalance: number;
  totalSpent: number;
  visitCount: number;
  lastVisitAt?: Date;
  status: 'active' | 'inactive';
  preferences: Record<string, any>;
}

// Training & Simulation Types
export interface TrainingModule {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  moduleType: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number;
  content: Record<string, any>;
  passingScore: number;
  isMandatory: boolean;
  status: 'active' | 'inactive';
}

export interface UserTrainingProgress {
  id: string;
  userId: string;
  moduleId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  score?: number;
  attempts: number;
  timeSpent: number;
  startedAt?: Date;
  completedAt?: Date;
  expiresAt?: Date;
  metadata: Record<string, any>;
  module: TrainingModule;
}

export interface SimulationSession {
  id: string;
  userId: string;
  locationId?: string;
  sessionType: 'training' | 'practice' | 'assessment';
  scenarioName: string;
  startedAt: Date;
  endedAt?: Date;
  score?: number;
  performanceMetrics: Record<string, any>;
  feedback: Record<string, any>;
}

// API Response Types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  errors?: string[];
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

// UI Component Types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  icon?: React.ReactNode;
  onChange?: (value: string) => void;
  className?: string;
}

export interface SelectProps {
  options: Array<{ value: string; label: string }>;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  onChange?: (value: string) => void;
  className?: string;
}

// Store Types (Zustand)
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export interface LoginCredentials {
  email: string;
  password: string;
  locationId?: string;
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  isFuel: boolean;
  metadata?: Record<string, any>;
}

export interface FuelState {
  dispensers: FuelDispenser[];
  tanks: FuelTank[];
  prices: FuelPrice[];
  selectedDispenser: string | null;
  activeFuelSales: FuelSale[];
  authorizePump: (dispenserId: string, amount: number) => Promise<void>;
  completeFuelSale: (saleId: string) => Promise<void>;
  updatePrices: (prices: FuelPrice[]) => Promise<void>;
}

export interface FuelSale {
  id: string;
  dispenserId: string;
  nozzleId: string;
  customerId?: string;
  authorizedAmount: number;
  currentAmount: number;
  gallons: number;
  pricePerGallon: number;
  status: 'authorized' | 'dispensing' | 'completed' | 'cancelled';
  startedAt: Date;
  completedAt?: Date;
}

// Event Types
export interface SystemEvent {
  id: string;
  type: string;
  data: Record<string, any>;
  timestamp: Date;
  locationId?: string;
  userId?: string;
}

export interface FuelPumpEvent extends SystemEvent {
  type: 'fuel_pump_authorized' | 'fuel_pump_started' | 'fuel_pump_completed' | 'fuel_pump_error';
  data: {
    dispenserId: string;
    nozzleId: string;
    amount?: number;
    gallons?: number;
    error?: string;
  };
}

export interface TransactionEvent extends SystemEvent {
  type: 'transaction_started' | 'transaction_item_added' | 'transaction_completed' | 'transaction_voided';
  data: {
    transactionId: string;
    item?: TransactionItem;
    total?: number;
    reason?: string;
  };
}

// Configuration Types
export interface SystemConfig {
  fuel: {
    maxAuthorizedAmount: number;
    preAuthTimeout: number;
    pumpTimeout: number;
    allowManualPriceOverride: boolean;
  };
  pos: {
    defaultTaxRate: number;
    requireCustomerForLoyalty: boolean;
    enableTrainingMode: boolean;
    maxItemsPerTransaction: number;
  };
  compliance: {
    ageVerificationRequired: boolean;
    auditLogRetentionDays: number;
    requireManagerOverrideForVoids: boolean;
    maxVoidAmount: number;
  };
  ui: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    currency: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
  };
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type RequireField<T, K extends keyof T> = T & Required<Pick<T, K>>;