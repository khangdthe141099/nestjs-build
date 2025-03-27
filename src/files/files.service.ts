import { Injectable } from '@nestjs/common';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class FilesService {
  constructor(private configService: ConfigService) {}

  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
    credentials: {
      accessKeyId: this.configService.getOrThrow('AWS_S3_ACCESS_KEY'),
      secretAccessKey: this.configService.getOrThrow(
        'AWS_S3_SECRET_ACCESS_KEY',
      ),
    },
  });

  async uploadToS3(filename: string, file: Buffer) {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.configService.getOrThrow('AWS_S3_BUCKET_NAME'),
        Key: filename,
        Body: file,
      }),
    );
  }

  async downloadFile() {
    const command = new GetObjectCommand({
      Bucket: this.configService.getOrThrow('AWS_S3_BUCKET_NAME'),
      Key: 'coffee.jpg',
    });

    //File objects:
    const response = await this.s3Client.send(command);

    //File url:
    const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });

    if (response.Body) {
      return url
    }
  }
}
