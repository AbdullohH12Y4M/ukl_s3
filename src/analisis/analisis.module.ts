import { Module } from '@nestjs/common';
import { AnalisisService } from './analisis.service';
import { AnalisisController } from './analisis.controller';

@Module({
  controllers: [AnalisisController],
  providers: [AnalisisService],
})
export class AnalisisModule {}

// ==========================================
// src/app.module.ts
// ==========================================
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { DosenModule } from './dosen/dosen.module';
import { MatakuliahModule } from './matakuliah/matakuliah.module';
import { MahasiswaModule } from './mahasiswa/mahasiswa.module';
import { PenjadwalanModule } from './penjadwalan/penjadwalan.module';
import { AnalisisModule } from './analisis/analisis.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    DosenModule,
    MatakuliahModule,
    MahasiswaModule,
    PenjadwalanModule,
    AnalisisModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
