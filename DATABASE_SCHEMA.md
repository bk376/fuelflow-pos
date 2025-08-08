# Enterprise Database Schema Design

## Database Architecture Overview

### Multi-Tenant Data Model
- **Tenant Isolation**: Database per tenant with shared infrastructure
- **Horizontal Partitioning**: Sharding by location/region for performance
- **Read Replicas**: Regional read replicas for global performance
- **Data Archival**: Automated archival of historical data (7-year retention)

## Core Database Schema

### 1. Tenant & Organization Management

```sql
-- Tenants (Top-level organizations)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    plan_type VARCHAR(50) NOT NULL, -- enterprise, professional, basic
    status VARCHAR(20) DEFAULT 'active',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Organizations (Franchises, chains, districts)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- chain, franchise, district, region
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Locations (Individual gas stations)
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    address JSONB NOT NULL,
    timezone VARCHAR(50) DEFAULT 'UTC',
    phone VARCHAR(20),
    email VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active',
    operating_hours JSONB,
    fuel_grades JSONB DEFAULT '[]',
    services JSONB DEFAULT '[]', -- car_wash, food_service, lottery, etc.
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2. User Management & Authentication

```sql
-- Users (Employees across all locations)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    employee_id VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active',
    last_login TIMESTAMP,
    password_changed_at TIMESTAMP DEFAULT NOW(),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Roles (System-wide roles)
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    permissions JSONB NOT NULL DEFAULT '[]',
    is_system_role BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(tenant_id, name)
);

-- User Location Assignments
CREATE TABLE user_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id),
    status VARCHAR(20) DEFAULT 'active',
    started_at TIMESTAMP DEFAULT NOW(),
    ended_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, location_id, role_id)
);

-- User Sessions (For audit and security)
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    location_id UUID REFERENCES locations(id),
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Product Catalog & Inventory Management

```sql
-- Categories (Product categories)
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES categories(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_fuel BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Products (Master product catalog)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id),
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    brand VARCHAR(100),
    unit_type VARCHAR(50), -- gallon, liter, each, pack, etc.
    barcode VARCHAR(100),
    is_fuel BOOLEAN DEFAULT FALSE,
    is_age_restricted BOOLEAN DEFAULT FALSE,
    min_age INTEGER DEFAULT 0,
    is_taxable BOOLEAN DEFAULT TRUE,
    tax_category VARCHAR(50),
    cost_price DECIMAL(10,2),
    retail_price DECIMAL(10,2),
    margin_percent DECIMAL(5,2),
    status VARCHAR(20) DEFAULT 'active',
    attributes JSONB DEFAULT '{}', -- size, color, flavor, etc.
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Location-specific inventory
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    current_stock DECIMAL(10,3) DEFAULT 0,
    reserved_stock DECIMAL(10,3) DEFAULT 0,
    reorder_point DECIMAL(10,3) DEFAULT 0,
    max_stock DECIMAL(10,3),
    cost_price DECIMAL(10,2),
    retail_price DECIMAL(10,2),
    last_counted_at TIMESTAMP,
    last_received_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(location_id, product_id)
);

-- Inventory movements (Stock changes)
CREATE TABLE inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    movement_type VARCHAR(50) NOT NULL, -- purchase, sale, adjustment, transfer, waste
    quantity DECIMAL(10,3) NOT NULL,
    cost_per_unit DECIMAL(10,2),
    reference_type VARCHAR(50), -- transaction, purchase_order, adjustment
    reference_id UUID,
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Fuel Management System

```sql
-- Fuel tanks
CREATE TABLE fuel_tanks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    tank_number INTEGER NOT NULL,
    product_id UUID NOT NULL REFERENCES products(id), -- fuel grade
    capacity DECIMAL(10,2) NOT NULL, -- in gallons/liters
    current_level DECIMAL(10,2) DEFAULT 0,
    water_level DECIMAL(10,2) DEFAULT 0,
    temperature DECIMAL(5,2),
    last_delivery_at TIMESTAMP,
    last_reading_at TIMESTAMP,
    calibration_data JSONB,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(location_id, tank_number)
);

