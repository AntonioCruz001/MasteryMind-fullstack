export function isTokenExpired(token, bufferSeconds = 0) {
  if (!token || typeof token !== 'string') return true;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');

    const payload = JSON.parse(atob(padded));
    if (typeof payload.exp !== 'number') return true;

    const nowInSeconds = Math.floor(Date.now() / 1000);
    return payload.exp <= nowInSeconds + bufferSeconds;
  } catch {
    return true;
  }
}