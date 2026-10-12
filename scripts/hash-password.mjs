#!/usr/bin/env node
import { randomBytes, scryptSync } from 'node:crypto';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const N = 16384;
const r = 8;
const p = 1;
const keylen = 64;

const argPassword = process.argv.slice(2).join(' ').trim();

async function readPassword() {
  if (argPassword) return argPassword;
  const rl = createInterface({ input, output });
  const password = await rl.question('Contraseña a hashear: ');
  rl.close();
  return password.trim();
}

const password = await readPassword();
if (!password) {
  console.error('La contraseña no puede estar vacía.');
  process.exit(1);
}

const salt = randomBytes(16);
const hash = scryptSync(password, salt, keylen, { N, r, p });
console.log(`ADMIN_PASSWORD_HASH=scrypt$${N}$${r}$${p}$${salt.toString('hex')}$${hash.toString('hex')}`);
