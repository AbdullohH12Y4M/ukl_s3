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
import { MatakuliahService } from './matakuliah.service';
import { CreateMatakuliahDto, UpdateMatakuliahDto } from './dto/matakuliah.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/auth.decorators';
import { Role } from '@prisma/client';

@ApiTags('Manajemen Matakuliah')
@ApiBearerAuth()
@Controller('api/matakuliah')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MatakuliahController {
  constructor(private readonly matakuliahService: MatakuliahService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Menambah matakuliah baru' })
  create(@Body() createMatakuliahDto: CreateMatakuliahDto) {
    return this.matakuliahService.create(createMatakuliahDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Mengambil semua data matakuliah' })
  findAll() {
    return this.matakuliahService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Mengambil data matakuliah berdasarkan ID' })
  findOne(@Param('id') id: string) {
    return this.matakuliahService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Mengubah data matakuliah' })
  update(@Param('id') id: string, @Body() updateMatakuliahDto: UpdateMatakuliahDto) {
    return this.matakuliahService.update(id, updateMatakuliahDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Menghapus matakuliah' })
  remove(@Param('id') id: string) {
    return this.matakuliahService.remove(id);
  }
}