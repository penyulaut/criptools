/**
 * Utility Functions for Cryptography Analysis and Helper Functions
 */

// ==================== FREQUENCY ANALYSIS ====================

class FrequencyAnalysis {
  static analyze(text) {
    const freq = {};
    const normalizedText = text.toUpperCase();

    for (let char of normalizedText) {
      if (/[A-Z0-9]/.test(char)) {
        freq[char] = (freq[char] || 0) + 1;
      }
    }

    const total = Object.values(freq).reduce((a, b) => a + b, 0);
    const percentage = {};

    for (let char in freq) {
      percentage[char] = ((freq[char] / total) * 100).toFixed(2);
    }

    return {
      frequency: freq,
      percentage: percentage,
      total: total,
    };
  }

  static getChiSquared(observed, expected) {
    const englishFreq = {
      E: 11.2,
      T: 8.2,
      A: 8.2,
      O: 7.5,
      I: 7.0,
      N: 6.7,
      S: 6.3,
      H: 6.1,
      R: 6.0,
      D: 4.3,
    };

    let chiSquared = 0;
    for (let char in observed) {
      const obs = parseFloat(observed[char]) || 0;
      const exp = englishFreq[char] || 0;
      if (exp > 0) {
        chiSquared += Math.pow(obs - exp, 2) / exp;
      }
    }

    return chiSquared.toFixed(2);
  }

  static getEntropyScore(text) {
    const freq = this.analyze(text).frequency;
    const total = Object.values(freq).reduce((a, b) => a + b, 0);
    let entropy = 0;

    for (let char in freq) {
      const p = freq[char] / total;
      entropy -= p * Math.log2(p);
    }

    return {
      entropy: entropy.toFixed(4),
      maxEntropy: Math.log2(36), // untuk 26 huruf + 10 angka
      normalized: ((entropy / Math.log2(36)) * 100).toFixed(2),
    };
  }
}

// ==================== KEY GENERATOR ====================

class KeyGenerator {
  static generateRandomKey(length = 16, type = "mixed") {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const special = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let charset = uppercase + lowercase;

    if (type === "numeric") {
      charset = numbers;
    } else if (type === "alphanumeric") {
      charset = uppercase + lowercase + numbers;
    } else if (type === "mixed") {
      charset = uppercase + lowercase + numbers;
    } else if (type === "strong") {
      charset = uppercase + lowercase + numbers + special;
    }

    let key = "";
    for (let i = 0; i < length; i++) {
      key += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    return key;
  }

  static generateHexKey(length = 16) {
    const hex = "0123456789ABCDEF";
    let key = "";
    for (let i = 0; i < length; i++) {
      key += hex.charAt(Math.floor(Math.random() * hex.length));
    }
    return key;
  }

  static generateBinaryKey(length = 128) {
    let key = "";
    for (let i = 0; i < length; i++) {
      key += Math.floor(Math.random() * 2);
    }
    return key;
  }

  static getKeyStrength(key) {
    let strength = 0;
    let feedback = [];

    if (key.length < 8) {
      feedback.push("Key terlalu pendek (minimal 8 karakter)");
    } else if (key.length < 12) {
      strength = 25;
      feedback.push("Key cukup pendek");
    } else if (key.length < 16) {
      strength = 50;
      feedback.push("Key memiliki panjang yang baik");
    } else {
      strength = 60;
    }

    if (/[a-z]/.test(key)) strength += 10;
    else feedback.push("Tambahkan huruf kecil");

    if (/[A-Z]/.test(key)) strength += 10;
    else feedback.push("Tambahkan huruf besar");

    if (/[0-9]/.test(key)) strength += 10;
    else feedback.push("Tambahkan angka");

    if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(key)) strength += 10;
    else feedback.push("Tambahkan karakter spesial untuk keamanan maksimal");

    strength = Math.min(strength, 100);

    let level = "Lemah";
    if (strength >= 75) level = "Sangat Kuat";
    else if (strength >= 50) level = "Kuat";
    else if (strength >= 30) level = "Sedang";

    return {
      strength: strength,
      level: level,
      feedback: feedback,
      score: `${strength}/100`,
    };
  }
}

// ==================== PERFORMANCE BENCHMARKING ====================

