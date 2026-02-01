/**
 * Creates admin user for Yara (email or phone login).
 * Run: node scripts/create-admin-yara.mjs <email> <password> [phone]
 * Example: node scripts/create-admin-yara.mjs "yara@urizink.com" "YourSecurePassword" "+961 1 234 567"
 *
 * Then run the printed SQL in your database (e.g. psql, Neon SQL editor, or Drizzle studio).
 */

import pkg from "bcryptjs";
const { hash } = pkg;

const email = process.argv[2];
const password = process.argv[3];
const phone = process.argv[4] ?? null;

if (!email || !password) {
  console.error("Usage: node scripts/create-admin-yara.mjs <email> <password> [phone]");
  console.error('Example: node scripts/create-admin-yara.mjs "yara@urizink.com" "MyPassword" "+961 1 234 567"');
  process.exit(1);
}

const hashed = await hash(password, 10);
const phoneVal = phone ? `'${phone.replace(/'/g, "''")}'` : "NULL";
const emailEscaped = email.replace(/'/g, "''");
const hashEscaped = hashed.replace(/'/g, "''");

const sql = `-- Create/update Yara as admin (login with email or phone)
INSERT INTO users (id, email, first_name, last_name, phone, password_hash, is_admin, created_at)
VALUES (gen_random_uuid(), '${emailEscaped}', 'Yara', 'Admin', ${phoneVal}, '${hashEscaped}', true, now())
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  phone = COALESCE(EXCLUDED.phone, users.phone),
  is_admin = true;`;

console.log(sql);
console.log("\n-- Run the SQL above in your database to create Yara as admin.");
console.log("-- She can then log in at /admin/login with this email or phone number and password.");
