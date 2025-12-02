import { PartialType } from '@nestjs/swagger';
import { CreatePenjadwalanDto } from './create-penjadwalan.dto';

export class UpdatePenjadwalanDto extends PartialType(CreatePenjadwalanDto) {}
