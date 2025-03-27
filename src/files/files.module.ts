import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from './multer.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [
    //Import destination upload file:
    // MulterModule.registerAsync({
    //   useClass: MulterConfigService,
    // }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class FilesModule {}
