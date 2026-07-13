import { PoolClient } from 'pg';

export async function upsertRecord(
  client: PoolClient,
  table: string,
  idField: string,
  record: any,
  mappings: Record<string, string>
): Promise<void> {
  if (!record || typeof record !== 'object') return;
  
  const columns: string[] = [];
  const values: any[] = [];
  const updateParts: string[] = [];

  Object.entries(record).forEach(([key, val]) => {
    const colName = mappings[key] || key;
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
