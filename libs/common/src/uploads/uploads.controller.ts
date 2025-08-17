import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { S3PresignService } from '@app/storage';

type PresignBody = {
  contentType: string;
  size: number;
  filename?: string;
};

@Controller('uploads')
export class UploadsController {
  private readonly allowedMimeTypes = new Set([
    'image/png',
    'image/jpeg',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/avif',
    'image/bmp',
    'image/tiff',
    'image/heic',
    'image/heif',
    'image/ico',
    'image/jfif'
  ]);

  constructor(private readonly presignService: S3PresignService) {}

  @Post('presign')
  async presign(@Body() body: PresignBody) {
    const { contentType, size, filename } = body || ({} as PresignBody);
    if (!contentType || typeof size !== 'number') {
      throw new BadRequestException('contentType and size are required');
    }
    if (!this.allowedMimeTypes.has(contentType)) {
      throw new BadRequestException('Only image files (PNG, JPEG, GIF) are allowed');
    }
    if (size <= 0 || size > 2 * 1024 * 1024) {
      throw new BadRequestException('File too large. Max 2MB');
    }

    const presigned = await this.presignService.presignImageUpload({
      contentType,
      contentLength: size,
      originalFilename: filename,
      keyPrefix: 'uploads/'
    });

    return {
      success: true,
      key: presigned.key,
      url: presigned.url,
      fields: presigned.fields,
      expiresInSeconds: presigned.expiresInSeconds
    };
  }
}


