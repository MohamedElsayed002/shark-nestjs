import {
  Injectable,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Auth } from 'src/schemas/auth.schema';
import { PasswordHashService } from './services/password-hasher.service';
import { TokenService } from './services/token.service';
import { CreateUserDto, LoginUserDto } from './dto/auth.dto';
import { AuthRepository } from './repositories/auth.repository';
import { Response } from 'express';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly passwordHasher: PasswordHashService,
    private readonly tokenService: TokenService,
  ) {}

  async registerUser(createUserDto: CreateUserDto): Promise<Auth> {
    this.logger.log(
      `Register User ${createUserDto.email} ${createUserDto.name}`,
    );

    const { email, gender, name, password, phone, location } = createUserDto;

    const alreadyExist = await this.authRepository.findByEmail(email);

    if (alreadyExist) {
      throw new BadRequestException('Email already exist');
    }

    const hashedPassword = await this.passwordHasher.hash(password);

    return this.authRepository.create({
      name,
      email,
      password: hashedPassword,
      gender,
      location,
      phone,
    });
  }

  async login(
    loginUser: LoginUserDto,
    res: Response,
  ): Promise<{ access_token: string }> {
    const { email, password } = loginUser;

    const user = await this.authRepository.findByEmail(email);

    if (!user) {
      throw new ConflictException('Email not found');
    }

    if (!this.passwordHasher.compare(password, user.password)) {
      throw new BadRequestException('Invalid Password');
    }

    const access_token = this.tokenService.signAccessToken({
      id: user['_id'],
      role: user.role,
      name: user.name,
      email: user.email,
      phone: user.phone,
    });

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      maxAge: 60 * 60 * 24 * 1000,
      path: '/',
    });

    return { access_token };
  }

  async findAll(): Promise<Auth[]> {
    return this.authRepository.findAll();
  }

  async findById(id: string): Promise<Auth | null> {
    return this.authRepository.findById(id);
  }
}
