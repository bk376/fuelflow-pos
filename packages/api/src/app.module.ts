import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PosModule } from './pos/pos.module';
import { FuelModule } from './fuel/fuel.module';
import { InventoryModule } from './inventory/inventory.module';
import { TransactionsModule } from './transactions/transactions.module';
import { TenantModule } from './tenant/tenant.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),

    // Database connection (optional for development)
    ...(process.env.DB_HOST ? [
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          type: 'postgres',
          host: configService.get('DB_HOST', 'localhost'),
          port: configService.get('DB_PORT', 5432),
          username: configService.get('DB_USERNAME', 'postgres'),
          password: configService.get('DB_PASSWORD', 'password'),
          database: configService.get('DB_NAME', 'gas_station_pos'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          migrations: [__dirname + '/migrations/*{.ts,.js}'],
          synchronize: configService.get('NODE_ENV') !== 'production', // Only for development
          logging: configService.get('NODE_ENV') === 'development',
          ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
        }),
        inject: [ConfigService],
      })
    ] : []),

    // Feature modules (database-dependent modules disabled for now)
    // AuthModule,
    // UsersModule,
    // TenantModule,
    PosModule,
    FuelModule,
    InventoryModule,
    TransactionsModule,
  ],
})
export class AppModule {}