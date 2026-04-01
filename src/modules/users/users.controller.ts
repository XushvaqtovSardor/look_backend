import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserDto } from './dto/create.user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly userService : UsersService){}

    @Post()
    createUser(@Body() payload : createUserDto){
        return this.userService.createUser(payload)
    }
    @Get('all')
    getAll(){
        return this.userService.findAll()
    }

    @Get(':id')
    findById(@Param('id', ParseIntPipe) id: number){
        return this.userService.findById(id)
    }
    
}
