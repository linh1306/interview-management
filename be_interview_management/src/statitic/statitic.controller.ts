import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { StatiticService } from './statitic.service';
import { CreateStatiticDto } from './dto/create-statitic.dto';
import { UpdateStatiticDto } from './dto/update-statitic.dto';
import { ListDto } from '@/shared/dtos/common.dto';

@Controller('statitic')
export class StatiticController {
  constructor(private readonly statiticService: StatiticService) {}

  @Get('/dashboard')
  dashboard() {
    return this.statiticService.dashboard();
  }

  @Get('candidate-distribution')
  candidateDistribution() {
    return this.statiticService.candidateDistribution();
  }

  @Get('candidate-status')
  candidateStatus(@Query() query: ListDto) {
    return this.statiticService.candidateStatus(query);
  }

  @Get('job/:year')
  jobStatitics(@Param('year') year: string) {
    return this.statiticService.jobStatitics(+year);
  }
}
