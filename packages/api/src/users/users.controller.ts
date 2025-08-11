import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AssignLocationDto } from './dto/assign-location.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users for tenant' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  findAll(@Request() req) {
    return this.usersService.findAll(req.user.tenantId);
  }

  @Get('by-location/:locationId')
  @ApiOperation({ summary: 'Get users by location' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  findByLocation(@Param('locationId') locationId: string) {
    return this.usersService.getUsersByLocation(locationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user (soft delete)' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post(':id/locations')
  @ApiOperation({ summary: 'Assign user to location' })
  @ApiResponse({ status: 201, description: 'User assigned to location successfully' })
  assignToLocation(
    @Param('id') id: string,
    @Body() assignLocationDto: AssignLocationDto
  ) {
    return this.usersService.assignToLocation(
      id,
      assignLocationDto.locationId,
      assignLocationDto.roleId
    );
  }

  @Delete(':id/locations/:locationId')
  @ApiOperation({ summary: 'Remove user from location' })
  @ApiResponse({ status: 200, description: 'User removed from location successfully' })
  removeFromLocation(
    @Param('id') id: string,
    @Param('locationId') locationId: string
  ) {
    return this.usersService.removeFromLocation(id, locationId);
  }
}