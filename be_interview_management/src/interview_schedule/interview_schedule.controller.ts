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
import { InterviewScheduleService } from './interview_schedule.service';
import { CreateInterviewScheduleDto } from './dto/create-interview_schedule.dto';
import { UpdateInterviewScheduleDto } from './dto/update-interview_schedule.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ListDto } from '@/shared/dtos/common.dto';
import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';
import { GetUser } from '@/auth/decorator/get-user.decorator';
import { User } from '@/user/entities/user.entity';

@ApiTags('Interview')
@Controller('interview-schedule')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InterviewScheduleController {
  constructor(
    private readonly interviewScheduleService: InterviewScheduleService,
  ) {}

  @Post()
  create(@Body() payload: CreateInterviewScheduleDto, @GetUser() user: User) {
    return this.interviewScheduleService.create(payload, user);
  }

  @Get()
  findAll(@Query() query: ListDto, @GetUser() user: User) {
    return this.interviewScheduleService.findAll(query, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.interviewScheduleService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInterviewScheduleDto: UpdateInterviewScheduleDto,
    @GetUser() user: User,
  ) {
    return this.interviewScheduleService.update(
      +id,
      updateInterviewScheduleDto,
      user,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.interviewScheduleService.remove(+id);
  }
}
