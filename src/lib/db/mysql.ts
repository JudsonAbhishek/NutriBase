import mysql, { Pool } from "mysql2/promise";

let pool: Pool | null = null;

export function getMySqlPool(): Pool | null {
  if (pool) return pool;

  const dbUrl = process.env.DATABASE_URL;
  const host = process.env.MYSQL_HOST || "localhost";
  const user = process.env.MYSQL_USER || "root";
  const password = process.env.MYSQL_PASSWORD || "";
  const database = process.env.MYSQL_DATABASE || "nutribase";
  const port = parseInt(process.env.MYSQL_PORT || "3306", 10);

  try {
    if (dbUrl) {
      pool = mysql.createPool({
        uri: dbUrl,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 2000,
      });
    } else {
      pool = mysql.createPool({
        host,
        port,
        user,
        password,
        database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 2000,
      });
    }
    return pool;
  } catch (err) {
    console.warn("MySQL pool initialization skipped or unreachable:", (err as Error).message);
    return null;
  }
}

export async function checkMySqlConnection(): Promise<boolean> {
  const p = getMySqlPool();
  if (!p) return false;
  try {
    const connection = await p.getConnection();
    await connection.ping();
    connection.release();
    return true;
  } catch {
    return false;
  }
}
