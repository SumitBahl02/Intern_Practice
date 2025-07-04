import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { AuthResponse, JwtPayload } from "../common/interfaces/user.interface";
import * as bcrypt from "bcryptjs";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }

  async register(
    email: string,
    password: string,
    name: string
  ): Promise<AuthResponse> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.usersService.create({
        email,
        password: hashedPassword,
        name,
      });

      const payload: JwtPayload = {
        email: user.email,
        sub: user.id,
        role: user.role,
      };

      return {
        accessToken: this.jwtService.sign(payload),
        user,
      };
    } catch (error) {
      if (error.message === "Email already exists") {
        throw new ConflictException("Email already exists");
      }
      throw error;
    }
  }
}
