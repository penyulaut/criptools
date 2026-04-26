/**
 * Modern Cryptography Algorithms (AES-like, RSA-like, dan enhancement cipher)
 * File ini berisi implementasi algoritma kriptografi modern dalam JavaScript
 */

// ==================== AES SIMPLIFIED (Educational Version) ====================

class AESSimplified {
  constructor(key) {
    this.key = this.expandKey(key);
  }

  expandKey(key) {
    // Simplified key expansion untuk educational purposes
    while (key.length < 16) {
      key += key.substring(0, 16 - key.length);
    }
    return key
      .substring(0, 16)
      .split("")
      .map((c) => c.charCodeAt(0));
  }

  encrypt(text) {
    const state = this.stringToState(text);
    for (let round = 0; round < 10; round++) {
      this.subBytes(state);
      this.shiftRows(state);
      if (round < 9) this.mixColumns(state);
      this.addRoundKey(state, round);
    }
    return this.stateToString(state);
  }

  decrypt(ciphertext) {
    const state = this.stringToState(ciphertext);
    for (let round = 9; round >= 0; round--) {
      this.addRoundKey(state, round);
      if (round < 9) this.invMixColumns(state);
      this.invShiftRows(state);
      this.invSubBytes(state);
    }
    return this.stateToString(state);
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
    return state.map((b) => String.fromCharCode(b)).join("");
  }

  subBytes(state) {
    const sbox = [
      0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b,
      0xfe, 0xd7, 0xab, 0x76, 0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0,
      0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
    ];
    for (let i = 0; i < state.length; i++) {
      state[i] = sbox[state[i] % 32];
    }
  }

  invSubBytes(state) {
    const invSbox = [
      0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e,
      0x81, 0xf3, 0xd7, 0xfb, 0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87,
      0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb,
    ];
    for (let i = 0; i < state.length; i++) {
      state[i] = invSbox[state[i] % 32];
    }
  }

  shiftRows(state) {
    let temp = state[1];
    state[1] = state[5];
    state[5] = state[9];
    state[9] = state[13];
    state[13] = temp;

    [state[2], state[6], state[10], state[14]] = [
      state[6],
      state[10],
      state[14],
      state[2],
    ];
    [state[3], state[7], state[11], state[15]] = [
      state[7],
      state[11],
      state[15],
      state[3],
    ];
  }

  invShiftRows(state) {
    let temp = state[1];
    state[1] = state[13];
    state[13] = state[9];
    state[9] = state[5];
    state[5] = temp;

    [state[2], state[10], state[6], state[14]] = [
      state[6],
      state[10],
      state[14],
      state[2],
    ];
    [state[3], state[11], state[7], state[15]] = [
      state[7],
      state[11],
      state[15],
      state[3],
    ];
  }

  mixColumns(state) {
    for (let i = 0; i < 16; i += 4) {
      const [a, b, c, d] = [state[i], state[i + 1], state[i + 2], state[i + 3]];
      state[i] = (a * 2 + b + c + d) % 256;
      state[i + 1] = (a + b * 2 + c + d) % 256;
      state[i + 2] = (a + b + c * 2 + d) % 256;
      state[i + 3] = (a + b + c + d * 2) % 256;
    }
  }

  invMixColumns(state) {
    for (let i = 0; i < 16; i += 4) {
      const [a, b, c, d] = [state[i], state[i + 1], state[i + 2], state[i + 3]];
      state[i] = (9 * a + 14 * b + 11 * c + 13 * d) % 256;
      state[i + 1] = (13 * a + 9 * b + 14 * c + 11 * d) % 256;
      state[i + 2] = (11 * a + 13 * b + 9 * c + 14 * d) % 256;
      state[i + 3] = (14 * a + 11 * b + 13 * c + 9 * d) % 256;
    }
  }

