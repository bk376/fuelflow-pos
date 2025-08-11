import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ 
    enum: ['active', 'inactive', 'suspended'],
    required: false 
  })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'suspended'])
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  settings?: Record<string, any>;
}