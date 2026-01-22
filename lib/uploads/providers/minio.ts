import { Env } from "@Core/common/env.ts";
import { join } from "path";
import { Client as MinioClient } from "minio";
import {
  IObjectLocation,
  IParsedObjectUrl,
  ISignUploadUrlOptions,
  UploadsProvider,
} from "../types.ts";
import { Utils } from "../utils.ts";

export class MinioProvider {
  static Minio?: MinioClient;

  static async getClient() {
    const [Endpoint, AccessKey, SecretKey] = await Promise.all([
      Env.get("MINIO_ENDPOINT"),
      Env.get("MINIO_ACCESS_KEY"),
      Env.get("MINIO_SECRET_KEY"),
    ]);

    return (this.Minio ??= new MinioClient({
      endPoint: Endpoint,
      accessKey: AccessKey,
      secretKey: SecretKey,
    }));
  }

  static async signUploadUrl(
    options?: Omit<ISignUploadUrlOptions, "provider">,
  ) {
    // Gather information
    const BucketName = options?.bucketName ??
      (await Env.get("MINIO_BUCKET_NAME"));
    const Location = options?.location ?? "";
    const Key = join(Location, Utils.uuidV4()).trim().replace(/\\/g, "/").split(
      "/",
    ).filter(Boolean).join("/")
      .replace(/^\//, "");
    const ContentType = options?.contentType;
    const ContentLength = options?.contentLength;
    const ExpiresInSeconds = (options?.expiresInMs ?? 3600000) / 1000; // Default 1 hour

    const Client = await this.getClient();

    const Policy = Client.newPostPolicy();

    Policy.setBucket(BucketName);
    Policy.setKey(Key);

    if (typeof ContentType === "string") Policy.setContentType(ContentType);
    if (typeof ContentLength === "number") {
      Policy.setContentLengthRange(0, ContentLength);
    }

    const Expiry = new Date();
    Expiry.setSeconds(ExpiresInSeconds);
    Policy.setExpires(Expiry);

    const Results = await Client.presignedPostPolicy(Policy);

    const ObjectUrl = await this.parseObjectUrl(Results.postURL);

    return {
      method: "post",
      url: Results.postURL,
      getUrl: ObjectUrl.url,
      fields: Results.formData,
      expiresInSeconds: ExpiresInSeconds,
    };
  }

  static async signGetUrl(
    objectUrl: string | Omit<IParsedObjectUrl, "provider">,
    options?: Omit<IObjectLocation, "provider"> & { expiresInMs?: number },
  ) {
    // Gather information
    const BucketName = options?.bucketName ??
      (await Env.get("MINIO_BUCKET_NAME"));
    const ObjectUrl = typeof objectUrl === "object"
      ? objectUrl
      : await this.parseObjectUrl(objectUrl);
    const ExpiresInSeconds = (options?.expiresInMs ?? 3600000) / 1000; // Default 1 hour
    const Client = await this.getClient();

    return {
      method: "get",
      getUrl: await Client.presignedGetObject(
        BucketName,
        ObjectUrl.key,
        ExpiresInSeconds,
      ),
      expiresInSeconds: ExpiresInSeconds,
    };
  }

  static async getObject(
    objectUrl: string | Omit<IParsedObjectUrl, "provider">,
    options?: Omit<IObjectLocation, "provider">,
  ) {
    // Gather information
    const BucketName = options?.bucketName ??
      (await Env.get("MINIO_BUCKET_NAME"));
    const ObjectUrl = typeof objectUrl === "object"
      ? objectUrl
      : await this.parseObjectUrl(objectUrl);
    const Client = await this.getClient();

    const Data = await Client.getObject(BucketName, ObjectUrl.key);

    if (!(Data instanceof ReadableStream)) throw new Error(`File not found!`);

    return Data;
  }

  static async objectExists(
    objectUrl: string | Omit<IParsedObjectUrl, "provider">,
    options?: Omit<IObjectLocation, "provider">,
  ) {
    // Gather information
    const BucketName = options?.bucketName ??
      (await Env.get("MINIO_BUCKET_NAME"));
    const ObjectUrl = typeof objectUrl === "object"
      ? objectUrl
      : await this.parseObjectUrl(objectUrl);
    const Client = await this.getClient();

    return Client.statObject(BucketName, ObjectUrl.key)
      .then(() => true)
      .catch(() => false);
  }

  static async deleteObject(
    objectUrl: string | Omit<IParsedObjectUrl, "provider">,
    options?: Omit<IObjectLocation, "provider">,
  ) {
    const BucketName = options?.bucketName ??
      (await Env.get("MINIO_BUCKET_NAME"));
    const ObjectUrl = typeof objectUrl === "object"
      ? objectUrl
      : await this.parseObjectUrl(objectUrl);
    const Client = await this.getClient();

    return Client.removeObject(BucketName, ObjectUrl.key);
  }

  static async parseObjectUrl(
    objectUrl: string,
    options?: Omit<IObjectLocation, "provider">,
  ): Promise<IParsedObjectUrl> {
    const Endpoint = await Env.get("MINIO_ENDPOINT");
    const SourceUrl = new URL(`https://${Endpoint}`);
    const TargetUrl = new URL(objectUrl.split("?")[0]);

    if (TargetUrl.host === SourceUrl.host) {
      const TrimedPath = TargetUrl.pathname.replace(/^\/|\/$/g, "");
      const ResolvedPath = TrimedPath.split("/").slice(1);
      const UploadedLocation = ResolvedPath.slice(0, -1).join("/");
      const CheckLocation = options?.location?.replace(/^\/|\/$/g, "");

      if (CheckLocation && UploadedLocation !== CheckLocation) {
        throw new Error(
          `Invalid upload location '${UploadedLocation}'! Expected location is '${CheckLocation}'`,
        );
      }

      const Path = ResolvedPath.join("/");

      return {
        provider: UploadsProvider.MINIO,
        path: Path,
        key: Path.replace(/^\/|\/$/g, ""),
        url: TargetUrl.toString(),
      };
    }

    throw new Error(
      `Invalid upload URL host '${TargetUrl.host}' has been provided! Expected host is '${SourceUrl.host}'!`,
    );
  }
}
