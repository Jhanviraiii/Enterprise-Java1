/**
 * Computes a real SHA-256 checksum hash for a string or File buffer
 */
export async function computeSHA256(data: string | ArrayBuffer): Promise<string> {
  const encoder = new TextEncoder();
  const buffer = typeof data === 'string' ? encoder.encode(data) : data;
  
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export function generateUUID(): string {
  return 'scap-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now().toString(36);
}