class CryptoBenchmark {
  static async measureEncryption(algorithm, plaintext, key, iterations = 1000) {
    const startTime = performance.now();

    for (let i = 0; i < iterations; i++) {
      try {
        if (algorithm === "aes") {
          const aes = new AESSimplified(key);
          aes.encrypt(plaintext.substring(0, 16));
        } else if (algorithm === "rsa") {
          const rsa = new RSASimplified(512);
          rsa.encrypt(plaintext.substring(0, 8));
        } else if (algorithm === "xor") {
          const xor = new XORStreamCipher(key);
          xor.encrypt(plaintext);
        } else if (algorithm === "vigenere") {
          vigenereEncrypt(plaintext, key);
        }
      } catch (e) {
        // Ignore errors during benchmark
      }
    }

    const endTime = performance.now();
    const totalTime = endTime - startTime;

    return {
      algorithm: algorithm,
      iterations: iterations,
      totalTime: totalTime.toFixed(2),
      timePerIteration: (totalTime / iterations).toFixed(4),
      opsPerSecond: ((iterations / totalTime) * 1000).toFixed(0),
    };
  }

  static async compareAlgorithms(plaintext, key, iterations = 1000) {
    const algorithms = ["vigenere", "aes", "xor", "rsa"];
    const results = [];

    for (let algo of algorithms) {
      try {
        const result = await this.measureEncryption(
          algo,
          plaintext,
          key,
          iterations,
        );
        results.push(result);
      } catch (e) {
        results.push({
          algorithm: algo,
          error: e.message,
        });
      }
    }

    return results;
  }
}

// ==================== HISTORY AND LOGGING ====================

class EncryptionHistory {
  constructor(maxItems = 100) {
    this.maxItems = maxItems;
    this.history = JSON.parse(localStorage.getItem("cryptoHistory") || "[]");
  }

  addEntry(entry) {
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toLocaleString("id-ID"),
      algorithm: entry.algorithm,
      inputLength: entry.input.length,
      outputLength: entry.output.length,
      keyLength: entry.key?.length || 0,
      action: entry.action, // 'encrypt' or 'decrypt'
      isFavorite: false,
      ...entry,
    };

    this.history.unshift(newEntry);

    if (this.history.length > this.maxItems) {
      this.history = this.history.slice(0, this.maxItems);
    }

    this.saveToStorage();
    return newEntry;
  }

  getHistory() {
    return this.history;
  }

  deleteEntry(id) {
    this.history = this.history.filter((entry) => entry.id !== id);
    this.saveToStorage();
  }

  toggleFavorite(id) {
    const entry = this.history.find((e) => e.id === id);
    if (entry) {
      entry.isFavorite = !entry.isFavorite;
      this.saveToStorage();
    }
  }

  exportAsJSON() {
    return JSON.stringify(this.history, null, 2);
  }

  exportAsCSV() {
    const headers = [
      "Timestamp",
      "Algorithm",
      "Action",
      "Input Length",
      "Output Length",
      "Key Length",
    ];
    const rows = this.history.map((entry) => [
      entry.timestamp,
      entry.algorithm,
      entry.action,
      entry.inputLength,
      entry.outputLength,
      entry.keyLength,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    return csv;
  }

  saveToStorage() {
    localStorage.setItem("cryptoHistory", JSON.stringify(this.history));
  }

  clearHistory() {
    this.history = [];
    this.saveToStorage();
  }
}

// ==================== HELPER FUNCTIONS ====================

class CryptoUtils {
  static textToHex(text) {
    let hex = "";
    for (let i = 0; i < text.length; i++) {
      hex += text.charCodeAt(i).toString(16).padStart(2, "0");
    }
    return hex;
  }

  static hexToText(hex) {
    let text = "";
    for (let i = 0; i < hex.length; i += 2) {
      text += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return text;
  }

  static textToBase64(text) {
    return btoa(unescape(encodeURIComponent(text)));
  }

  static base64ToText(base64) {
    return decodeURIComponent(escape(atob(base64)));
  }

  static copyToClipboard(text) {
    return navigator.clipboard.writeText(text);
  }

  static getFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  }

  static generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
  }
}

// ==================== EXPORT ====================

const Utilities = {
  FrequencyAnalysis: FrequencyAnalysis,
  KeyGenerator: KeyGenerator,
  CryptoBenchmark: CryptoBenchmark,
  EncryptionHistory: EncryptionHistory,
  CryptoUtils: CryptoUtils,
};
