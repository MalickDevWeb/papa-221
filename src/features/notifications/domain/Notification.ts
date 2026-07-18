export interface Notification {
  readonly id: string;
  readonly title: string;
  readonly desc: string;
  readonly time: string;
  readonly read: boolean;
  readonly icon: string;
  readonly color: string;
  readonly createdAt: number;
}
