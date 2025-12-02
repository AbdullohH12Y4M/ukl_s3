import { PartialType } from '@nestjs/swagger';
import { CreateAnalisiDto } from './create-analisi.dto';

export class UpdateAnalisiDto extends PartialType(CreateAnalisiDto) {}
