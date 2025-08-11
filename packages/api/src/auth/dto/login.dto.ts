import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ 
    example: 'demo@gasstation.com',
    description: 'User email address' 
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    example: 'demo123',
    description: 'User password',
    minLength: 6 
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ 
    example: 'location-uuid',
    description: 'Optional location ID for multi-location users',
    required: false 
  })
  @IsString()
  locationId?: string;
}