// Convert hex string to Uint8Array
const hexToBytes = (hex: string): Uint8Array => {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
};

// Convert Uint8Array to hex string
const bytesToHex = (bytes: Uint8Array): string => {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// Generate a random 256-bit key if none is provided
const generateKey = (): string => {
  const key = new Uint8Array(32); // 32 bytes = 256 bits
  crypto.getRandomValues(key);
  return bytesToHex(key);
};

// Get or generate encryption key
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || generateKey();

// Ensure the key is exactly 256 bits (32 bytes)
const normalizeKey = (key: string): Uint8Array => {
  // Remove '0x' prefix if present
  const cleanKey = key.startsWith('0x') ? key.slice(2) : key;
  
  // Pad or truncate to exactly 64 hex characters (32 bytes)
  const paddedKey = cleanKey.padEnd(64, '0').slice(0, 64);
  
  return hexToBytes(paddedKey);
};

export const encryptPrivateKey = async (privateKey: string): Promise<{ encryptedData: string; iv: string }> => {
  try {
    const encoder = new TextEncoder();
    const keyData = normalizeKey(ENCRYPTION_KEY);
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );

    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      encoder.encode(privateKey)
    );

    return {
      encryptedData: bytesToHex(new Uint8Array(encryptedBuffer)),
      iv: bytesToHex(iv),
    };
  } catch (error) {
    console.error('Encryption error details:', {
      keyLength: ENCRYPTION_KEY.length,
      error
    });
    throw error;
  }
};

export const decryptPrivateKey = async (encryptedData: string, iv: string): Promise<string> => {
  try {
    const keyData = normalizeKey(ENCRYPTION_KEY);
    const decoder = new TextDecoder();

    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: hexToBytes(iv),
      },
      key,
      hexToBytes(encryptedData)
    );

    return decoder.decode(decryptedBuffer);
  } catch (error) {
    console.error('Decryption error details:', {
      keyLength: ENCRYPTION_KEY.length,
      error
    });
    throw error;
  }
}; 