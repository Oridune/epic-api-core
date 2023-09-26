import { Env } from "@Core/common/env.ts";
import { join } from "path";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "aws-s3";
import { getSignedUrl } from "aws-s3-presigner";
import { Client as MinioClient } from "minio";

export enum UploadsProvider {
  AWS_S3 = "aws-s3",
  MINIO = "minio",
}

export enum AwsS3ACLs {
  /** Owner gets FULL_CONTROL. No one else has access rights (default). */
  PRIVATE = "private",

  /** Owner gets FULL_CONTROL. The AllUsers group gets READ access. */
  PUBLIC_READ = "public-read",

  /** Owner gets FULL_CONTROL. The AllUsers group gets READ and WRITE access. Granting this on a bucket is generally not recommended. */
  PUBLIC_READ_WRITE = "public-read-write",

  /** Owner gets FULL_CONTROL. Amazon EC2 gets READ access to GET an Amazon Machine Image (AMI) bundle from Amazon S3. */
  AWS_EXEC_READ = "aws-exec-read",

  /** Owner gets FULL_CONTROL. The AuthenticatedUsers group gets READ access. */
  AUTHENTICATED_READ = "authenticated-read",

  /** Object owner gets FULL_CONTROL. Bucket owner gets READ access. If you specify this canned ACL when creating a bucket, Amazon S3 ignores it. */
  BUCKET_OWNER_READ = "bucket-owner-read",

  /** Both the object owner and the bucket owner get FULL_CONTROL over the object. If you specify this canned ACL when creating a bucket, Amazon S3 ignores it. */
  BUCKET_OWNER_FULL_CONTROL = "bucket-owner-full-control",

  /** The LogDelivery group gets WRITE and READ_ACP permissions on the bucket. */
  LOG_DELIVERY_WRITE = "log-delivery-write",
}

export interface ISignUploadUrlOptions {
  provider?: UploadsProvider;
  region?: string;
  bucketName?: string;
  location?: string;
  contentType?: string;
  contentLength?: number;
  awsS3ACL?: AwsS3ACLs;
  expiresInMs?: number;
}

export interface IParsedObjectUrl {
  provider: UploadsProvider;
  key: string;
  url: string;
}

export interface IObjectLocation {
  provider?: UploadsProvider;
  region?: string;
  bucketName?: string;
  location?: string;
}

export class Uploads {
  static uuidV4() {
    // Create an array to hold random bytes
    const ByteArray = new Uint8Array(16);

    // Fill the array with random values
    crypto.getRandomValues(ByteArray);

    // Set the version (4) and variant (2) bits
    ByteArray[6] = (ByteArray[6] & 0x0f) | 0x40;
    ByteArray[8] = (ByteArray[8] & 0x3f) | 0x80;

    // Convert the byte array to a hexadecimal string
    const Hex = Array.from(ByteArray)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    // Format the UUID string
    return [
      Hex.substr(0, 8),
      Hex.substr(8, 4),
      Hex.substr(12, 4),
      Hex.substr(16, 4),
      Hex.substr(20, 12),
    ].join("-");
  }

  static AwsS3?: S3Client;
  static Minio?: MinioClient;

  static async getAwsS3(region?: string) {
    const [Region, AccessId, AccessKey] = await Promise.all([
      Env.get("AWS_S3_REGION"),
      Env.get("AWS_S3_ACCESS_ID"),
      Env.get("AWS_S3_ACCESS_KEY"),
    ]);

    return (Uploads.AwsS3 ??= new S3Client({
      region: region ?? Region,
      credentials: {
        accessKeyId: AccessId,
        secretAccessKey: AccessKey,
      },
    }));
  }

  static async getMinio() {
    const [Endpoint, AccessKey, SecretKey] = await Promise.all([
      Env.get("MINIO_ENDPOINT"),
      Env.get("MINIO_ACCESS_KEY"),
      Env.get("MINIO_SECRET_KEY"),
    ]);

    return (Uploads.Minio ??= new MinioClient({
      endPoint: Endpoint,
      accessKey: AccessKey,
      secretKey: SecretKey,
    }));
  }

  static async signAwsS3UploadUrl(options?: ISignUploadUrlOptions) {
    // Gather information
    const BucketName =
      options?.bucketName ?? (await Env.get("AWS_S3_BUCKET_NAME"));
    const Location = options?.location ?? "";
    const Key = join(Location, Uploads.uuidV4()).replace(/\\/g, "/");
    const ACL = options?.awsS3ACL ?? AwsS3ACLs.PUBLIC_READ;
    const ContentType = options?.contentType;
    const ContentLength = options?.contentLength;
    const ExpiresInSeconds = (options?.expiresInMs ?? 3600000) / 1000; // Default 1 hour

    return {
      method: "put",
      url: await getSignedUrl(
        await Uploads.getAwsS3(options?.region),
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
      ),
      expiresIn: ExpiresInSeconds,
    };
  }

