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

export interface ISignedUrlResult {
  method: string;
  url?: string;
  getUrl: string;
  expiresInSeconds: number;
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
