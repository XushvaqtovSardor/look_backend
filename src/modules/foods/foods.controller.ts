import { Controller, Post, Get, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FoodsService } from './foods.service';
import { CreateFoodDto } from './dto/create.food.dto';

@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('food_img'))
  async createFood(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateFoodDto
  ) {
    if (!file) {
      throw new Error('Image is required');
    }
    const fileName = `uploads/${file.filename}`;
    return this.foodsService.createFood(body, fileName);
  }

  @Get('all')
  findAllFoods() {
    return this.foodsService.findAll();
  }
}
