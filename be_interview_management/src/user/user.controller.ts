import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Put,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    Delete
} from '@nestjs/common';
import {ApiBearerAuth, ApiConsumes, ApiTags} from '@nestjs/swagger';

// APPS
import {User} from './entities/user.entity';
import {UserService} from './user.service';
import {JwtAuthGuard} from '@/auth/guard/jwt-auth.guard';
import {UploadService} from '@/base/multer/upload.service';
import {GetUser} from '@/auth/decorator/get-user.decorator';
import {CreateUserDto} from './dtos/create-user.dto';
import {ListUserDto} from './dtos/list-user.dto';
import {UpdateUserDto} from './dtos/update-user.dto';

@Controller('user')
@ApiBearerAuth()
@ApiTags('User')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly uploadService: UploadService,
    ) {
    }

    @Get()
    // @Roles(ERole.Admin)
    list(@Query() query: ListUserDto) {
        return this.userService.list(query);
    }

    @Post('create')
    create(@Body() payload: CreateUserDto, @GetUser() user: User) {
        return this.userService.create(payload, user);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() payload: UpdateUserDto, user: User) {
        return this.userService.update(+id, payload, user);
    }

    @Delete(':id')
    delete(@Param('id') id: string, @GetUser() user: User) {
        return this.userService.delete(+id, user);
    }
}
