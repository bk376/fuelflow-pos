import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ 
    example: 'john@gasstation.com',
    description: 'User email address' 
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    example: 'securePassword123',
    description: 'User password',
    minLength: 6,
    maxLength: 100 
  })
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password: string;

  @ApiProperty({ 
    example: 'John',
    description: 'User first name' 
  })
  @IsString()
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ 
    example: 'Doe',
    description: 'User last name' 
  })
  @IsString()
  @MaxLength(50)
  lastName: string;

  @ApiProperty({ 
    example: '+1234567890',
    description: 'User phone number',
    required: false 
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiProperty({ 
    example: 'EMP001',
    description: 'Employee ID',
    required: false 
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  employeeId?: string;

  @ApiProperty({ 
    example: 'tenant-uuid',
    description: 'Tenant ID for multi-tenant setup' 
  })
  @IsString()
  tenantId: string;
}