-- Fuel dispensers (Pumps)
CREATE TABLE fuel_dispensers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    dispenser_number INTEGER NOT NULL,
    manufacturer VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active', -- active, maintenance, offline
    last_maintenance_at TIMESTAMP,
    calibration_date DATE,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(location_id, dispenser_number)
);

-- Fuel dispenser nozzles
CREATE TABLE fuel_nozzles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dispenser_id UUID NOT NULL REFERENCES fuel_dispensers(id) ON DELETE CASCADE,
    tank_id UUID NOT NULL REFERENCES fuel_tanks(id),
    nozzle_number INTEGER NOT NULL,
    fuel_grade VARCHAR(50) NOT NULL,
    price_per_unit DECIMAL(10,3) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(dispenser_id, nozzle_number)
);

-- Real-time fuel pricing
CREATE TABLE fuel_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    price DECIMAL(10,3) NOT NULL,
    cost DECIMAL(10,3),
    margin DECIMAL(10,3),
    effective_from TIMESTAMP DEFAULT NOW(),
    effective_until TIMESTAMP,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 5. Transaction Processing

```sql
-- Transactions (Main transaction header)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    register_id VARCHAR(50),
    transaction_number VARCHAR(100) NOT NULL,
    transaction_type VARCHAR(50) DEFAULT 'sale', -- sale, refund, void, training
    customer_id UUID REFERENCES customers(id),
    cashier_id UUID NOT NULL REFERENCES users(id),
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending', -- pending, completed, cancelled, refunded
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    voided_at TIMESTAMP,
    voided_by UUID REFERENCES users(id),
    void_reason TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Transaction items (Line items)
CREATE TABLE transaction_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    quantity DECIMAL(10,3) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    line_total DECIMAL(10,2) NOT NULL,
    is_fuel BOOLEAN DEFAULT FALSE,
    dispenser_id UUID REFERENCES fuel_dispensers(id),
    nozzle_id UUID REFERENCES fuel_nozzles(id),
    pump_start_reading DECIMAL(10,3),
    pump_end_reading DECIMAL(10,3),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Payment processing
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    payment_method VARCHAR(50) NOT NULL, -- cash, credit, debit, fleet, gift_card
    payment_processor VARCHAR(100), -- stripe, square, first_data, etc.
    processor_transaction_id VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    authorization_code VARCHAR(50),
    reference_number VARCHAR(100),
    card_last_four VARCHAR(4),
    card_brand VARCHAR(20),
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, declined, refunded
    processed_at TIMESTAMP,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 6. Customer Management

```sql
-- Customers (Loyalty program members)
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    customer_number VARCHAR(50) UNIQUE,
    email VARCHAR(255),
    phone VARCHAR(20),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    address JSONB,
    loyalty_tier VARCHAR(50) DEFAULT 'basic',
    points_balance INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0,
    visit_count INTEGER DEFAULT 0,
    last_visit_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Customer loyalty transactions
CREATE TABLE loyalty_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES transactions(id),
    points_earned INTEGER DEFAULT 0,
    points_redeemed INTEGER DEFAULT 0,
    points_balance INTEGER NOT NULL,
    transaction_type VARCHAR(50), -- earned, redeemed, adjustment, expired
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 7. Compliance & Audit