  addRoundKey(state, round) {
    for (let i = 0; i < 16; i++) {
      state[i] ^= this.key[(round * 16 + i) % this.key.length];
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

  // Simple prime check
  isPrime(num) {
    if (num < 2) return false;
    if (num === 2) return true;
    if (num % 2 === 0) return false;
    for (let i = 3; i * i <= num; i += 2) {
      if (num % i === 0) return false;
    }
    return true;
  }

  // Get random prime
  getRandomPrime(min, max) {
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    for (let i = randomNum; i <= max; i++) {
      if (this.isPrime(i)) return i;
    }
    return 2;
  }

  // Generate keys
  generateKeys() {
    const p = this.getRandomPrime(1000, 2000);
    const q = this.getRandomPrime(2001, 3000);
    const n = p * q;
    const phi = (p - 1) * (q - 1);

    let e = 2;
    while (e < phi && this.gcd(e, phi) !== 1) {
      e++;
    }

    const d = this.modInverse(e, phi);

    this.publicKey = { e, n };
    this.privateKey = { d, n };
  }

  // GCD
  gcd(a, b) {
    return b === 0 ? a : this.gcd(b, a % b);
  }

  // Modular inverse
  modInverse(a, m) {
    const [old_r, r] = [a, m];
    const [old_s, s] = [1, 0];

    while (r !== 0) {
      const quotient = Math.floor(old_r / r);
      const [newR, newS] = [old_r - quotient * r, old_s - quotient * s];
      [old_r, r] = [r, newR];
      [old_s, s] = [s, newS];
    }

    return old_s < 0 ? old_s + m : old_s;
  }

  // Encrypt
  encrypt(message) {
    if (!this.publicKey) throw new Error("Public key not generated");
    const { e, n } = this.publicKey;
    const encrypted = [];

    for (let char of message.substring(0, 8)) {
      const m = char.charCodeAt(0);
      const c = Math.pow(m, e) % n;
      encrypted.push(c);
    }

    return encrypted;
  }

  // Decrypt
  decrypt(encrypted) {
    if (!this.privateKey) throw new Error("Private key not generated");
    const { d, n } = this.privateKey;
    let decrypted = "";

    for (let c of encrypted) {
      const m = Math.pow(c, d) % n;
      decrypted += String.fromCharCode(m);
    }

    return decrypted;
  }

  // Export keys
  exportKeys() {
    return {
      public: JSON.stringify(this.publicKey),
      private: JSON.stringify(this.privateKey),
    };
  }
}

// ==================== XOR CIPHER WITH STREAM ====================

class XORStreamCipher {
  constructor(key) {
    this.key = key;
    this.keyStream = this.generateKeyStream(key);
  }

  generateKeyStream(key) {
    const stream = [];
    for (let i = 0; i < 10000; i++) {
      const seed = (key.charCodeAt(i % key.length) * (i + 1)) % 256;
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
    return this.encrypt(ciphertext); // XOR is symmetric
  }
}

// ==================== SUBSTITUTION CIPHER ENHANCED ====================

class SubstitutionCipherEnhanced {
  constructor(key) {
    this.key = this.generateSubstitutionTable(key);
  }

  generateSubstitutionTable(seed) {
    const table = {};
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let shuffled = chars.split("");

    // Shuffle berdasarkan seed
    for (let i = 0; i < seed.length; i++) {
      const charCode = seed.charCodeAt(i);
      for (let j = 0; j < shuffled.length; j++) {
        const k = (charCode + j) % shuffled.length;
        [shuffled[j], shuffled[k]] = [shuffled[k], shuffled[j]];
      }
    }

    for (let i = 0; i < chars.length; i++) {
      table[chars[i]] = shuffled[i];
    }

    return table;
  }

  encrypt(plaintext) {
    let ciphertext = "";
    for (let char of plaintext) {
      ciphertext += this.key[char] || char;
    }
    return ciphertext;
  }

  decrypt(ciphertext) {
    const reverseTable = {};
    for (let key in this.key) {
      reverseTable[this.key[key]] = key;
    }

    let plaintext = "";
    for (let char of ciphertext) {
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
