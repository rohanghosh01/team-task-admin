import CryptoJS from "crypto-js";

const SECRET = process.env.NEXT_PUBLIC_CRYPTO_SECRET as string;

// Encrypts a value
export const encrypt = (text: string): string => {
  return CryptoJS.AES.encrypt(text, SECRET).toString(); // Encrypt the text
};

// Decrypts a value
export const decrypt = (cipherText: string): string => {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET); // Decrypt the text
  return bytes.toString(CryptoJS.enc.Utf8); // Convert to UTF-8 string
};
