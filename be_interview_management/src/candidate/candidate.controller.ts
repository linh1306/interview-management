import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { CandidateService } from './candidate.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ListDto } from '@/shared/dtos/common.dto';
import { UploadService } from '@/base/multer/upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from '@/auth/decorator/get-user.decorator';
import { User } from '@/user/entities/user.entity';
import { JwtAuthGuard } from '@/auth/guard/jwt-auth.guard';

@Controller('candidate')
@ApiTags('Candidate')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CandidateController {
  constructor(
    private readonly candidateService: CandidateService,
    private uploadService: UploadService,
  ) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() payload: CreateCandidateDto,
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User,
  ) {
    const fileName = file ? await this.uploadService.uploadFile(file) : null;
    return this.candidateService.create({ ...payload, file: fileName }, user);
  }

  @Get()
  findAll(@Query() query: ListDto, @GetUser() user: User) {
    return this.candidateService.findAll(query, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.candidateService.findOne(+id);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateCandidateDto,
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User,
  ) {
    let fileName = '';
    if (file) fileName = await this.uploadService.uploadFile(file);
    return this.candidateService.update(
      +id,
      { ...payload, file: fileName },
      user,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.candidateService.remove(+id);
  }
}
