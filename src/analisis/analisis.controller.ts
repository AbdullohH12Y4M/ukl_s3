import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalisisService } from './analisis.service';
import { TopMatakuliahDosenDto } from './dto/create-analisi.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/auth.decorators';
import { Role } from '@prisma/client';

@ApiTags('Analisis')
@ApiBearerAuth()
@Controller('api/analisis')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalisisController {
  constructor(private readonly analisisService: AnalisisService) {}

  @Post('top-matakuliah-dosen')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary:
      'Analisis matakuliah dan dosen paling banyak dipilih (Admin only)',
  })
  getTopMatakuliahDosen(@Body() dto: TopMatakuliahDosenDto) {
    return this.analisisService.getTopMatakuliahDosen(dto);
  }
}
