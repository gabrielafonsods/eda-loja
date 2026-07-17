import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(username: string, password: string) {
    const validUsername = process.env.ADMIN_USERNAME;
    const validPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!validUsername || !validPasswordHash) {
      throw new UnauthorizedException('Login não configurado no servidor');
    }

    if (username !== validUsername) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }

    const matches = await bcrypt.compare(password, validPasswordHash);
    if (!matches) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }

    const access_token = await this.jwtService.signAsync({ username });
    return { access_token };
  }
}