  static async signMinioUploadUrl(options?: ISignUploadUrlOptions) {
    // Gather information
    const BucketName =
      options?.bucketName ?? (await Env.get("MINIO_BUCKET_NAME"));
    const Location = options?.location ?? "";
    const Key = join(Location, Uploads.uuidV4()).replace(/\\/g, "/");
    const ContentType = options?.contentType;
    const ContentLength = options?.contentLength;
    const ExpiresInSeconds = (options?.expiresInMs ?? 3600000) / 1000; // Default 1 hour

    const Client = await Uploads.getMinio();

    const Policy = Client.newPostPolicy();

    Policy.setBucket(BucketName);
    Policy.setKey(Key);

    if (typeof ContentType === "string") Policy.setContentType(ContentType);
    if (typeof ContentLength === "number")
      Policy.setContentLengthRange(0, ContentLength);

    const Expiry = new Date();
    Expiry.setSeconds(ExpiresInSeconds);
    Policy.setExpires(Expiry);

    const Results = await Client.presignedPostPolicy(Policy);

    return {
      method: "post",
      url: Results.postURL,
      fields: Results.formData,
      expiresIn: ExpiresInSeconds,
    };
  }

  static async deleteAwsS3Object(
    objectUrl: string | IParsedObjectUrl,
    options?: IObjectLocation
  ) {
    const BucketName =
      options?.bucketName ?? (await Env.get("AWS_S3_BUCKET_NAME"));
    const ObjectUrl =
      typeof objectUrl === "object"
        ? objectUrl
        : await Uploads.parseAwsS3ObjectUrl(objectUrl, options);
    const Client = await Uploads.getAwsS3(options?.region);

    return Client.send(
      new DeleteObjectCommand({
        Bucket: BucketName,
        Key: ObjectUrl.key,
      })
    );
  }

  static async deleteMinioObject(
    objectUrl: string | IParsedObjectUrl,
    options?: IObjectLocation
  ) {
    const BucketName =
      options?.bucketName ?? (await Env.get("MINIO_BUCKET_NAME"));
    const ObjectUrl =
      typeof objectUrl === "object"
        ? objectUrl
        : await Uploads.parseMinioObjectUrl(objectUrl);
    const Client = await Uploads.getMinio();

    return Client.removeObject(BucketName, ObjectUrl.key);
  }

  static async parseAwsS3ObjectUrl(
    objectUrl: string,
    options?: IObjectLocation
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

  static async parseMinioObjectUrl(
    objectUrl: string,
    options?: IObjectLocation
  ): Promise<IParsedObjectUrl> {
    const Endpoint = await Env.get("MINIO_ENDPOINT");
    const SourceUrl = new URL(`https://${Endpoint}`);
    const TargetUrl = new URL(objectUrl.split("?")[0]);

    if (TargetUrl.host === SourceUrl.host) {
      const TrimedPath = TargetUrl.pathname.replace(/^\/|\/$/g, "");
      const ResolvedPath = TrimedPath.split("/").slice(1);
      const UploadedLocation = ResolvedPath.slice(0, -1).join("/");
      const CheckLocation = options?.location?.replace(/^\/|\/$/g, "");

      if (CheckLocation && UploadedLocation !== CheckLocation)
        throw new Error(
          `Invalid upload location '${UploadedLocation}'! Expected location is '${CheckLocation}'`
        );

      return {
        provider: UploadsProvider.MINIO,
        key: ResolvedPath.join("/"),
        url: TargetUrl.toString(),
      };
    }

    throw new Error(
      `Invalid upload URL host '${TargetUrl.host}' has been provided! Expected host is '${SourceUrl.host}'!`
    );
  }

  static async signUploadUrl(options?: ISignUploadUrlOptions) {
    const Provider = options?.provider ?? (await Env.get("UPLOADS_PROVIDER"));

    switch (Provider) {
      case UploadsProvider.AWS_S3:
        return Uploads.signAwsS3UploadUrl(options);

      case UploadsProvider.MINIO:
        return Uploads.signMinioUploadUrl(options);

      default:
        throw new Error(`Invalid provider '${Provider}'!`);
    }
  }

  static async parseObjectUrl(objectUrl: string, options?: IObjectLocation) {
    const Provider = options?.provider ?? (await Env.get("UPLOADS_PROVIDER"));

    switch (Provider) {
      case UploadsProvider.AWS_S3:
        return Uploads.parseAwsS3ObjectUrl(objectUrl, options);

      case UploadsProvider.MINIO:
        return Uploads.parseMinioObjectUrl(objectUrl, options);

      default:
        throw new Error(`Invalid provider '${Provider}'!`);
    }
  }

  static async deleteObject(
    objectUrl: string | IParsedObjectUrl,
    options?: IObjectLocation
  ) {
    const Provider = options?.provider ?? (await Env.get("UPLOADS_PROVIDER"));

    switch (Provider) {
      case UploadsProvider.AWS_S3:
        return Uploads.deleteAwsS3Object(objectUrl, options);

      case UploadsProvider.MINIO:
        return Uploads.deleteMinioObject(objectUrl, options);

      default:
        throw new Error(`Invalid provider '${Provider}'!`);
    }
  }

  static async resolveObjectUrl(objectUrl: string, options?: IObjectLocation) {
    let Result: IParsedObjectUrl;

    try {
      Result = await Uploads.parseAwsS3ObjectUrl(objectUrl, options);
    } catch {
      try {
        Result = await Uploads.parseMinioObjectUrl(objectUrl, options);
      } catch {
        throw new Error(`Invalid object URL!`);
      }
    }

    return Result;
  }

  static async isValidObjectUrl(objectUrl: string, options?: IObjectLocation) {
    try {
      await Uploads.resolveObjectUrl(objectUrl, options);
      return true;
    } catch {
      return false;
    }
  }
}
