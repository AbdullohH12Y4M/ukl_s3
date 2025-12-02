import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MahasiswaService } from './mahasiswa.service';
import { CreateMahasiswaDto, UpdateMahasiswaDto } from './dto/mahasiswa.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/auth.decorators';
import { Role } from '@prisma/client';

@ApiTags('Manajemen Mahasiswa')
@ApiBearerAuth()
@Controller('api/mahasiswa')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MahasiswaController {
  constructor(private readonly mahasiswaService: MahasiswaService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Menambah mahasiswa baru' })
  create(@Body() createMahasiswaDto: CreateMahasiswaDto) {
    return this.mahasiswaService.create(createMahasiswaDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Mengambil semua data mahasiswa' })
  findAll() {
    return this.mahasiswaService.findAll();
  }

  @Get(':nim')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Mengambil data mahasiswa berdasarkan NIM' })
  findOne(@Param('nim') nim: string) {
    return this.mahasiswaService.findOne(nim);
  }

  @Put(':nim')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Mengubah data mahasiswa' })
  update(@Param('nim') nim: string, @Body() updateMahasiswaDto: UpdateMahasiswaDto) {
    return this.mahasiswaService.update(nim, updateMahasiswaDto);
  }

  @Delete(':nim')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Menghapus mahasiswa' })
  remove(@Param('nim') nim: string) {
    return this.mahasiswaService.remove(nim);
  }
}
