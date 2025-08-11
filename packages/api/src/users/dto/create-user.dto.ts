import { IsEmail, IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'john@gasstation.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Hashed password' })
  @IsString()
  passwordHash: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @MaxLength(50)
  lastName: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiProperty({ example: 'EMP001', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  employeeId?: string;

  @ApiProperty({ example: 'tenant-uuid' })
  @IsString()
  tenantId: string;
}