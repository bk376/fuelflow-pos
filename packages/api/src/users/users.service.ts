import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserLocation } from './entities/user-location.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserLocation)
    private userLocationsRepository: Repository<UserLocation>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  async findAll(tenantId: string): Promise<User[]> {
    return await this.usersRepository.find({
      where: { tenantId },
      relations: ['locations', 'locations.location', 'locations.role'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['locations', 'locations.location', 'locations.role'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { email },
      relations: ['locations', 'locations.location', 'locations.role'],
    });
  }

  async findByEmployeeId(employeeId: string, tenantId: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { employeeId, tenantId },
      relations: ['locations', 'locations.location', 'locations.role'],
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    
    // Update user fields
    Object.assign(user, updateUserDto);
    
    return await this.usersRepository.save(user);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.usersRepository.update(id, {
      lastLoginAt: new Date(),
    });
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    
    // Soft delete by changing status
    user.status = 'inactive';
    await this.usersRepository.save(user);
  }

  async assignToLocation(userId: string, locationId: string, roleId: string): Promise<UserLocation> {
    // Check if assignment already exists
    const existing = await this.userLocationsRepository.findOne({
      where: { userId, locationId },
    });

    if (existing) {
      // Update existing assignment
      existing.roleId = roleId;
      existing.status = 'active';
      existing.endedAt = null;
      return await this.userLocationsRepository.save(existing);
    }

    // Create new assignment
    const userLocation = this.userLocationsRepository.create({
      userId,
      locationId,
      roleId,
    });

    return await this.userLocationsRepository.save(userLocation);
  }

  async removeFromLocation(userId: string, locationId: string): Promise<void> {
    await this.userLocationsRepository.update(
      { userId, locationId },
      { status: 'inactive', endedAt: new Date() }
    );
  }

  async getUsersByLocation(locationId: string): Promise<User[]> {
    return await this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.locations', 'userLocation')
      .innerJoin('userLocation.location', 'location')
      .innerJoin('userLocation.role', 'role')
      .where('userLocation.locationId = :locationId', { locationId })
      .andWhere('userLocation.status = :status', { status: 'active' })
      .andWhere('user.status = :userStatus', { userStatus: 'active' })
      .getMany();
  }
}