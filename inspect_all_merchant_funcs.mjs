import pg from 'pg';
import fs from 'fs';

const { Client } = pg;
const client = new Client({
  connectionString: 'postgresql://namnam_main_db_user:Krw4MIsjw0OSyEUtjEvEHoJmpHEpnwgB@dpg-d1tau5nfte5s73c6nub0-a.frankfurt-postgres.render.com/namnam_main_db',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    await client.connect();
    const res = await client.query(`
      SELECT p.proname AS function_name
      FROM pg_proc p
      WHERE p.proname ILIKE '%merchant%'
    `);
    fs.writeFileSync('db_merchant_all_functions.json', JSON.stringify(res.rows.map(r => r.function_name), null, 2), 'utf-8');
    
    console.log('Saved to db_merchant_all_functions.json');
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
