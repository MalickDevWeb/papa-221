import { PoolClient } from 'pg';

export async function upsertRecord(
  client: PoolClient,
  table: string,
  idField: string,
  record: any,
  mappings: Record<string, string>
): Promise<void> {
  if (!record || typeof record !== 'object') return;
  
  const colMap = new Map<string, any>();

  Object.entries(record).forEach(([key, val]) => {
    const colName = mappings[key] || key;
    const isMappedKey = Object.prototype.hasOwnProperty.call(mappings, key);
    if (!colMap.has(colName) || isMappedKey) {
      colMap.set(colName, val);
    }
  });

  const columns: string[] = [];
  const values: any[] = [];
  const updateParts: string[] = [];

  Array.from(colMap.entries()).forEach(([colName, val], idx) => {
    columns.push(colName);
    if (Array.isArray(val) || (val !== null && typeof val === 'object' && !(val instanceof Date))) {
      values.push(JSON.stringify(val));
    } else {
      values.push(val);
    }
  });

  columns.forEach((col, idx) => {
    if (col !== idField) {
      updateParts.push(`${col} = $${idx + 1}`);
    }
  });

  const placeholders = columns.map((_, idx) => `$${idx + 1}`).join(', ');
  const sql = `
    INSERT INTO ${table} (${columns.join(', ')})
    VALUES (${placeholders})
    ON CONFLICT (${idField})
    DO UPDATE SET ${updateParts.join(', ')}
  `;
  
  await client.query(sql, values);
}
