import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id' })
  @Index()
  tenantId: string;

  @Column({ name: 'organization_id', nullable: true })
  @Index()
  organizationId?: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 20, unique: true })
  @Index()
  code: string;

  @Column({ type: 'jsonb' })
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  @Column({ length: 50 })
  timezone: string;

  @Column({ length: 20, nullable: true })
  phone?: string;

  @Column({ length: 100, nullable: true })
  email?: string;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active',
  })
  @Index()
  status: string;

  @Column({ name: 'operating_hours', type: 'jsonb' })
  operatingHours: Record<string, { open: string; close: string }>;

  @Column({ name: 'fuel_grades', type: 'text', array: true })
  fuelGrades: string[];

  @Column({ type: 'text', array: true })
  services: string[];

  @Column({ type: 'jsonb', default: {} })
  settings: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}