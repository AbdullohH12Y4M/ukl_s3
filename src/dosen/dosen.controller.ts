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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DosenService } from './dosen.service';
import { CreateDosenDto } from './dto/create-dosen.dto';
import { UpdateDosenDto } from './dto/update-dosen.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/auth.decorators';
import { Role } from '@prisma/client';

@ApiTags('Manajemen Dosen')
@ApiBearerAuth()
@Controller('api/dosen')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DosenController {
  constructor(private readonly dosenService: DosenService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Menambah dosen baru (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Dosen berhasil ditambahkan',
  })
  create(@Body() createDosenDto: CreateDosenDto) {
    return this.dosenService.create(createDosenDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Mengambil semua data dosen (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Data dosen berhasil diambil',
  })
  findAll() {
    return this.dosenService.findAll();
  }

  @Get(':nidn')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Mengambil data dosen berdasarkan NIDN (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Data dosen berhasil diambil',
  })
  findOne(@Param('nidn') nidn: string) {
    return this.dosenService.findOne(nidn);
  }

  @Put(':nidn')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Mengubah data dosen (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Data dosen berhasil diperbarui',
  })
  update(@Param('nidn') nidn: string, @Body() updateDosenDto: UpdateDosenDto) {
    return this.dosenService.update(nidn, updateDosenDto);
  }

  @Delete(':nidn')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Menghapus data dosen (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Data dosen berhasil dihapus',
  })
  remove(@Param('nidn') nidn: string) {
    return this.dosenService.remove(nidn);
  }
}