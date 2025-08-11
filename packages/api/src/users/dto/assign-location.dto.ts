import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignLocationDto {
  @ApiProperty({ example: 'location-uuid' })
  @IsString()
  @IsUUID()
  locationId: string;

  @ApiProperty({ example: 'role-uuid' })
  @IsString()
  @IsUUID()
  roleId: string;
}