const toHex = (buffer) =>
  Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

const fromBase64 = (value) => Uint8Array.from(atob(value), (c) => c.charCodeAt(0));

const toBase64 = (value) =>
  btoa(String.fromCharCode(...new Uint8Array(value)));

export const hashPassword = async (password, salt = crypto.getRandomValues(new Uint8Array(16))) => {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    256
  );

  return {
    hash: toHex(derivedBits),
    salt: toBase64(salt)
  };
};

export const verifyPassword = async (password, storedHash, storedSalt) => {
  const salt = fromBase64(storedSalt);
  const result = await hashPassword(password, salt);
  return result.hash === storedHash;
};
