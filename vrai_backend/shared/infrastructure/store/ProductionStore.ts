import { readDb, writeDb } from '../../../../backend/db';

export class ProductionStore {
  private static instance: ProductionStore;
  private memoryCache: any = null;

  private constructor() {
    this.reload();
  }

  public static getInstance(): ProductionStore {
    if (!this.instance) {
      this.instance = new ProductionStore();
    }
    return this.instance;
  }

  public reload(): void {
    this.memoryCache = readDb();
  }

  public getTable(tableName: string): any[] {
    if (!this.memoryCache) {
      this.reload();
    }
    return this.memoryCache[tableName] || [];
  }

  public saveTable(tableName: string, data: any[]): void {
    if (!this.memoryCache) {
      this.reload();
    }
    this.memoryCache[tableName] = data;
    writeDb(this.memoryCache);
  }

  public query(tableName: string, filterFn: (item: any) => boolean): any[] {
    return this.getTable(tableName).filter(filterFn);
  }

  public findOne(tableName: string, filterFn: (item: any) => boolean): any | null {
    return this.getTable(tableName).find(filterFn) || null;
  }

  public insert(tableName: string, record: any): void {
    const table = this.getTable(tableName);
    table.unshift(record);
    this.saveTable(tableName, table);
  }

  public update(tableName: string, id: string, updateFn: (item: any) => any): boolean {
    const table = this.getTable(tableName);
    const index = table.findIndex(item => item.id === id);
    if (index === -1) return false;
    table[index] = { ...table[index], ...updateFn(table[index]) };
    this.saveTable(tableName, table);
    return true;
  }
}
