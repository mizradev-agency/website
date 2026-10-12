#!/usr/bin/env node
import { randomBytes } from 'node:crypto';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32Encode(buffer) {
  let bits = '';
  for (const byte of buffer) bits += byte.toString(2).padStart(8, '0');
  let output = '';
  for (let i = 0; i < bits.length; i += 5) {
    const chunk = bits.slice(i, i + 5).padEnd(5, '0');
    output += alphabet[Number.parseInt(chunk, 2)];
  }
  return output;
}

const sessionSecret = randomBytes(48).toString('base64url');
const totpSecret = base32Encode(randomBytes(20));

console.log('Copia estas variables a tu archivo .env:\n');
console.log(`SESSION_SECRET=${sessionSecret}`);
console.log(`ADMIN_TOTP_SECRET=${totpSecret}`);
console.log('\nEl TOTP es opcional. Si lo activas, añádelo a tu app de autenticación (Aegis, 1Password, Authy).');
console.log(`otpauth://totp/Stone:admin?secret=${totpSecret}&issuer=Stone&algorithm=SHA1&digits=6&period=30`);
