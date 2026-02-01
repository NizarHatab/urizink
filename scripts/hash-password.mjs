/**
 * One-time script to hash a password for the first admin user.
 * Run: node scripts/hash-password.mjs "your-password"
 * Then in your DB: UPDATE users SET password_hash = '<output>' WHERE email = 'admin@example.com' AND is_admin = true;
 */
import pkg from "bcryptjs";
const { hash } = pkg;

const password = process.argv[2];
if (!password) {
  console.error("Usage: node scripts/hash-password.mjs <password>");
  process.exit(1);
}

const hashed = await hash(password, 10);
console.log(hashed);
