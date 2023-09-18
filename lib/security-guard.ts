export class SecurityGuard {
  protected AllScopes: Set<string>;
  protected RequestedScopes: Set<string>;
  protected PermittedScopes: Set<string>;

  protected AllPermissionsExists: boolean;
  protected AllPermissionsRequested: boolean;
  protected AllPermissionsPermitted: boolean;

  protected findCommonElements<T>(
    arr1: T[] | Set<T>,
    arr2: T[] | Set<T>
  ): Set<T> {
    const Set1 = new Set(arr1);
    return new Set(Array.from(arr2).filter((element) => Set1.delete(element)));
  }

  constructor(
    allScopes: string[],
    requestedScopes: string[],
    permittedScopes: string[]
  ) {
    this.AllScopes = new Set(allScopes);
    this.RequestedScopes = new Set(requestedScopes);
    this.PermittedScopes = new Set(permittedScopes);

    this.AllPermissionsExists = this.AllScopes.has("*");
    this.AllPermissionsRequested = this.RequestedScopes.has("*");
    this.AllPermissionsPermitted = this.PermittedScopes.has("*");
  }

  public isPermitted(scope: string, permission?: string) {
    let Allowed = false;
    let Permitted = false;

    if (this.AllPermissionsExists) {
      if (this.AllPermissionsRequested) Allowed = true;
      else if (
        this.RequestedScopes.has(scope) ||
        (typeof permission === "string" &&
          this.RequestedScopes.has(`${scope}.${permission}`))
      )
        Allowed = true;
    } else {
      if (this.AllPermissionsRequested) {
        if (
          this.AllScopes.has(scope) ||
          (typeof permission === "string" &&
            this.AllScopes.has(`${scope}.${permission}`))
        )
          Allowed = true;
      } else {
        const Scopes = this.findCommonElements(
          this.AllScopes,
          this.RequestedScopes
        );

        if (
          Scopes.has(scope) ||
          (typeof permission === "string" &&
            Scopes.has(`${scope}.${permission}`))
        )
          Allowed = true;
      }
    }

    if (Allowed) {
      Permitted =
        this.AllPermissionsPermitted ||
        this.PermittedScopes.has(scope) ||
        (typeof permission === "string" &&
          this.PermittedScopes.has(`${scope}.${permission}`));
    }

    return Permitted;
  }
}
