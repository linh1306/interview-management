import {Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import {JwtAuthGuard} from '@/auth/guard/jwt-auth.guard';
import {GetUser} from '@/auth/decorator/get-user.decorator';
import {User} from '@/user/entities/user.entity';
import {RequestService} from './request.service';
import {CreateRequestDto} from './dto/create-request.dto';
import {UpdateRequestDto} from './dto/update-request.dto';
import {ListDto} from '@/shared/dtos/common.dto';
import { RequestStatus, RequestLevel } from './request.constant';

@ApiTags('Request')
@Controller('request')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RequestController {
    constructor(private readonly requestService: RequestService) {
        console.log('RequestController initialized');
    }

    @Post()
    create(@Body() createRequestDto: CreateRequestDto, @GetUser() user: User) {
        return this.requestService.create(createRequestDto, user);
    }

    @Get()
    findAll(@Query() query: ListDto, @GetUser() user: User) {
        return this.requestService.findAll(query, user);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.requestService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateRequestDto: UpdateRequestDto,
        @GetUser() user: User,
    ) {
        return this.requestService.update(+id, updateRequestDto, user);
    }

    @Patch(':id/status')
    async updateStatus(
        @Param('id') id: string,
        @Body() payload: { status: RequestStatus },
        @GetUser() user: User,
    ) {
        return this.requestService.updateStatus(+id, payload.status, user);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.requestService.remove(+id);
    }
}