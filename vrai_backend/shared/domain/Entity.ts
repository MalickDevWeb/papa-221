export abstract class Entity<T> {
  protected readonly _id: string;
  protected readonly _props: T;

  protected constructor(id: string, props: T) {
    this._id = id;
    this._props = props;
  }

  public get id(): string {
    return this._id;
  }

  public equals(object?: Entity<T>): boolean {
    if (object === null || object === undefined) {
      return false;
    }
    if (this === object) {
      return true;
    }
    return this._id === object._id;
  }
}
