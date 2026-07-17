export class BadgeScan {
  private constructor(
    private readonly _id: string,
    private readonly _badgeId: string,
    private readonly _badgeOwner: string,
    private readonly _studentId: string,
    private readonly _status: 'Autorisé' | 'Refusé',
    private readonly _message: string,
    private readonly _assiduite: string,
    private readonly _statutFrais: string,
    private readonly _zone: string,
    private readonly _time: string,
    private readonly _date: string,
    private readonly _type: string
  ) {
    if (!_badgeId) {
      throw new Error("L'identifiant du badge ne peut pas être vide");
    }
  }

  public static create(
    id: string,
    badgeId: string,
    badgeOwner: string,
    studentId: string,
    status: 'Autorisé' | 'Refusé',
    message: string,
    assiduite: string,
    statutFrais: string,
    zone: string,
    time: string,
    date: string,
    type: string
  ): BadgeScan {
    return new BadgeScan(
      id,
      badgeId,
      badgeOwner,
      studentId,
      status,
      message,
      assiduite,
      statutFrais,
      zone,
      time,
      date,
      type
    );
  }

  public get id(): string { return this._id; }
  public get badgeId(): string { return this._badgeId; }
  public get badgeOwner(): string { return this._badgeOwner; }
  public get studentId(): string { return this._studentId; }
  public get status(): 'Autorisé' | 'Refusé' { return this._status; }
  public get message(): string { return this._message; }
  public get assiduite(): string { return this._assiduite; }
  public get statutFrais(): string { return this._statutFrais; }
  public get zone(): string { return this._zone; }
  public get time(): string { return this._time; }
  public get date(): string { return this._date; }
  public get type(): string { return this._type; }

  public toJSON() {
    return {
      id: this._id,
      badgeOwner: this._badgeOwner,
      studentId: this._studentId,
      statut: this._status,
      message: this._message,
      assiduite: this._assiduite,
      statutFrais: this._statutFrais,
      zone: this._zone,
      time: this._time,
      date: this._date,
      type: this._type
    };
  }
}
