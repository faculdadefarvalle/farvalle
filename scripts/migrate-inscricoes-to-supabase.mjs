import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import mysql from "mysql2/promise";
import { createClient } from "@supabase/supabase-js";

const root = process.cwd();
const envPath = path.join(root, ".env");

if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, "utf8");

  for (const line of envFile.split(/\r?\n/)) {
    const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;

    const key = match[1];
    const value = match[2].replace(/^["']|["']$/g, "");
    process.env[key] ??= value;
  }
}

const databaseUrl = process.env.DATABASE_URL;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to read the current MySQL database.");
}

if (!supabaseUrl || (!serviceRoleKey && !publishableKey)) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL and a Supabase key are required to migrate data.");
}

const mysqlConnection = await mysql.createConnection(databaseUrl);
const canUpsert = Boolean(serviceRoleKey);
const supabase = createClient(supabaseUrl, serviceRoleKey ?? publishableKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const [rows] = await mysqlConnection.execute(`
  select
    id,
    nome,
    telefone,
    email,
    cidade,
    conheceu,
    ingresso,
    curso,
    createdAt
  from Inscricao
`);

await mysqlConnection.end();

if (rows.length === 0) {
  console.log("No inscricoes found in the current MySQL database.");
  process.exit(0);
}

const records = rows.map((row) => ({
  id: row.id,
  nome: row.nome,
  telefone: row.telefone,
  email: row.email,
  cidade: row.cidade,
  conheceu: row.conheceu,
  ingresso: row.ingresso,
  curso: row.curso,
  created_at: row.createdAt,
}));

const chunkSize = 500;
let migrated = 0;

for (let index = 0; index < records.length; index += chunkSize) {
  const chunk = records.slice(index, index + chunkSize);
  const query = supabase.from("inscricoes");
  const { error } = canUpsert
    ? await query.upsert(chunk, { onConflict: "id" })
    : await query.insert(chunk);

  if (error) {
    throw error;
  }

  migrated += chunk.length;
  console.log(`Migrated ${migrated}/${records.length} inscricoes.`);
}

console.log("Migration finished.");
