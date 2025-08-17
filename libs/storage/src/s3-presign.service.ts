import { Injectable } from '@nestjs/common';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost, PresignedPost } from '@aws-sdk/s3-presigned-post';
import { randomUUID } from 'crypto';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export type PresignRequest = {
  contentType: string;
  contentLength: number;
  originalFilename?: string;
  keyPrefix?: string; 
};

export type PresignResponse = {
  url: string;
  fields: Record<string, string>;
  key: string;
  expiresInSeconds: number;
};

@Injectable()
export class S3PresignService {
  private readonly s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      } : undefined,
    });
  }

  /**
   * Create a presigned POST policy with strict security conditions
   * - private ACL
   * - exact Content-Type
   * - content-length-range enforced
   * - key prefix restriction
   */
  async presignImageUpload(req: PresignRequest): Promise<PresignResponse> {
    const bucket = process.env.AWS_S3_BUCKET as string;
    if (!bucket) {
      throw new Error('AWS_S3_BUCKET is not set');
    }

    const safeBase = (req.originalFilename || 'image')
      .toLowerCase()
      .replace(/[^a-z0-9_.-]/g, '-')
      .slice(0, 80);

    const datePrefix = new Date().toISOString().slice(0, 10);
    const keyPrefix = (req.keyPrefix || 'uploads/') + `${datePrefix}/`;
    const key = `${keyPrefix}${randomUUID()}-${safeBase}`;

    // Short-lived expiry window
    const expiresInSeconds = 60 * 5; // 5 minutes

    const post: PresignedPost = await createPresignedPost(this.s3, {
      Bucket: bucket,
      Key: key,
      Conditions: [
        ['content-length-range', req.contentLength, req.contentLength], // exact size if you require precise check
        ['starts-with', '$key', keyPrefix],
        { 'Content-Type': req.contentType },
        { acl: 'private' },
      ],
      Fields: {
        'Content-Type': req.contentType,
        acl: 'private',
        key
      },
      Expires: expiresInSeconds
    });

    return { url: post.url, fields: post.fields, key, expiresInSeconds };
  }

  async getPresignedDownloadUrl(key: string, expiresInSeconds: number = 60 * 5): Promise<string> {
      const bucket = process.env.AWS_S3_BUCKET as string;
      if (!bucket) {
        throw new Error('AWS_S3_BUCKET is not set');
      }

      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      });

      return await getSignedUrl(this.s3, command, { expiresIn: expiresInSeconds });
    }
}

