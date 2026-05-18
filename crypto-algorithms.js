/**
 * Modern Cryptography Algorithms
 * Educational Version:
 * - AES-like reversible cipher
 * - RSA simplified
 * - XOR Stream Cipher
 * - Enhanced Substitution Cipher
 */

// ==================== AES SIMPLIFIED (Educational Version) ====================

class AESSimplified {
  constructor(key) {
    if (!key || typeof key !== "string") {
      throw new Error("Key AES tidak boleh kosong.");
    }

    this.key = this.expandKey(key);
  }

  expandKey(key) {
    let expandedKey = key;

    while (expandedKey.length < 16) {
      expandedKey += key;
    }

    return expandedKey
      .substring(0, 16)
      .split("")
      .map((char) => char.charCodeAt(0) % 256);
  }

  encrypt(text) {
    const state = this.stringToState(text);

    for (let round = 0; round < 10; round++) {
      this.subBytes(state);
      this.shiftRows(state);

      if (round < 9) {
        this.mixColumns(state);
      }

      this.addRoundKey(state, round);
    }

    return this.stateToString(state);
  }

  decrypt(ciphertext) {
    const state = this.stringToState(ciphertext);

    for (let round = 9; round >= 0; round--) {
      this.addRoundKey(state, round);

      if (round < 9) {
        this.invMixColumns(state);
      }

      this.invShiftRows(state);
      this.invSubBytes(state);
    }

    return this.stateToString(state).replace(/\0+$/g, "");
  }

  stringToState(str) {
    const state = [];

    for (let i = 0; i < Math.min(str.length, 16); i++) {
      state.push(str.charCodeAt(i) % 256);
    }

    while (state.length < 16) {
      state.push(0);
    }

    return state.slice(0, 16);
  }

  stateToString(state) {
    return state.map((byte) => String.fromCharCode(byte)).join("");
  }

  subBytes(state) {
    for (let i = 0; i < state.length; i++) {
      state[i] = (state[i] * 29 + 37) % 256;
    }
  }

  invSubBytes(state) {
    // 29^-1 mod 256 = 53
    for (let i = 0; i < state.length; i++) {
      state[i] = (((state[i] - 37 + 256) * 53) % 256 + 256) % 256;
    }
  }

  shiftRows(state) {
    const original = [...state];

    // Row 0 tetap
    state[0] = original[0];
    state[4] = original[4];
    state[8] = original[8];
    state[12] = original[12];

    // Row 1 shift kiri 1
    state[1] = original[5];
    state[5] = original[9];
    state[9] = original[13];
    state[13] = original[1];

    // Row 2 shift kiri 2
    state[2] = original[10];
    state[6] = original[14];
    state[10] = original[2];
    state[14] = original[6];

    // Row 3 shift kiri 3
    state[3] = original[15];
    state[7] = original[3];
    state[11] = original[7];
    state[15] = original[11];
  }

  invShiftRows(state) {
    const original = [...state];

    // Row 0 tetap
    state[0] = original[0];
    state[4] = original[4];
    state[8] = original[8];
    state[12] = original[12];

    // Row 1 shift kanan 1
    state[1] = original[13];
    state[5] = original[1];
    state[9] = original[5];
    state[13] = original[9];

    // Row 2 shift kanan 2
    state[2] = original[10];
    state[6] = original[14];
    state[10] = original[2];
    state[14] = original[6];

    // Row 3 shift kanan 3
    state[3] = original[7];
    state[7] = original[11];
    state[11] = original[15];
    state[15] = original[3];
  }

  mixColumns(state) {
    for (let i = 0; i < 16; i += 4) {
      const a = state[i];
      const b = state[i + 1];
      const c = state[i + 2];
      const d = state[i + 3];

      state[i] = (a + b) % 256;
      state[i + 1] = (b + c) % 256;
      state[i + 2] = (c + d) % 256;
      state[i + 3] = d;
    }
  }

  invMixColumns(state) {
    for (let i = 0; i < 16; i += 4) {
      const mixedA = state[i];
      const mixedB = state[i + 1];
      const mixedC = state[i + 2];
      const d = state[i + 3];

      const c = (mixedC - d + 256) % 256;
      const b = (mixedB - c + 256) % 256;
      const a = (mixedA - b + 256) % 256;

      state[i] = a;
      state[i + 1] = b;
      state[i + 2] = c;
      state[i + 3] = d;
    }
  }

  addRoundKey(state, round) {
    for (let i = 0; i < 16; i++) {
      const roundKeyByte =
        (this.key[i] + round * 17 + i * 31) % 256;

      state[i] ^= roundKeyByte;
    }
  }
}

// ==================== RSA SIMPLIFIED (Educational Version) ====================

class RSASimplified {
  constructor(keySize = 512) {
    this.keySize = keySize;
    this.publicKey = null;
    this.privateKey = null;
    this.generateKeys();
  }

  isPrime(num) {
    if (num < 2) return false;
    if (num === 2) return true;
    if (num % 2 === 0) return false;

    for (let i = 3; i * i <= num; i += 2) {
      if (num % i === 0) {
        return false;
      }
    }

    return true;
  }

  getRandomPrime(min, max) {
    let candidate =
      Math.floor(Math.random() * (max - min + 1)) + min;

    if (candidate % 2 === 0) {
      candidate++;
    }

    for (let i = candidate; i <= max; i += 2) {
      if (this.isPrime(i)) {
        return i;
      }
    }

    for (let i = min; i < candidate; i += 2) {
      if (this.isPrime(i)) {
        return i;
      }
    }

    throw new Error("Gagal menemukan bilangan prima.");
  }

