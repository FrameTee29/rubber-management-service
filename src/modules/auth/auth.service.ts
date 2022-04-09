import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User } from '../users/entities/user.entity';

import { CreateUserDTO } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async register(createUserDTO: CreateUserDTO) {
    const findUser = await this.findOne(createUserDTO.email);
    console.log(findUser);
    if (findUser) {
      throw new BadRequestException('There is an email in the system.');
    }
    const user = this.userRepo.create(createUserDTO);
    return await this.userRepo.save(user);
  }

  async findOne(username: string) {
    return await this.userRepo.findOne({ where: { email: username } });
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.findOne(username);

    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { createdAt, deletedAt, updatedAt, password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { ...user };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '2d' }),
    };
  }
}
