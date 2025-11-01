export async function verifyTurnstile(token: string, remoteip?: string) {
  const secret = process.env.CF_TURNSTILE_SECRET_KEY!;

  const form = new URLSearchParams();
  form.append('secret', secret);
  form.append('response', token);
  if (remoteip) form.append('remoteip', remoteip);

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: form,
  });

  const data = await res.json();
  return data as { success: boolean; 'error-codes'?: string[] };
}

