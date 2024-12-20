import { ToNumber, Trim } from '@/base/decorators/common.decorator';
import { ERole } from '@/role/enum/roles.enum';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EGender, UserDepartment, UserRole } from '../user.constant';
import { EState } from '@/shared/enum/common.enum';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Trim()
  full_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Trim()
  username: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Trim()
  dob: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Trim()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Trim()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(UserRole)
  @Trim()
  role: UserRole;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(EState)
  @Trim()
  status: EState;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Trim()
  address: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Trim()
  note: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(EGender)
  @Trim()
  gender: EGender;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(UserDepartment)
  @Trim()
  department: UserDepartment;
}