```sql
-- Audit log for compliance
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    location_id UUID REFERENCES locations(id),
    user_id UUID REFERENCES users(id),
    entity_type VARCHAR(100) NOT NULL, -- transaction, inventory, user, etc.
    entity_id UUID,
    action VARCHAR(50) NOT NULL, -- create, update, delete, login, etc.
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Age verification logs
CREATE TABLE age_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES transactions(id),
    location_id UUID NOT NULL REFERENCES locations(id),
    cashier_id UUID NOT NULL REFERENCES users(id),
    product_id UUID NOT NULL REFERENCES products(id),
    verification_method VARCHAR(50), -- id_scan, manual_entry, override
    customer_age INTEGER,
    id_type VARCHAR(50),
    id_number_hash VARCHAR(255), -- Hashed for privacy
    verification_result VARCHAR(20), -- approved, rejected, override
    override_reason TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Regulatory reports
CREATE TABLE compliance_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    location_id UUID REFERENCES locations(id),
    report_type VARCHAR(100) NOT NULL, -- sales_tax, fuel_tax, environmental, etc.
    reporting_period_start DATE NOT NULL,
    reporting_period_end DATE NOT NULL,
    data JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'draft', -- draft, submitted, approved
    submitted_at TIMESTAMP,
    submitted_by UUID REFERENCES users(id),
    external_reference VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 8. Training & Simulation

```sql
-- Training modules
CREATE TABLE training_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    module_type VARCHAR(50), -- pos_basics, fuel_safety, customer_service, etc.
    difficulty_level VARCHAR(20) DEFAULT 'beginner',
    estimated_duration INTEGER, -- in minutes
    content JSONB NOT NULL,
    passing_score INTEGER DEFAULT 80,
    is_mandatory BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User training progress
CREATE TABLE user_training_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES training_modules(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'not_started', -- not_started, in_progress, completed, failed
    score INTEGER,
    attempts INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0, -- in minutes
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    expires_at TIMESTAMP,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, module_id)
);

-- Simulation sessions
CREATE TABLE simulation_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    location_id UUID REFERENCES locations(id),
    session_type VARCHAR(50), -- training, practice, assessment
    scenario_name VARCHAR(255),
    started_at TIMESTAMP DEFAULT NOW(),
    ended_at TIMESTAMP,
    score INTEGER,
    performance_metrics JSONB DEFAULT '{}',
    feedback JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);
```

## Database Indexes & Performance

```sql
-- Performance indexes
CREATE INDEX idx_transactions_location_date ON transactions(location_id, created_at DESC);
CREATE INDEX idx_transactions_cashier ON transactions(cashier_id, created_at DESC);
CREATE INDEX idx_transaction_items_product ON transaction_items(product_id, created_at DESC);
CREATE INDEX idx_inventory_location_product ON inventory(location_id, product_id);
CREATE INDEX idx_payments_status ON payments(status, created_at DESC);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id, created_at DESC);
CREATE INDEX idx_users_tenant_status ON users(tenant_id, status);
CREATE INDEX idx_fuel_prices_location_effective ON fuel_prices(location_id, effective_from DESC);

-- Full-text search indexes
CREATE INDEX idx_products_search ON products USING GIN(to_tsvector('english', name || ' ' || COALESCE(description, '') || ' ' || COALESCE(brand, '')));
CREATE INDEX idx_customers_search ON customers USING GIN(to_tsvector('english', first_name || ' ' || last_name || ' ' || COALESCE(email, '')));
```

## Data Partitioning Strategy

```sql
-- Partition transactions by date for performance
CREATE TABLE transactions_2025_08 PARTITION OF transactions
FOR VALUES FROM ('2025-08-01') TO ('2025-09-01');

-- Partition audit logs by date
CREATE TABLE audit_logs_2025_08 PARTITION OF audit_logs
FOR VALUES FROM ('2025-08-01') TO ('2025-09-01');
```

This enterprise database schema provides:
- **Multi-tenant architecture** with proper data isolation
- **Comprehensive audit trail** for compliance
- **Real-time fuel management** with tank and pump monitoring
- **Advanced inventory tracking** with movement history
- **Training and simulation** data management
- **Performance optimization** with strategic indexing
- **Data partitioning** for scalability
- **Regulatory compliance** built-in