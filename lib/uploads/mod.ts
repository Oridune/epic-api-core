import { Env } from "@Core/common/env.ts";
import {
  IObjectLocation,
  IParsedObjectUrl,
  ISignUploadUrlOptions,
  ISignedUrlResult,
  UploadsProvider,
} from "./types.ts";

export class Uploads {
  static async getAwsS3() {
    return (await import("./providers/aws-s3.ts")).AwsS3Provider;
  }

  static async getMinio() {
    return (await import("./providers/minio.ts")).MinioProvider;
  }

  static async getProvider(providerType: string) {
    switch (providerType) {
      case UploadsProvider.AWS_S3:
        return await this.getAwsS3();

      case UploadsProvider.MINIO:
        return await this.getMinio();

      default:
        throw new Error(`Invalid provider '${providerType}'!`);
    }
  }

  static async signUploadUrl(
    options?: ISignUploadUrlOptions
  ): Promise<ISignedUrlResult> {
    return (
      await this.getProvider(
        options?.provider ?? (await Env.get("UPLOADS_PROVIDER"))
      )
    ).signUploadUrl(options);
  }

  static async signGetUrl(
    objectUrl: string | Omit<IParsedObjectUrl, "provider">,
    options?: IObjectLocation & { expiresInMs?: number }
  ): Promise<ISignedUrlResult> {
    return (
      await this.getProvider(
        options?.provider ?? (await Env.get("UPLOADS_PROVIDER"))
      )
    ).signGetUrl(objectUrl, options);
  }

  static async objectExists(
    objectUrl: string | IParsedObjectUrl,
    options?: IObjectLocation
  ): Promise<boolean> {
    return (
      await this.getProvider(
        options?.provider ?? (await Env.get("UPLOADS_PROVIDER"))
      )
    ).objectExists(objectUrl, options);
  }

  static async getObject<R = unknown>(
    objectUrl: string | IParsedObjectUrl,
    options?: IObjectLocation
  ): Promise<ReadableStream<R>> {
    return (
      await this.getProvider(
        options?.provider ?? (await Env.get("UPLOADS_PROVIDER"))
      )
    ).getObject(objectUrl, options);
  }

  static async deleteObject(
    objectUrl: string | IParsedObjectUrl,
    options?: IObjectLocation
  ): Promise<void> {
    (
      await this.getProvider(
        options?.provider ?? (await Env.get("UPLOADS_PROVIDER"))
      )
    ).deleteObject(objectUrl, options);
  }

  static async parseObjectUrl(
    objectUrl: string,
    options?: IObjectLocation
  ): Promise<IParsedObjectUrl> {
    return (
      await this.getProvider(
        options?.provider ?? (await Env.get("UPLOADS_PROVIDER"))
      )
    ).parseObjectUrl(objectUrl, options);
  }

  static async resolveObjectUrl(
    objectUrl: string,
    options?: IObjectLocation & { checkExistance?: boolean }
  ): Promise<IParsedObjectUrl> {
    const ObjectUrl = await Promise.any([
      this.parseObjectUrl(objectUrl, {
        ...options,
        provider: UploadsProvider.AWS_S3,
      }),
      this.parseObjectUrl(objectUrl, {
        ...options,
        provider: UploadsProvider.MINIO,
      }),
    ]).catch(() => {
      throw new Error(`Invalid object URL!`);
    });

    if (options?.checkExistance && !(await this.objectExists(ObjectUrl)))
      throw new Error(`Object doesn't exists!`);

    return ObjectUrl;
  }

  static async isValidObjectUrl(
    objectUrl: string,
    options?: IObjectLocation & { checkExistance?: boolean }
  ): Promise<boolean> {
    try {
      await this.resolveObjectUrl(objectUrl, options);
      return true;
    } catch {
      return false;
    }
  }
}

export * from "./types.ts";
