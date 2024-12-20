import { PartialType } from '@nestjs/swagger';
import { CreateStatiticDto } from './create-statitic.dto';

export class UpdateStatiticDto extends PartialType(CreateStatiticDto) {}
