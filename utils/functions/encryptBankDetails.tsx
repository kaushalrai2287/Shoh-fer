import { createCipheriv, randomBytes, createDecipheriv } from 'crypto';

// Ensure the encryption key is loaded correctly
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
  throw new Error('ENCRYPTION_KEY is not set in environment variables.');
}

if (ENCRYPTION_KEY.length !== 64) {
  throw new Error('ENCRYPTION_KEY must be a 32-byte hexadecimal key (64 characters).');
}

const IV_LENGTH = 16; // AES block size (128-bit block)

/**
 * Encrypt a given text using AES-256-CBC.
 * @param {string} text - The text to encrypt.
 * @returns {string} - The encrypted text along with the IV (in the format "iv:encryptedData").
 */
export function encrypt(text: string): string {
  // Generate a random IV (16 bytes)
  const iv = randomBytes(IV_LENGTH);

  // Use non-null assertion (!) to ensure ENCRYPTION_KEY is not undefined
  const cipher = createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY!, 'hex'), iv);

  // Encrypt the text
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Return both IV and encrypted data as a combined string
  return iv.toString('hex') + ':' + encrypted;
}

/**
 * Decrypt a given encrypted string using AES-256-CBC.
 * @param {string} encryptedText - The encrypted text in the format "iv:encryptedData".
 * @returns {string} - The decrypted text.
 */
export function decrypt(encryptedText: string): string {
  if (!encryptedText) {
    throw new Error('Encrypted text is missing.');
  }

  // Split the input string into IV and encrypted data
  const [ivHex, encryptedData] = encryptedText.split(':');

  // Convert the IV back to a buffer
  const iv = Buffer.from(ivHex, 'hex');

  // Use non-null assertion (!) to ensure ENCRYPTION_KEY is not undefined
  const decipher = createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY!, 'hex'), iv);

  // Decrypt the data
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  // Return the decrypted text
  return decrypted;
}