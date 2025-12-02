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
import { PenjadwalanService } from './penjadwalan.service';
import { CreatePenjadwalanDto } from './dto/create-penjadwalan.dto';
import { UpdatePenjadwalanDto } from './dto/update-penjadwalan.dto';
import { PilihMatakuliahDto } from './dto/create-penjadwalan.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles, CurrentUser } from '../auth/decorators/auth.decorators';
import { Role } from '@prisma/client';

@ApiTags('Manajemen Penjadwalan')
@ApiBearerAuth()
@Controller('api')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PenjadwalanController {
  constructor(private readonly penjadwalanService: PenjadwalanService) {}

  // ===== ADMIN ENDPOINTS =====
  @Post('penjadwalan')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Menambah penjadwalan (Admin only)' })
  create(@Body() createPenjadwalanDto: CreatePenjadwalanDto) {
    return this.penjadwalanService.create(createPenjadwalanDto);
  }

  @Get('penjadwalan')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Mengambil semua penjadwalan (Admin only)' })
  findAll() {
    return this.penjadwalanService.findAll();
  }

  @Get('penjadwalan/:id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Mengambil detail penjadwalan (Admin only)' })
  findOne(@Param('id') id: string) {
    return this.penjadwalanService.findOne(id);
  }

  @Put('penjadwalan/:id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Mengubah penjadwalan (Admin only)' })
  update(
    @Param('id') id: string,
    @Body() updatePenjadwalanDto: UpdatePenjadwalanDto,
  ) {
    return this.penjadwalanService.update(id, updatePenjadwalanDto);
  }

  @Delete('penjadwalan/:id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Menghapus penjadwalan (Admin only)' })
  remove(@Param('id') id: string) {
    return this.penjadwalanService.remove(id);
  }

  // ===== MAHASISWA ENDPOINTS =====
  @Post('mahasiswa/pilih-matakuliah')
  @Roles(Role.MAHASISWA)
  @ApiOperation({ summary: 'Mahasiswa memilih matakuliah' })
  pilihMatakuliah(
    @CurrentUser() user: any,
    @Body() pilihMatakuliahDto: PilihMatakuliahDto,
  ) {
    return this.penjadwalanService.pilihMatakuliah(user.nim, pilihMatakuliahDto);
  }

  @Get('mahasiswa/jadwal')
  @Roles(Role.MAHASISWA)
  @ApiOperation({ summary: 'Mahasiswa melihat jadwal yang sudah dipilih' })
  lihatJadwal(@CurrentUser() user: any) {
    return this.penjadwalanService.lihatJadwalMahasiswa(user.nim);
  }
}