import { type TRequestHandlerObject } from "./controller/base.ts";

export class Versioned {
  private GlobalHandlerObject?: Partial<TRequestHandlerObject>;
  private Map = new Map<string | string[], TRequestHandlerObject>();

  /**
   * Add a global handler configuration
   * @param handlerObject Request Handler Object
   * @returns
   */
  static global(handlerObject: Partial<TRequestHandlerObject>) {
    return new Versioned().global(handlerObject);
  }

  /**
   * Add a request handler version
   * @param version Version of the API request handler
   * @param handlerObject Request Handler Object
   * @returns
   */
  static add(version: string | string[], handlerObject: TRequestHandlerObject) {
    return new Versioned().add(version, handlerObject);
  }

  /**
   * Add a global handler configuration
   * @param handlerObject Request Handler Object
   * @returns
   */
  public global(handlerObject: Partial<TRequestHandlerObject>) {
    this.GlobalHandlerObject = handlerObject;
    return this;
  }

  /**
   * Add a request handler version
   * @param version Version of the API request handler
   * @param handlerObject Request Handler Object
   * @returns
   */
  public add(version: string | string[], handlerObject: TRequestHandlerObject) {
    this.Map.set(version, { ...this.GlobalHandlerObject, ...handlerObject });
    return this;
  }

  /**
   * Add metadata to the handlerObject(s) of the existing request handler version(s)
   * @param metadata An object to be merged or a function which returns handlerObject
   * @returns
   */
  public setMetadata(
    metadata:
      | Record<string, unknown>
      | ((handlerObject: TRequestHandlerObject) => TRequestHandlerObject),
  ) {
    let MetadataKeys: string[];

    for (const [Version, handlerObject] of this.Map) {
      if (typeof metadata === "function") {
        this.Map.set(Version, metadata(handlerObject));
      } else {
        (MetadataKeys ??= Object.keys(metadata)).forEach((key) => {
          handlerObject[key] = metadata[key];
        });
      }
    }

    return this;
  }

  public toMap() {
    return this.Map;
  }
}
