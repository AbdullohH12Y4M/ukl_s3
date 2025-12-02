import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DosenModule } from './dosen/dosen.module';
import { MahasiswaModule } from './mahasiswa/mahasiswa.module';
import { MatakuliahModule } from './matakuliah/matakuliah.module';
import { PenjadwalanModule } from './penjadwalan/penjadwalan.module';
import { AnalisisiModule } from './analisisi/analisisi.module';
import { AnalisisModule } from './analisis/analisis.module';
import { CommonModu

@Module({
  imports: [AuthModule, DosenModule, MahasiswaModule, MatakuliahModule, PenjadwalanModule, AnalisisiModule, AnalisisModule, CommonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
