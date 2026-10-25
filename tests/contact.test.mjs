import test from 'node:test';
import assert from 'node:assert/strict';
import { contact } from '../server/contact.mjs';
const env = {
  RESEND_API_KEY: 'test-secret',
  TURNSTILE_SECRET_KEY: 'test-secret',
  TURNSTILE_SITE_KEY: 'public',
  CONTACT_TO_EMAIL: 'owner@example.com',
  CONTACT_FROM_EMAIL: 'Web <web@example.com>',
  CONTACT_HOSTNAME: 'site.example',
};
const valid = {
  name: 'Ana',
  email: 'ana@example.com',
  service: 'Web',
  message: 'Quiero una web.',
  token: 'test-token',
};
function request(data = valid, options = {}) {
  return new Request('https://site.example/api/contact', {
    method: 'POST',
    headers: {
      origin: 'https://site.example',
      'content-type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(data),
  });
}
const neverFetch = () => {
  throw new Error('Must not call external services');
};
test('fails closed without secrets, and never exposes secrets in public config', async () => {
  assert.equal((await contact(request(), {}, neverFetch)).status, 503);
  const response = await contact(new Request('https://site.example/api/contact'), env, neverFetch);
  assert.deepEqual(await response.json(), { message: '', siteKey: 'public' });
});
test('blocks origins, preview hosts, oversized bodies, invalid fields, traps and missing tokens', async () => {
  assert.equal(
    (
      await contact(
        request(valid, { headers: { origin: 'https://evil.example' } }),
        env,
        neverFetch
      )
    ).status,
    403
  );
  assert.equal(
    (await contact(request(), { ...env, CONTACT_HOSTNAME: 'other.example' }, neverFetch)).status,
    503
  );
  for (const data of [
    { ...valid, token: '' },
    { ...valid, email: 'bad\naddress' },
    { ...valid, name: 'a\nb' },
    { ...valid, message: '' },
    { ...valid, website: 'spam' },
    null,
    { ...valid, message: 'a'.repeat(5001) },
  ])
    assert.equal((await contact(request(data), env, neverFetch)).status, 400);
  assert.equal(
    (await contact(request({ ...valid, message: 'a'.repeat(24001) }), env, neverFetch)).status,
    413
  );
});
test('never sends emails for invalid, replayed, wrong-host or wrong-action tokens', async () => {
  for (const result of [
    { success: false },
    { success: true, hostname: 'evil.example', action: 'contact' },
    { success: true, hostname: env.CONTACT_HOSTNAME, action: 'login' },
  ]) {
    let calls = 0;
    const response = await contact(request(), env, async (url) => {
      calls++;
      assert.match(url, /siteverify$/);
      return Response.json(result);
    });
    assert.equal(response.status, 400);
    assert.equal(calls, 1);
  }
});
test('only sends to configured owner after verification, with safe reply-to and plain text', async () => {
  let calls = 0;
  const response = await contact(
    request({ ...valid, to: 'attacker@example.com', message: '<script>alert(1)</script>' }),
    env,
    async (url, options) => {
      calls++;
      if (url.includes('siteverify'))
        return Response.json({ success: true, hostname: env.CONTACT_HOSTNAME, action: 'contact' });
      const body = JSON.parse(options.body);
      assert.deepEqual(body.to, ['owner@example.com']);
      assert.equal(body.reply_to, valid.email);
      assert.equal(body.html, undefined);
      assert.match(options.headers['Idempotency-Key'], /^contact-[a-f0-9]{64}$/);
      return Response.json({ id: 'test-id' });
    }
  );
  assert.equal(response.status, 200);
  assert.equal(calls, 2);
});
test('upstream failures never report success or leak secrets', async () => {
  for (const failVerification of [true, false]) {
    const response = await contact(request(), env, async (url) => {
      if (url.includes('siteverify') && !failVerification)
        return Response.json({ success: true, hostname: env.CONTACT_HOSTNAME, action: 'contact' });
      return Response.json({ error: 'sensitive-provider-detail' }, { status: 429 });
    });
    assert.equal(response.status, 503);
    assert.doesNotMatch(await response.text(), /sensitive|test-secret/);
  }
});
