import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateOfferDto } from './create-offer.dto';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { OfferStatus } from '../offer.constant';
import { Trim } from '@/base/decorators/common.decorator';

export class UpdateOfferDto extends PartialType(CreateOfferDto) {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(OfferStatus)
  @Trim()
  status: OfferStatus;
}
