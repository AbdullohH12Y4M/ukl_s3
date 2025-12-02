import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/auth.decorators';

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login untuk Admin dan Mahasiswa' })
  @ApiResponse({
    status: 200,
    description: 'Login berhasil',
    schema: {
      example: {
        success: true,
        message: 'Login berhasil',
        data: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          user: {
            username: 'admin',
            role: 'ADMIN',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Kredensial salah',
    schema: {
      example: {
        success: false,
        message: 'Username atau password salah',
      },
    },
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}