import { ToNumber, ToNumbers, Trim } from '@/base/decorators/common.decorator';
import { OfferPosition } from '@/offer/offer.constant';
import { EGender, UserDepartment } from '@/user/user.constant';
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { CandidateStatus, HighetsLevelCandidate } from '../candidate.constant';
import { UploadFileDto } from '@/shared/dtos/common.dto';

export class CreateCandidateDto extends UploadFileDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Trim()
  full_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Trim()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Trim()
  dob: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Trim()
  phone: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Trim()
  address: string;

  @ApiProperty({ enum: EGender })
  @IsNotEmpty()
  @IsEnum(EGender)
  @Trim()
  gender: EGender;

  @ApiProperty({ enum: OfferPosition })
  @IsNotEmpty()
  @IsEnum(OfferPosition)
  @Trim()
  position: OfferPosition;

  @ApiProperty({ enum: CandidateStatus })
  @IsNotEmpty()
  @IsEnum(CandidateStatus)
  @Trim()
  status: CandidateStatus;

  @ApiProperty({ enum: HighetsLevelCandidate })
  @IsNotEmpty()
  @IsEnum(HighetsLevelCandidate)
  @Trim()
  highest_level: HighetsLevelCandidate;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Trim()
  note: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPositive()
  @ToNumber()
  year_experience: number;

  @ApiProperty({ example: ['a', 'b', 'c'] })
  @IsNotEmpty()
  skills: string | string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(UserDepartment)
  @Trim()
  department: UserDepartment;
}
