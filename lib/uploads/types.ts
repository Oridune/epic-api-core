import { ObjectCannedACL } from "aws-s3";

export enum UploadsProvider {
  AWS_S3 = "aws-s3",
  MINIO = "minio",
}

export interface ISignUploadUrlOptions {
  provider?: UploadsProvider;
  region?: string;
  bucketName?: string;
  location?: string;
  contentType?: string;
  contentLength?: number;
  awsS3ACL?: ObjectCannedACL;
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
  path: string;
  key: string;
  url: string;
}

export interface IObjectLocation {
  provider?: UploadsProvider;
  region?: string;
  bucketName?: string;
  location?: string;
}
