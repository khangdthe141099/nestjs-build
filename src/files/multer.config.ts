import { Injectable } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { mkdir } from 'node:fs';
import * as process from 'node:process';
import { diskStorage } from 'multer';
import { join } from 'node:path';
import e from 'express';
import { Error } from 'mongoose';
import * as path from 'node:path';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  getRootPath = () => {
    return process.cwd();
  };

  ensureExist(targetDirectory: string) {
    mkdir(targetDirectory, { recursive: true }, (error) => {
      if (!error) {
        console.log('Directory successfully created, or it already exists.');
        return;
      }

      switch (error.code) {
        case 'EEXIST':
          //Requested location already exists, but it's not a directory
          break;
        case 'ENOTDIR':
          //The parent hierarchy contains a file with the same name as the dir, you're trying to create
          break;
        default:
          //Some other error like permission denied, etc.
          break;
      }
    });
  }

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: (
          req: e.Request,
          file: Express.Multer.File,
          callback: (error: Error | null, filename: string) => void,
        ) => {
          const folder = req?.headers?.folder_type ?? 'default';
          this.ensureExist(`public/images/${folder}`);
          callback(null, join(this.getRootPath(), `public/images/${folder}`));
        },
        filename(
          req: e.Request,
          file: Express.Multer.File,
          callback: (error: Error | null, filename: string) => void,
        ) {
          //get image extension:
          let extName = path.extname(file.originalname);

          //get image's name without extension:
          let baseName = path.basename(file.originalname, extName);

          let finalName = `${baseName}-${Date.now()}${extName}`;
          callback(null, finalName);
        },
      }),
    };
  }
}
