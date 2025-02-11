const crypto = require("crypto");

const generatePassword = (
  length = 16,
  options = { upper: true, lower: true, numbers: true, symbols: true }
) => {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+[]{}|;:,.<>?";

  let characters = "";
  if (options.upper) characters += upper;
  if (options.lower) characters += lower;
  if (options.numbers) characters += numbers;
  if (options.symbols) characters += symbols;

  if (!characters)
    throw new Error("At least one character type must be selected");

  return Array.from(crypto.randomBytes(length))
    .map((byte) => characters[byte % characters.length])
    .join("");
};

module.exports = generatePassword;
