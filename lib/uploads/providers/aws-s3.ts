import { Env } from "@Core/common/env.ts";
import { join } from "path";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
} from "aws-s3";
import { getSignedUrl } from "aws-s3-presigner";
import {
  AwsS3ACLs,
  IObjectLocation,
  IParsedObjectUrl,
  ISignUploadUrlOptions,
  UploadsProvider,
} from "../types.ts";
import { Utils } from "../utils.ts";

export class AwsS3Provider {
  static Client?: S3Client;

  static async getClient(region?: string) {
    const [Region, AccessId, AccessKey] = await Promise.all([
      Env.get("AWS_S3_REGION"),
      Env.get("AWS_S3_ACCESS_ID"),
      Env.get("AWS_S3_ACCESS_KEY"),
    ]);

    return (this.Client ??= new S3Client({
      region: region ?? Region,
      credentials: {
        accessKeyId: AccessId,
        secretAccessKey: AccessKey,
      },
    }));
  }

  static async signUploadUrl(
    options?: Omit<ISignUploadUrlOptions, "provider">
  ) {
    // Gather information
    const BucketName =
      options?.bucketName ?? (await Env.get("AWS_S3_BUCKET_NAME"));
    const Location = options?.location ?? "";
    const Key = join(Location, Utils.uuidV4()).replace(/\\/g, "/");
    const ACL = options?.awsS3ACL ?? AwsS3ACLs.PUBLIC_READ;
    const ContentType = options?.contentType;
    const ContentLength = options?.contentLength;
    const ExpiresInSeconds = (options?.expiresInMs ?? 3600000) / 1000; // Default 1 hour

    const UploadUrl = await getSignedUrl(
      await this.getClient(options?.region),
      new PutObjectCommand({
        Bucket: BucketName,
        Key,
        ACL,
        ContentType,
        ContentLength,
      }),
      {
        expiresIn: ExpiresInSeconds,
        signableHeaders: new Set(["content-type", "content-length"]),
      }
    );

    const ObjectUrl = await this.parseObjectUrl(UploadUrl);

    return {
      method: "put",
      url: UploadUrl,
      getUrl: ObjectUrl.url,
      expiresInSeconds: ExpiresInSeconds,
    };
  }

  static async signGetUrl(
    objectUrl: string | Omit<IParsedObjectUrl, "provider">,
    options?: Omit<IObjectLocation, "provider"> & { expiresInMs?: number }
  ) {
    // Gather information
    const BucketName =
      options?.bucketName ?? (await Env.get("AWS_S3_BUCKET_NAME"));
    const ObjectUrl =
      typeof objectUrl === "object"
        ? objectUrl
        : await this.parseObjectUrl(objectUrl, options);
    const ExpiresInSeconds = (options?.expiresInMs ?? 3600000) / 1000; // Default 1 hour

    return {
      method: "get",
      getUrl: await getSignedUrl(
        await this.getClient(options?.region),
        new GetObjectCommand({
          Bucket: BucketName,
          Key: ObjectUrl.key,
        }),
        { expiresIn: ExpiresInSeconds }
      ),
      expiresInSeconds: ExpiresInSeconds,
    };
  }

  static async getObject(
    objectUrl: string | Omit<IParsedObjectUrl, "provider">,
    options?: Omit<IObjectLocation, "provider">
  ) {
    // Gather information
    const BucketName =
      options?.bucketName ?? (await Env.get("AWS_S3_BUCKET_NAME"));
    const ObjectUrl =
      typeof objectUrl === "object"
        ? objectUrl
        : await this.parseObjectUrl(objectUrl, options);
    const Client = await this.getClient(options?.region);

    const Results = await Client.send(
      new GetObjectCommand({
        Bucket: BucketName,
        Key: ObjectUrl.key,
      })
    );

    const Stream = await Results.Body?.transformToWebStream();

    if (!(Stream instanceof ReadableStream)) throw new Error(`File not found!`);

    return Stream;
  }

  static async objectExists(
    objectUrl: string | Omit<IParsedObjectUrl, "provider">,
    options?: Omit<IObjectLocation, "provider">
  ) {
    // Gather information
    const BucketName =
      options?.bucketName ?? (await Env.get("AWS_S3_BUCKET_NAME"));
    const ObjectUrl =
      typeof objectUrl === "object"
        ? objectUrl
        : await this.parseObjectUrl(objectUrl, options);
    const Client = await this.getClient(options?.region);

    return Client.send(
      new HeadObjectCommand({
        Bucket: BucketName,
        Key: ObjectUrl.key,
      })
    )
      .then((result) => result.$metadata.httpStatusCode === 200)
      .catch(() => false);
  }

  static async deleteObject(
    objectUrl: string | Omit<IParsedObjectUrl, "provider">,
    options?: Omit<IObjectLocation, "provider">
  ) {
    const BucketName =
      options?.bucketName ?? (await Env.get("AWS_S3_BUCKET_NAME"));
    const ObjectUrl =
      typeof objectUrl === "object"
        ? objectUrl
        : await this.parseObjectUrl(objectUrl, options);
    const Client = await this.getClient(options?.region);

    return Client.send(
      new DeleteObjectCommand({
        Bucket: BucketName,
        Key: ObjectUrl.key,
      })
    );
  }

  static async parseObjectUrl(
    objectUrl: string,
    options?: Omit<IObjectLocation, "provider">
  ): Promise<IParsedObjectUrl> {
    const ResolveUrl = objectUrl.split("?")[0];
    const Region = options?.region ?? (await Env.get("AWS_S3_REGION"));
    const BucketName =
      options?.bucketName ?? (await Env.get("AWS_S3_BUCKET_NAME"));
    const S3Url = new URL(ResolveUrl);
    const S3Host = `${BucketName}.s3.${Region}.amazonaws.com`;

    if (S3Url.host === S3Host) {
      const UploadedLocation = S3Url.pathname
        .replace(/^\/|\/$/g, "")
        .split("/")
        .slice(0, -1)
        .join("/");
      const CheckLocation = options?.location?.replace(/^\/|\/$/g, "");

      if (CheckLocation && UploadedLocation !== CheckLocation)
        throw new Error(
          `Invalid upload location '${UploadedLocation}'! Expected location is '${CheckLocation}'`
        );

      return {
        provider: UploadsProvider.AWS_S3,
        key: S3Url.pathname,
        url: ResolveUrl,
      };
    }

    throw new Error(
      `Invalid upload URL host '${S3Url.host}' has been provided! Expected host is '${S3Host}'!`
    );
  }
}
