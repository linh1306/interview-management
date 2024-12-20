import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateCandidateDto } from './create-candidate.dto';
import { IsOptional, IsString } from 'class-validator';
import { Trim } from '@/base/decorators/common.decorator';

export class UpdateCandidateDto extends PartialType(CreateCandidateDto) {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Trim()
  attach_file: string;
}
