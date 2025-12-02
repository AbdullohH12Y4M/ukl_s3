import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePenjadwalanDto } from './dto/create-penjadwalan.dto';
import { UpdatePenjadwalanDto } from './dto/update-penjadwalan.dto';
import { PilihMatakuliahDto } from './dto/create-penjadwalan.dto';

@Injectable()
export class PenjadwalanService {
  constructor(private prisma: PrismaService) {}

  async create(createPenjadwalanDto: CreatePenjadwalanDto) {
    const {
      id_matakuliah,
      nidn_dosen,
      ruangan,
      hari,
      jam_mulai,
      jam_selesai,
      tahun_ajaran,
      semester,
    } = createPenjadwalanDto;

    // Validasi matakuliah exists
    const matakuliah = await this.prisma.matakuliah.findUnique({
      where: { id: id_matakuliah },
    });
    if (!matakuliah) {
      throw new NotFoundException('Matakuliah tidak ditemukan');
    }

    // Validasi dosen exists
    const dosen = await this.prisma.dosen.findUnique({
      where: { nidn: nidn_dosen },
    });
    if (!dosen) {
      throw new NotFoundException('Dosen tidak ditemukan');
    }

    // Validasi waktu
    if (jam_mulai >= jam_selesai) {
      throw new BadRequestException('Jam mulai harus lebih kecil dari jam selesai');
    }

    // Create penjadwalan
    const penjadwalan = await this.prisma.penjadwalan.create({
      data: {
        matakuliahId: id_matakuliah,
        dosenNidn: nidn_dosen,
        ruangan,
        hari,
        jamMulai: jam_mulai,
        jamSelesai: jam_selesai,
        tahunAjaran: tahun_ajaran,
        semester,
      },
      include: {
        matakuliah: true,
        dosen: true,
      },
    });

    return {
      success: true,
      message: 'Jadwal berhasil ditambahkan',
      data: penjadwalan,
    };
  }

  async findAll() {
    const penjadwalan = await this.prisma.penjadwalan.findMany({
      include: {
        matakuliah: true,
        dosen: true,
      },
      orderBy: [{ hari: 'asc' }, { jamMulai: 'asc' }],
    });

    return {
      success: true,
      message: 'Data penjadwalan berhasil diambil',
      data: penjadwalan,
    };
  }

  async findOne(id: string) {
    const penjadwalan = await this.prisma.penjadwalan.findUnique({
      where: { id },
      include: {
        matakuliah: true,
        dosen: true,
        mahasiswaPenjadwalan: {
          include: {
            mahasiswa: true,
          },
        },
      },
    });

    if (!penjadwalan) {
      throw new NotFoundException('Jadwal tidak ditemukan');
    }

    return {
      success: true,
      message: 'Data penjadwalan berhasil diambil',
      data: penjadwalan,
    };
  }

  async update(id: string, updatePenjadwalanDto: UpdatePenjadwalanDto) {
    const existingPenjadwalan = await this.prisma.penjadwalan.findUnique({
      where: { id },
    });

    if (!existingPenjadwalan) {
      throw new NotFoundException('Jadwal tidak ditemukan');
    }

    // Validasi jam jika diubah
    const jamMulai = updatePenjadwalanDto.jam_mulai || existingPenjadwalan.jamMulai;
    const jamSelesai = updatePenjadwalanDto.jam_selesai || existingPenjadwalan.jamSelesai;

    if (jamMulai >= jamSelesai) {
      throw new BadRequestException('Jam mulai harus lebih kecil dari jam selesai');
    }

    const updateData: any = {};
    if (updatePenjadwalanDto.id_matakuliah)
      updateData.matakuliahId = updatePenjadwalanDto.id_matakuliah;
    if (updatePenjadwalanDto.nidn_dosen) updateData.dosenNidn = updatePenjadwalanDto.nidn_dosen;
    if (updatePenjadwalanDto.ruangan) updateData.ruangan = updatePenjadwalanDto.ruangan;
    if (updatePenjadwalanDto.hari) updateData.hari = updatePenjadwalanDto.hari;
    if (updatePenjadwalanDto.jam_mulai) updateData.jamMulai = updatePenjadwalanDto.jam_mulai;
    if (updatePenjadwalanDto.jam_selesai)
      updateData.jamSelesai = updatePenjadwalanDto.jam_selesai;
    if (updatePenjadwalanDto.tahun_ajaran)
      updateData.tahunAjaran = updatePenjadwalanDto.tahun_ajaran;
    if (updatePenjadwalanDto.semester) updateData.semester = updatePenjadwalanDto.semester;

    const penjadwalan = await this.prisma.penjadwalan.update({
      where: { id },
      data: updateData,
      include: {
        matakuliah: true,
        dosen: true,
      },
    });

    return {
      success: true,
      message: 'Jadwal berhasil diperbarui',
      data: penjadwalan,
    };
  }

