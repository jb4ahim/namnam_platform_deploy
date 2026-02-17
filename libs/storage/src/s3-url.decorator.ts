const S3_URL_METADATA = 's3:url_fields';

/**
 * Marks a DTO property as an S3 URL field.
 * The `resolveS3Urls` helper will automatically presign this field using the
 * corresponding key field.
 *
 * @param keyField - The name of the property that holds the S3 key.
 *                   Defaults to the decorated property name with "Url" replaced by "Key"
 *                   e.g. `logoUrl` → `logoKey`, `imageUrl` → `imageKey`
 *
 * @example
 * class GetMerchantDto {
 *   logoKey?: string;
 *
 *   @S3Url()
 *   logoUrl?: string;
 * }
 */
export function S3Url(keyField?: string): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    const propName = propertyKey.toString();
    const resolvedKeyField = keyField ?? propName.replace('Url', 'Key');

    const existing: { urlField: string; keyField: string }[] =
      Reflect.getMetadata(S3_URL_METADATA, target.constructor) || [];

    Reflect.defineMetadata(
      S3_URL_METADATA,
      [...existing, { urlField: propName, keyField: resolvedKeyField }],
      target.constructor,
    );
  };
}

/**
 * Resolves all `@S3Url`-decorated fields on a DTO instance by presigning their S3 keys.
 * Mutates and returns the same instance.
 *
 * @example
 * const dto = await resolveS3Urls(
 *   plainToInstance(GetMerchantDto, raw),
 *   this.s3Service,
 * );
 */
export async function resolveS3Urls<T extends object>(
  instance: T,
  s3Service: { getPresignedDownloadUrl(key: string): Promise<string> },
): Promise<T> {
  const fields: { urlField: string; keyField: string }[] =
    Reflect.getMetadata(S3_URL_METADATA, instance.constructor) || [];

  await Promise.all(
    fields.map(async ({ urlField, keyField }) => {
      const key = (instance as Record<string, unknown>)[keyField];
      if (key && typeof key === 'string') {
        (instance as Record<string, unknown>)[urlField] =
          await s3Service.getPresignedDownloadUrl(key);
      }
    }),
  );

  return instance;
}
