import { Module, UnsupportedMediaTypeException } from '@nestjs/common';
import { FoodsController } from './foods.controller';
import { FoodsService } from './foods.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Food } from './entities/food.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports:[SequelizeModule.forFeature([Food]), MulterModule.register({
        storage: diskStorage({
          destination: './uploads', 
          filename: (req, file, cb) => {
            let fileName = new Date().getTime() + '.' + file.mimetype.split('/')[1]
            cb(null, fileName)
          }
        }),
        fileFilter: (req, file, cb) => {
          const accessImages = ['image/jpeg', 'image/png', 'image/jpg']
          if(!accessImages.includes(file.mimetype)){
            return cb(new UnsupportedMediaTypeException(`NOT ALLOWED FOR SUCH A FILE TYPE!`), false)
          }
          cb(null, true)
        },
        limits: {
          fileSize: 1024 * 1024 * 3
        }
      })],
  controllers: [FoodsController],
  providers: [FoodsService]
})
export class FoodsModule {}