  async remove(id: string) {
    const existingPenjadwalan = await this.prisma.penjadwalan.findUnique({
      where: { id },
    });

    if (!existingPenjadwalan) {
      throw new NotFoundException('Jadwal tidak ditemukan');
    }

    await this.prisma.penjadwalan.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Jadwal berhasil dihapus',
    };
  }

  // Method untuk mahasiswa memilih matakuliah
  async pilihMatakuliah(nim: string, pilihMatakuliahDto: PilihMatakuliahDto) {
    const { id_penjadwalan } = pilihMatakuliahDto;

    // Ambil data penjadwalan yang dipilih
    const selectedPenjadwalan = await this.prisma.penjadwalan.findMany({
      where: {
        id: { in: id_penjadwalan },
      },
      include: {
        matakuliah: true,
      },
    });

    if (selectedPenjadwalan.length !== id_penjadwalan.length) {
      throw new BadRequestException('Beberapa ID penjadwalan tidak valid');
    }

    // Hitung total SKS
    const totalSKS = selectedPenjadwalan.reduce(
      (sum, jadwal) => sum + jadwal.matakuliah.sks,
      0,
    );

    // Validasi total SKS
    if (totalSKS < 15) {
      return {
        success: false,
        message: `Total SKS kurang dari 15. Total SKS Anda: ${totalSKS}`,
      };
    }

    if (totalSKS > 23) {
      return {
        success: false,
        message: `Total SKS lebih dari 23. Total SKS Anda: ${totalSKS}`,
      };
    }

    // Cek bentrok jadwal
    for (let i = 0; i < selectedPenjadwalan.length; i++) {
      for (let j = i + 1; j < selectedPenjadwalan.length; j++) {
        const jadwal1 = selectedPenjadwalan[i];
        const jadwal2 = selectedPenjadwalan[j];

        if (jadwal1.hari === jadwal2.hari) {
          const start1 = jadwal1.jamMulai;
          const end1 = jadwal1.jamSelesai;
          const start2 = jadwal2.jamMulai;
          const end2 = jadwal2.jamSelesai;

          if (
            (start1 < end2 && start2 < end1) ||
            (start2 < end1 && start1 < end2)
          ) {
            return {
              success: false,
              message: `Jadwal bentrok antara ${jadwal1.matakuliah.nama} dan ${jadwal2.matakuliah.nama} pada hari ${jadwal1.hari}`,
            };
          }
        }
      }
    }

    // Hapus jadwal lama mahasiswa
    await this.prisma.mahasiswaPenjadwalan.deleteMany({
      where: { mahasiswaNim: nim },
    });

    // Simpan jadwal baru
    await this.prisma.mahasiswaPenjadwalan.createMany({
      data: id_penjadwalan.map((penjadwalanId) => ({
        mahasiswaNim: nim,
        penjadwalanId,
      })),
    });

    return {
      success: true,
      message: 'Matakuliah berhasil dipilih',
      data: {
        total_sks: totalSKS,
        jumlah_matakuliah: selectedPenjadwalan.length,
      },
    };
  }

  // Method untuk mahasiswa melihat jadwal
  async lihatJadwalMahasiswa(nim: string) {
    const jadwalMahasiswa = await this.prisma.mahasiswaPenjadwalan.findMany({
      where: { mahasiswaNim: nim },
      include: {
        penjadwalan: {
          include: {
            matakuliah: true,
            dosen: true,
          },
        },
      },
    });

    if (jadwalMahasiswa.length === 0) {
      return {
        success: false,
        message: 'Belum ada matakuliah yang dipilih',
      };
    }

    const totalSKS = jadwalMahasiswa.reduce(
      (sum, item) => sum + item.penjadwalan.matakuliah.sks,
      0,
    );

    return {
      success: true,
      message: 'Jadwal berhasil diambil',
      data: {
        jadwal: jadwalMahasiswa.map((item) => ({
          id: item.penjadwalan.id,
          matakuliah: item.penjadwalan.matakuliah,
          dosen: item.penjadwalan.dosen,
          ruangan: item.penjadwalan.ruangan,
          hari: item.penjadwalan.hari,
          jam_mulai: item.penjadwalan.jamMulai,
          jam_selesai: item.penjadwalan.jamSelesai,
        })),
        total_sks: totalSKS,
      },
    };
  }
}