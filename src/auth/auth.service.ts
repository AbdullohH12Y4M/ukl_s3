import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    // Cari user berdasarkan username
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: {
        mahasiswa: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Username atau password salah');
    }

    // Validasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Username atau password salah');
    }

    // Generate JWT token
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      nim: user.mahasiswa?.nim,
    };

    const token = this.jwtService.sign(payload);

    return {
      success: true,
      message: 'Login berhasil',
      data: {
        token,
        user: {
          username: user.username,
          role: user.role,
          ...(user.mahasiswa && {
            mahasiswa: {
              nim: user.mahasiswa.nim,
              nama: user.mahasiswa.nama,
            },
          }),
        },
      },
    };
  }

  async validateUser(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        mahasiswa: true,
      },
    });
  }
}