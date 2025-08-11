import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { UserLocation } from './user-location.entity';

@Entity('users')
@Index(['email', 'tenantId'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id' })
  @Index()
  tenantId: string;

  @Column({ unique: true })
  @Index()
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ name: 'first_name', length: 50 })
  firstName: string;

  @Column({ name: 'last_name', length: 50 })
  lastName: string;

  @Column({ length: 20, nullable: true })
  phone?: string;

  @Column({ name: 'employee_id', length: 20, nullable: true })
  @Index()
  employeeId?: string;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'suspended'],
    default: 'active',
  })
  @Index()
  status: string;

  @Column({ name: 'last_login_at', type: 'timestamp', nullable: true })
  lastLoginAt?: Date;

  @Column({ type: 'jsonb', default: {} })
  settings: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => UserLocation, userLocation => userLocation.user)
  locations?: UserLocation[];

  // Virtual properties
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  get role(): string {
    // This would be determined by the user's role in their locations
    // For now, return a default based on locations
    if (this.locations?.length > 0) {
      return this.locations[0].role?.name || 'employee';
    }
    return 'employee';
  }
}