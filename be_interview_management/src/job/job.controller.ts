import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ListDto } from '@/shared/dtos/common.dto';
import { GetUser } from '@/auth/decorator/get-user.decorator';
import { User } from '@/user/entities/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { DeleteJobDto } from './dto/delete-job.dto';

@Controller('job')
@ApiBearerAuth()
@ApiTags('Jobs')
@UseGuards(JwtAuthGuard)
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  create(@Body() payload: CreateJobDto, @GetUser() user: User) {
    return this.jobService.create(payload, user);
  }

  @Get()
  findAll(@Query() query: ListDto, @GetUser() user: User) {
    return this.jobService.findAll(query, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @GetUser() user: User,
  ) {
    return this.jobService.update(+id, updateJobDto, user);
  }

  @Delete('')
  remove(@Body() payload: DeleteJobDto) {
    return this.jobService.remove(payload.ids);
  }
}
