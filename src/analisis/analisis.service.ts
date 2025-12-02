import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TopMatakuliahDosenDto } from './dto/create-analisi.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AnalisisService {
  constructor(private prisma: PrismaService) {}

  async getTopMatakuliahDosen(dto: TopMatakuliahDosenDto) {
    const { tahun_ajaran, semester, limit = 10 } = dto;

    // Build where clause
    const whereClause: Prisma.PenjadwalanWhereInput = {};
    if (tahun_ajaran) whereClause.tahunAjaran = tahun_ajaran;
    if (semester) whereClause.semester = semester;

    // Ambil data mahasiswa penjadwalan dengan filter
    const mahasiswaPenjadwalan = await this.prisma.mahasiswaPenjadwalan.findMany({
      include: {
        penjadwalan: {
          where: whereClause,
          include: {
            matakuliah: true,
            dosen: true,
          },
        },
      },
    });

    // Filter data yang sesuai
    const filteredData = mahasiswaPenjadwalan.filter(
      (mp) => mp.penjadwalan !== null,
    );

    // Hitung matakuliah paling banyak dipilih
    const matakuliahCount: Record<
      string,
      { matakuliah: any; count: number }
    > = {};

    filteredData.forEach((mp) => {
      const mk = mp.penjadwalan.matakuliah;
      if (!matakuliahCount[mk.id]) {
        matakuliahCount[mk.id] = { matakuliah: mk, count: 0 };
      }
      matakuliahCount[mk.id].count++;
    });

    // Sort dan ambil top N
    const topMatakuliah = Object.values(matakuliahCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
      .map((item) => ({
        matakuliah: {
          id: item.matakuliah.id,
          kode: item.matakuliah.kode,
          nama: item.matakuliah.nama,
          sks: item.matakuliah.sks,
        },
        jumlah_mahasiswa: item.count,
      }));

    // Hitung dosen paling banyak dipilih
    const dosenCount: Record<string, { dosen: any; count: number }> = {};

    filteredData.forEach((mp) => {
      const dosen = mp.penjadwalan.dosen;
      if (!dosenCount[dosen.nidn]) {
        dosenCount[dosen.nidn] = { dosen, count: 0 };
      }
      dosenCount[dosen.nidn].count++;
    });

    // Sort dan ambil top N
    const topDosen = Object.values(dosenCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
      .map((item) => ({
        dosen: {
          nidn: item.dosen.nidn,
          nama: item.dosen.nama,
          email: item.dosen.email,
        },
        jumlah_mahasiswa: item.count,
      }));

    return {
      success: true,
      message: 'Analisis berhasil diambil',
      data: {
        top_matakuliah: topMatakuliah,
        top_dosen: topDosen,
        filter: {
          tahun_ajaran: tahun_ajaran || 'Semua',
          semester: semester || 'Semua',
          limit,
        },
      },
    };
  }
}