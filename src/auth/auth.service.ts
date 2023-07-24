import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { UserRepository } from './user.repository';
import {
  AuthenticateUserDto,
  CreateUserDto,
} from './dtos/auth-credentials.dto';
import { User } from '@prisma/client';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/utils/email.service';

type UserInfoToReturn = Partial<User> | { accessToken?: string | null };

@Injectable()
export class AuthService {
  private logger = new Logger('UserService');
  private otpLifeSpan = 1800000; // 30 minutes
  private infoToOmit = ['id', 'password', 'phoneOtp'];

  private genRandomOtp = (): string => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<UserInfoToReturn> {
    const { username, password, email, phoneNumber, homeAddress, state } =
      createUserDto;
    const hashedPassword = await hash(password, 10);
    const otp = this.genRandomOtp();

    const data = {
      username,
      password: hashedPassword,
      email,
      phoneNumber,
      homeAddress,
      state,
      otp,
    };

    let user: User;

    try {
      user = await this.userRepository.createUser({ data });
    } catch (error) {
      if (error.code === 'P2002') {
        let inUse;
        if (error.message.includes('email')) inUse = 'email';
        if (error.message.includes('phoneNumber')) inUse = 'phoneNumber';
        throw new ConflictException(`The ${inUse} is already in use`);
      } else {
        this.logger.error(error.message);
        throw new InternalServerErrorException('An unexpected error occured');
      }
    }
    this.emailService.sendOtp(email, otp);

    return { ...this.exclude(user, this.infoToOmit) };
  }

  async signIn(
    authenticateUserDto: AuthenticateUserDto,
  ): Promise<UserInfoToReturn> {
    const { email, password } = authenticateUserDto;
    let accessToken: string | null = null;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User with this email');

    const isSame = await compare(password, user.password);
    if (!isSame) throw new UnauthorizedException('The password is in correct.');

    if (user.isVerified) {
      const payload = { id: user.id };
      accessToken = await this.jwtService.sign(payload);
    }

    return { ...this.exclude(user, this.infoToOmit), accessToken };
  }

  exclude<User>(user: User, keys: string[]): UserInfoToReturn {
    return Object.fromEntries(
      Object.entries(user).filter(([key]) => !keys.includes(key)),
    );
  }
}
