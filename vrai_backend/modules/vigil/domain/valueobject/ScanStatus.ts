export class ScanStatus {
  constructor(
    public readonly isAllowed: boolean,
    public readonly label: 'Autorisé' | 'Refusé',
    public readonly message: string
  ) {
    Object.freeze(this);
  }

  public static authorized(message: string): ScanStatus {
    return new ScanStatus(true, 'Autorisé', message);
  }

  public static denied(message: string): ScanStatus {
    return new ScanStatus(false, 'Refusé', message);
  }
}