  generateKeys() {
    const p = this.getRandomPrime(1000, 2000);
    let q = this.getRandomPrime(2001, 3000);

    while (q === p) {
      q = this.getRandomPrime(2001, 3000);
    }

    const n = p * q;
    const phi = (p - 1) * (q - 1);

    let e = 65537;

    if (this.gcd(e, phi) !== 1) {
      e = 3;

      while (e < phi && this.gcd(e, phi) !== 1) {
        e += 2;
      }
    }

    const d = this.modInverse(e, phi);

    this.publicKey = { e, n };
    this.privateKey = { d, n };
  }

  gcd(a, b) {
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }

    return Math.abs(a);
  }

  modInverse(a, m) {
    let oldR = a;
    let r = m;
    let oldS = 1;
    let s = 0;

    while (r !== 0) {
      const quotient = Math.floor(oldR / r);

      const tempR = oldR - quotient * r;
      oldR = r;
      r = tempR;

      const tempS = oldS - quotient * s;
      oldS = s;
      s = tempS;
    }

    if (oldR !== 1) {
      throw new Error("Modular inverse tidak ditemukan.");
    }

    return ((oldS % m) + m) % m;
  }

  modPow(base, exponent, modulus) {
    let result = 1;
    let currentBase = base % modulus;
    let currentExponent = exponent;

    while (currentExponent > 0) {
      if (currentExponent % 2 === 1) {
        result = (result * currentBase) % modulus;
      }

      currentBase = (currentBase * currentBase) % modulus;
      currentExponent = Math.floor(currentExponent / 2);
    }

    return result;
  }

  encrypt(message) {
    if (!this.publicKey) {
      throw new Error("Public key RSA belum dibuat.");
    }

    const { e, n } = this.publicKey;
    const encrypted = [];

    for (const char of message.substring(0, 8)) {
      const messageCode = char.charCodeAt(0);

      if (messageCode >= n) {
        throw new Error("Karakter plaintext terlalu besar untuk modulus RSA.");
      }

      const cipherCode = this.modPow(messageCode, e, n);
      encrypted.push(cipherCode);
    }

    return encrypted;
  }

  decrypt(encrypted) {
    if (!this.privateKey) {
      throw new Error("Private key RSA belum dibuat.");
    }

    const { d, n } = this.privateKey;
    let decrypted = "";

    for (const cipherCode of encrypted) {
      const messageCode = this.modPow(cipherCode, d, n);
      decrypted += String.fromCharCode(messageCode);
    }

    return decrypted;
  }

  exportKeys() {
    return {
      public: JSON.stringify(this.publicKey, null, 2),
      private: JSON.stringify(this.privateKey, null, 2),
    };
  }
}

// ==================== XOR STREAM CIPHER ====================

class XORStreamCipher {
  constructor(key) {
    if (!key || typeof key !== "string") {
      throw new Error("Key XOR Stream tidak boleh kosong.");
    }

    this.key = key;
    this.keyStream = this.generateKeyStream(key);
  }

  generateKeyStream(key) {
    const stream = [];

    for (let i = 0; i < 10000; i++) {
      const baseChar = key.charCodeAt(i % key.length);
      const seed = (baseChar * (i + 1)) % 256;
      stream.push(seed ^ (i % 256));
    }

    return stream;
  }

  encrypt(plaintext) {
    let ciphertext = "";

    for (let i = 0; i < plaintext.length; i++) {
      const byte = plaintext.charCodeAt(i);
      const keyByte = this.keyStream[i % this.keyStream.length];
      ciphertext += String.fromCharCode((byte ^ keyByte) % 256);
    }

    return ciphertext;
  }

  decrypt(ciphertext) {
    return this.encrypt(ciphertext);
  }
}

// ==================== SUBSTITUTION CIPHER ENHANCED ====================

class SubstitutionCipherEnhanced {
  constructor(key) {
    if (!key || typeof key !== "string") {
      throw new Error("Key Advanced Substitution tidak boleh kosong.");
    }

    this.key = this.generateSubstitutionTable(key);
  }

  generateSubstitutionTable(seed) {
    const table = {};
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    const shuffled = chars.split("");

    for (let i = 0; i < seed.length; i++) {
      const charCode = seed.charCodeAt(i);

      for (let j = 0; j < shuffled.length; j++) {
        const swapIndex = (charCode + j + i) % shuffled.length;

        [shuffled[j], shuffled[swapIndex]] = [
          shuffled[swapIndex],
          shuffled[j],
        ];
      }
    }

    for (let i = 0; i < chars.length; i++) {
      table[chars[i]] = shuffled[i];
    }

    return table;
  }

  encrypt(plaintext) {
    let ciphertext = "";

    for (const char of plaintext) {
      ciphertext += this.key[char] || char;
    }

    return ciphertext;
  }

  decrypt(ciphertext) {
    const reverseTable = {};

    for (const originalChar in this.key) {
      reverseTable[this.key[originalChar]] = originalChar;
    }

    let plaintext = "";

    for (const char of ciphertext) {
      plaintext += reverseTable[char] || char;
    }

    return plaintext;
  }
}

// ==================== EXPORT ====================

const CryptoModern = {
  AES: AESSimplified,
  RSA: RSASimplified,
  XORStream: XORStreamCipher,
  Substitution: SubstitutionCipherEnhanced,
};

// Agar aman dipanggil dari file JavaScript lain
window.AESSimplified = AESSimplified;
window.RSASimplified = RSASimplified;
window.XORStreamCipher = XORStreamCipher;
window.SubstitutionCipherEnhanced = SubstitutionCipherEnhanced;
window.CryptoModern = CryptoModern;