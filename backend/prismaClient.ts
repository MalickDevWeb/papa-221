import { readDb, writeDb } from './db';

function matches(item: any, where: any): boolean {
  if (!where) return true;
  return Object.keys(where).every(key => {
    const val = where[key];
    const itemVal = item[key];
    if (val && typeof val === 'object' && 'equals' in val) {
      const eq = val.equals;
      const mode = val.mode;
      if (mode === 'insensitive' && typeof itemVal === 'string' && typeof eq === 'string') {
        return itemVal.toLowerCase() === eq.toLowerCase();
      }
      return itemVal === eq;
    }
    return itemVal === val;
  });
}

function sortItems(items: any[], orderBy: any): any[] {
  if (!orderBy) return items;
  const orders = Array.isArray(orderBy) ? orderBy : [orderBy];
  return [...items].sort((a, b) => {
    for (const ord of orders) {
      const key = Object.keys(ord)[0];
      const direction = ord[key];
      const valA = a[key] ?? '';
      const valB = b[key] ?? '';
      if (valA !== valB) {
        const comparison = valA > valB ? 1 : -1;
        return direction === 'desc' ? -comparison : comparison;
      }
    }
    return 0;
  });
}

class PrismaModel {
  constructor(private dbKey: string) {}

  private getList(): any[] {
    const db = readDb() as any;
    return db[this.dbKey] || [];
  }

  private saveList(list: any[]) {
    const db = readDb() as any;
    db[this.dbKey] = list;
    writeDb(db);
  }

  async findMany(args?: any) {
    let list = this.getList();
    if (args?.where) list = list.filter(item => matches(item, args.where));
    if (args?.orderBy) list = sortItems(list, args.orderBy);
    return list;
  }

  async findFirst(args?: any) {
    const list = await this.findMany(args);
    return list[0] || null;
  }

  async findUnique(args: { where: any }) {
    return this.findFirst(args);
  }

  async count() {
    return this.getList().length;
  }

  async upsert(args: { where: any; update: any; create: any }) {
    const list = this.getList();
    const index = list.findIndex(item => matches(item, args.where));
    let finalItem: any;
    if (index !== -1) {
      finalItem = { ...list[index], ...args.update };
      list[index] = finalItem;
    } else {
      finalItem = args.create;
      list.push(finalItem);
    }
    this.saveList(list);
    return finalItem;
  }

  async delete(args: { where: any }) {
    const list = this.getList();
    const index = list.findIndex(item => matches(item, args.where));
    if (index === -1) throw new Error("Record not found to delete");
    const [deleted] = list.splice(index, 1);
    this.saveList(list);
    return deleted;
  }
}

export const prisma = {
  student: new PrismaModel('students'),
  professor: new PrismaModel('professors'),
  staff: new PrismaModel('staff'),
  session: new PrismaModel('sessions'),
  course: new PrismaModel('courses'),
  promotion: new PrismaModel('promotions'),
  badgeScan: new PrismaModel('badgeScans'),
  attendance: new PrismaModel('attendances'),
};
