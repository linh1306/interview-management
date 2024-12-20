import { ToNumbers } from '@/base/decorators/common.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive } from 'class-validator';

export class DeleteJobDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsPositive({ each: true })
  @ToNumbers()
  ids: number[];
}
