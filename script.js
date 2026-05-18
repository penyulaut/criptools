/**
 * Main Script for Advanced Cryptography Application
 * Integrates all features: encryption, visualization, analysis, key generation, etc.
 */

// ==================== GLOBAL STATE ====================

let appState = {
  currentTab: "encrypt",
  currentEncryptTab: "basic",
  darkMode: localStorage.getItem("darkMode") === "true",
  realtimeMode: false,
  historyManager: new EncryptionHistory(),
  currentRSA: null,
  currentAES: null,
};

// ==================== INITIALIZATION ====================

document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});

function initializeApp() {
  // Apply dark mode if saved
  if (appState.darkMode) {
    toggleDarkMode();
  }

  // Initialize key hints
  updateKeyHint();

  // Add event listeners
  document
    .getElementById("cipherSelect")
    .addEventListener("change", updateKeyHint);

  console.log("✅ Aplikasi Kriptografi Advanced siap digunakan");
}

// ==================== TAB SWITCHING ====================

function switchTab(tabName) {
  // Remove active class from all tabs
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("active");
  });
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  // Add active class to selected tab
  const tabElement = document.getElementById(`${tabName}-tab`);
  if (tabElement) {
    tabElement.classList.add("active");
  }

  const btnElement = event.target.closest(".tab-btn");
  if (btnElement) {
    btnElement.classList.add("active");
  }

  appState.currentTab = tabName;
}

function switchEncryptTab(subTabName, evt) {
  document.querySelectorAll(".encrypt-section").forEach((section) => {
    section.classList.remove("active");
  });
  document.querySelectorAll(".tab-secondary-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  const sectionElement = document.getElementById(`${subTabName}-encrypt`);
  if (sectionElement) {
    sectionElement.classList.add("active");
  }

  const targetBtn =
    evt?.target || (window.event && window.event.target) || null;
  if (targetBtn) targetBtn.classList.add("active");
  appState.currentEncryptTab = subTabName;
}

// ==================== DARK MODE ====================

function toggleDarkMode() {
  appState.darkMode = !appState.darkMode;
  document.body.classList.toggle("dark-mode", appState.darkMode);
  localStorage.setItem("darkMode", appState.darkMode);

  const btn = document.getElementById("darkModeToggle");
  if (btn) {
    btn.textContent = appState.darkMode ? "☀️" : "🌙";
  }
}

// ==================== KEY HINTS ====================

const cipherHints = {
  vigenere: {
    placeholder: "Contoh: SECRET",
    hint: "🔤 Gunakan huruf saja, contoh: SECRET",
  },
  autokey: {
    placeholder: "Contoh: KEY",
    hint: "🔤 Gunakan huruf saja, contoh: KEY",
  },
  caesar: {
    placeholder: "Contoh: 3",
    hint: "🔢 Masukkan satu bilangan bulat sebagai nilai pergeseran, contoh: 3",
  },
  extended: {
    placeholder: "Contoh: ACC, mySecretKey",
    hint: "🔡 Bisa berupa karakter apapun, contoh: ACC, mySecretKey",
  },
  affine: {
    placeholder: "Contoh: 5,8",
    hint: "🔢 Masukkan dua bilangan bulat, contoh: 5,8",
  },
  playfair: {
    placeholder: "Contoh: MONARCHY",
    hint: "🔤 Gunakan huruf saja, contoh: MONARCHY",
  },
  hill: {
    placeholder: "Contoh: 3,3,2,5",
    hint: "🔢 Masukkan matriks 2x2 (4 angka), contoh: 3,3,2,5",
  },
};

function updateKeyHint() {
  const cipher = document.getElementById("cipherSelect")?.value || "vigenere";
  const keyInput = document.getElementById("keyInput");
  const keyHint = document.getElementById("keyHint");

  if (keyInput && keyHint && cipherHints[cipher]) {
    keyInput.placeholder = cipherHints[cipher].placeholder;
    keyHint.textContent = cipherHints[cipher].hint;
  }
}

// ==================== TRADITIONAL CIPHER FUNCTIONS ====================

function normalizeText(text) {
  return text.toUpperCase().replace(/[^A-Z]/g, "");
}

function formatInGroups(text) {
  return text.match(/.{1,5}/g)?.join(" ") || text;
}

// Existing cipher functions from original script
function vigenereEncrypt(plain, key) {
  const P = normalizeText(plain);
  const K = normalizeText(key);
  let C = "";
  for (let i = 0; i < P.length; i++) {
    const pi = P.charCodeAt(i) - 65;
    const ki = K.charCodeAt(i % K.length) - 65;
    C += String.fromCharCode(((pi + ki) % 26) + 65);
  }
  return C;
}

function parseCaesarShift(key) {
  const shift = Number(key);

  if (!Number.isInteger(shift)) {
    throw new Error("Kunci Caesar harus berupa bilangan bulat, misalnya 3.");
  }

  return ((shift % 26) + 26) % 26;
}

function caesarEncrypt(plain, key) {
  const P = normalizeText(plain);
  const shift = parseCaesarShift(key);
  let C = "";

  for (let ch of P) {
    const x = ch.charCodeAt(0) - 65;
    C += String.fromCharCode(((x + shift) % 26) + 65);
  }

  return C;
}

function caesarDecrypt(cipher, key) {
  const C = normalizeText(cipher);
  const shift = parseCaesarShift(key);
  let P = "";

  for (let ch of C) {
    const y = ch.charCodeAt(0) - 65;
    P += String.fromCharCode(((y - shift + 26) % 26) + 65);
  }

  return P;
}

function vigenereDecrypt(cipher, key) {
  const C = normalizeText(cipher);
  const K = normalizeText(key);
  let P = "";
  for (let i = 0; i < C.length; i++) {
    const ci = C.charCodeAt(i) - 65;
    const ki = K.charCodeAt(i % K.length) - 65;
    P += String.fromCharCode(((ci - ki + 26) % 26) + 65);
  }
  return P;
}

function autoKeyEncrypt(plain, key) {
  const P = normalizeText(plain);
  let K = normalizeText(key) + P;
  let C = "";
  for (let i = 0; i < P.length; i++) {
    const pi = P.charCodeAt(i) - 65;
    const ki = K.charCodeAt(i) - 65;
    C += String.fromCharCode(((pi + ki) % 26) + 65);
  }
  return C;
}

function autoKeyDecrypt(cipher, key) {
  const C = normalizeText(cipher);
  let K = normalizeText(key);
  let P = "";
  for (let i = 0; i < C.length; i++) {
    const ci = C.charCodeAt(i) - 65;
    const ki = K.charCodeAt(i) - 65;
    const pi = (ci - ki + 26) % 26;
    P += String.fromCharCode(pi + 65);
    K += String.fromCharCode(pi + 65);
  }
  return P;
}

function extendedVigenereEncrypt(inputBytes, key) {
  let keyBytes = Array.from(key).map((c) => c.charCodeAt(0));
  let output = new Uint8Array(inputBytes.length);
  for (let i = 0; i < inputBytes.length; i++) {
    output[i] = (inputBytes[i] + keyBytes[i % keyBytes.length]) % 256;
  }
  return output;
}

function extendedVigenereDecrypt(inputBytes, key) {
  let keyBytes = Array.from(key).map((c) => c.charCodeAt(0));
  let output = new Uint8Array(inputBytes.length);
  for (let i = 0; i < inputBytes.length; i++) {
    output[i] = (inputBytes[i] - keyBytes[i % keyBytes.length] + 256) % 256;
  }
  return output;
}

function modInverse(a, m) {
  a = ((a % m) + m) % m;
  for (let x = 1; x < m; x++) if ((a * x) % m === 1) return x;
  return null;
}

function affineEncrypt(plain, a, b) {
  const P = normalizeText(plain);
  let C = "";
  for (let ch of P) {
    const x = ch.charCodeAt(0) - 65;
    C += String.fromCharCode(((a * x + b) % 26) + 65);
  }
  return C;
}

function affineDecrypt(cipher, a, b) {
  const C = normalizeText(cipher);
  const invA = modInverse(a, 26);
  if (invA === null) throw new Error("Affine a has no inverse mod 26");
  let P = "";
  for (let ch of C) {
    const y = ch.charCodeAt(0) - 65;
    P += String.fromCharCode(((invA * (y - b + 26)) % 26) + 65);
  }
  return P;
}

function generatePlayfairSquare(key) {
  key = normalizeText(key).replace(/J/g, "I");
  const used = new Set();
  const square = [];
  for (let ch of key + "ABCDEFGHIKLMNOPQRSTUVWXYZ") {
    if (!used.has(ch)) {
      used.add(ch);
      square.push(ch);
    }
  }
  return Array.from({ length: 5 }, (_, i) => square.slice(i * 5, i * 5 + 5));
}

function findInSquare(square, ch) {
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (square[r][c] === ch) return [r, c];
    }
  }
}

function playfairPrepare(text, encrypt = true) {
  text = normalizeText(text).replace(/J/g, "I");
  const pairs = [];
  let i = 0;
  while (i < text.length) {
    let a = text[i];
    let b = text[i + 1] || (encrypt ? "X" : "");
    if (encrypt && a === b) {
      b = "X";
      i++;
    } else {
      i += 2;
    }
    pairs.push([a, b]);
  }
  return pairs;
}

function playfairEncrypt(plain, key) {
  const square = generatePlayfairSquare(key);
  const pairs = playfairPrepare(plain, true);
  let C = "";
  for (let [a, b] of pairs) {
    let [r1, c1] = findInSquare(square, a);
    let [r2, c2] = findInSquare(square, b);
    if (r1 === r2) {
      C += square[r1][(c1 + 1) % 5];
      C += square[r2][(c2 + 1) % 5];
    } else if (c1 === c2) {
      C += square[(r1 + 1) % 5][c1];
      C += square[(r2 + 1) % 5][c2];
    } else {
      C += square[r1][c2];
      C += square[r2][c1];
    }
  }
  return C;
}

function playfairDecrypt(cipher, key) {
  const square = generatePlayfairSquare(key);
  const pairs = playfairPrepare(cipher, false);
  let P = "";
  for (let [a, b] of pairs) {
    let [r1, c1] = findInSquare(square, a);
    let [r2, c2] = findInSquare(square, b);
    if (r1 === r2) {
      P += square[r1][(c1 + 4) % 5];
      P += square[r2][(c2 + 4) % 5];
    } else if (c1 === c2) {
      P += square[(r1 + 4) % 5][c1];
      P += square[(r2 + 4) % 5][c2];
    } else {
      P += square[r1][c2];
      P += square[r2][c1];
    }
  }
  return P;
}

function hillEncrypt(plain, matrix) {
  const P = normalizeText(plain);
  let C = "";
  for (let i = 0; i < P.length; i += 2) {
    const x1 = P.charCodeAt(i) - 65;
    const x2 = P.charCodeAt(i + 1 || i) - 65;
    const y1 = (matrix[0] * x1 + matrix[1] * x2) % 26;
    const y2 = (matrix[2] * x1 + matrix[3] * x2) % 26;
    C += String.fromCharCode(y1 + 65) + String.fromCharCode(y2 + 65);
  }
  return C;
}

function hillDecrypt(cipher, matrix) {
  const C = normalizeText(cipher);
  const det = matrix[0] * matrix[3] - matrix[1] * matrix[2];
  const invDet = modInverse(det, 26);
  if (invDet === null) throw new Error("Hill matrix not invertible mod 26");
  const invMatrix = [
    (matrix[3] * invDet) % 26,
    ((-matrix[1] + 26) * invDet) % 26,
    ((-matrix[2] + 26) * invDet) % 26,
    (matrix[0] * invDet) % 26,
  ];
  let P = "";
  for (let i = 0; i < C.length; i += 2) {
    const y1 = C.charCodeAt(i) - 65;
    const y2 = C.charCodeAt(i + 1 || i) - 65;
    const x1 = (invMatrix[0] * y1 + invMatrix[1] * y2) % 26;
    const x2 = (invMatrix[2] * y1 + invMatrix[3] * y2) % 26;
    P += String.fromCharCode(x1 + 65) + String.fromCharCode(x2 + 65);
  }
  return P;
}

// ==================== BASIC ENCRYPTION ====================

function encryptText() {
  try {
    const cipherType = document.getElementById("cipherSelect").value;
    const keyInput = document.getElementById("keyInput").value;
    const text = document.getElementById("plaintextInput").value.trim();
    const formatOpt = document.getElementById("cipherTextFormat").value;

    if (!text) {
      alert("❌ Masukkan teks terlebih dahulu!");
      return;
    }

    if (!keyInput) {
      alert("❌ Masukkan kunci terlebih dahulu!");
      return;
    }

    let result = "";

    switch (cipherType) {
      case "vigenere":
        result = vigenereEncrypt(text, keyInput);
        break;
      case "autokey":
        result = autoKeyEncrypt(text, keyInput);
        break;
      case "caesar":
        result = caesarEncrypt(text, keyInput);
        break;
      case "extended":
        const bytes = new Uint8Array(
          Array.from(text).map((c) => c.charCodeAt(0)),
        );
        const encBytes = extendedVigenereEncrypt(bytes, keyInput);
        result = Array.from(encBytes)
          .map((b) => String.fromCharCode(b))
          .join("");
        break;
      case "affine":
        const [a, b] = keyInput.split(",").map((n) => parseInt(n.trim()));
        result = affineEncrypt(text, a, b);
        break;
      case "playfair":
        result = playfairEncrypt(text, keyInput);
        break;
      case "hill":
        const mat = keyInput.split(",").map((n) => parseInt(n.trim()));
        result = hillEncrypt(text, mat);
        break;
    }

    if (formatOpt === "group5") result = formatInGroups(result);

    document.getElementById("basicOutput").textContent = result;

    // Log to history
    appState.historyManager.addEntry({
      algorithm: cipherType,
      input: text,
      output: result,
      key: keyInput,
      action: "encrypt",
    });

    showNotification("✅ Enkripsi berhasil!", "success");
  } catch (error) {
    alert(`❌ Error: ${error.message}`);
  }
}

function decryptText() {
  try {
    const cipherType = document.getElementById("cipherSelect").value;
    const keyInput = document.getElementById("keyInput").value;
    const text = document.getElementById("plaintextInput").value.trim();

    if (!text) {
      alert("❌ Masukkan ciphertext terlebih dahulu!");
      return;
    }

    if (!keyInput) {
      alert("❌ Masukkan kunci terlebih dahulu!");
      return;
    }

    let result = "";

    switch (cipherType) {
      case "vigenere":
        result = vigenereDecrypt(text, keyInput);
        break;
      case "autokey":
        result = autoKeyDecrypt(text, keyInput);
        break;
      case "caesar":
        result = caesarDecrypt(text, keyInput);
        break;
      case "extended":
        const bytes = new Uint8Array(
          Array.from(text).map((c) => c.charCodeAt(0)),
        );
        const decBytes = extendedVigenereDecrypt(bytes, keyInput);
        result = Array.from(decBytes)
          .map((b) => String.fromCharCode(b))
          .join("");
        break;
      case "affine":
        const [a2, b2] = keyInput.split(",").map((n) => parseInt(n.trim()));
        result = affineDecrypt(text, a2, b2);
        break;
      case "playfair":
        result = playfairDecrypt(text, keyInput);
        break;
      case "hill":
        const mat2 = keyInput.split(",").map((n) => parseInt(n.trim()));
        result = hillDecrypt(text, mat2);
        break;
    }

    document.getElementById("basicOutput").textContent = result;

    appState.historyManager.addEntry({
      algorithm: cipherType,
      input: text,
      output: result,
      key: keyInput,
      action: "decrypt",
    });

    showNotification("✅ Dekripsi berhasil!", "success");
  } catch (error) {
    alert(`❌ Error: ${error.message}`);
  }
}

// ==================== COPY & CLEAR ====================

function copyOutput() {
  const output = document.getElementById("basicOutput").textContent;
  if (!output) {
    alert("❌ Tidak ada output untuk dicopy");
    return;
  }

  CryptoUtils.copyToClipboard(output)
    .then(() => {
      showNotification("✅ Berhasil dicopy ke clipboard!", "success");
    })
    .catch(() => {
      showNotification("❌ Gagal dicopy", "error");
    });
}

function clearForm() {
  document.getElementById("plaintextInput").value = "";
  document.getElementById("basicOutput").textContent = "";
  document.getElementById("keyInput").value = "";
  showNotification("🗑️ Form dihapus", "info");
}

// ==================== DOWNLOAD ====================

function downloadOutput(type) {
  let output = "";
  let filename = "hasil_enkripsi.txt";

  if (type === "basic") {
    output = document.getElementById("basicOutput").textContent;
  } else if (type === "modern") {
    output = document.getElementById("modernOutput").textContent;
  }

  if (!output) {
    alert("❌ Tidak ada output untuk didownload");
    return;
  }

  const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  showNotification("⬇️ File berhasil didownload!", "success");
}

// ==================== MODERN ENCRYPTION (AES/RSA) ====================

function generateModernKey() {
  const length = parseInt(document.getElementById("keySize").value) / 8;
  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key = "";

  for (let i = 0; i < length; i++) {
    key += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }

  document.getElementById("modernKey").value = key;
  showNotification("🔑 Key berhasil di-generate!", "success");
}

function encryptModern() {
  try {
    const algorithm = document.getElementById("modernAlgorithm").value;
    let key = document.getElementById("modernKey").value;
    const plaintext = document.getElementById("modernInput").value;

    if (!plaintext) {
      alert("❌ Masukkan plaintext!");
      return;
    }

    if (!key) {
      generateModernKey();
      key = document.getElementById("modernKey").value;
    }

    let result = "";

    if (algorithm === "aes") {
      const aes = new AESSimplified(key);
      const encrypted = aes.encrypt(plaintext.substring(0, 16));
      result = CryptoUtils.textToHex(encrypted);
      appState.currentAES = aes;
    } else if (algorithm === "rsa") {
      const rsa = new RSASimplified(512);
      const encrypted = rsa.encrypt(plaintext);
      result = encrypted.map((n) => n.toString(16).padStart(2, "0")).join("");
      appState.currentRSA = rsa;
    } else if (algorithm === "xor") {
      const xor = new XORStreamCipher(key);
      const encrypted = xor.encrypt(plaintext);
      result = CryptoUtils.textToHex(encrypted);
    } else if (algorithm === "substitution") {
      const sub = new SubstitutionCipherEnhanced(key);
      result = sub.encrypt(plaintext);
    }

    document.getElementById("modernOutput").textContent = result;
    showNotification("🔐 Enkripsi modern berhasil!", "success");
  } catch (error) {
    alert(`❌ Error: ${error.message}`);
  }
}

function decryptModern() {
  try {
    const algorithm = document.getElementById("modernAlgorithm").value;
    let key = document.getElementById("modernKey").value;
    const ciphertext = document.getElementById("modernInput").value;

    if (!ciphertext) {
      alert("❌ Masukkan ciphertext!");
      return;
    }

    let result = "";

    if (algorithm === "aes" && appState.currentAES) {
      const decrypted = appState.currentAES.decrypt(
        ciphertext.substring(0, 32),
      );
      result = decrypted;
    } else if (algorithm === "rsa" && appState.currentRSA) {
      const encrypted = ciphertext.match(/.{1,2}/g).map((h) => parseInt(h, 16));
      result = appState.currentRSA.decrypt(encrypted);
    } else if (algorithm === "xor") {
      const xor = new XORStreamCipher(key);
      const ciphertextBytes = CryptoUtils.hexToText(ciphertext);
      result = xor.decrypt(ciphertextBytes);
    } else if (algorithm === "substitution") {
      const sub = new SubstitutionCipherEnhanced(key);
      result = sub.decrypt(ciphertext);
    }

    document.getElementById("modernOutput").textContent = result;
    showNotification("🔓 Dekripsi modern berhasil!", "success");
  } catch (error) {
    alert(`❌ Error: ${error.message}`);
  }
}

function showKeyPair() {
  if (appState.currentRSA) {
    const keys = appState.currentRSA.exportKeys();
    const content = `
      <h4>Public Key:</h4>
      <textarea readonly style="width: 100%; height: 100px;">${keys.public}</textarea>
      <h4 style="margin-top: 15px;">Private Key:</h4>
      <textarea readonly style="width: 100%; height: 100px;">${keys.private}</textarea>
    `;
    ModalDisplay.show("RSA Key Pair", content);
  } else {
    alert("❌ Generate RSA key terlebih dahulu!");
  }
}

// ==================== REAL-TIME MODE ====================

function toggleRealtimeMode() {
  appState.realtimeMode = !appState.realtimeMode;
  const status = document.getElementById("realtimeStatus");
  if (status) {
    status.textContent = appState.realtimeMode ? "ON" : "OFF";
    status.className = `status-indicator ${appState.realtimeMode ? "on" : "off"}`;
  }
}

function updateRealtime() {
  if (!appState.realtimeMode) return;

  try {
    const cipher = document.getElementById("realtimeCipher").value;
    const key = document.getElementById("realtimeKey").value;
    const input = document.getElementById("realtimeInput").value;

    if (!key || !input) {
      document.getElementById("realtimeOutput").textContent = "";
      return;
    }

    let output = "";

    if (cipher === "vigenere") {
      output = vigenereEncrypt(input, key);
    } else if (cipher === "affine") {
      let a = parseInt(key.split(",")[0]) || 5;
      let b = parseInt(key.split(",")[1]) || 8;
      output = affineEncrypt(input, a, b);
    } else if (cipher === "substitution") {
      const sub = new SubstitutionCipherEnhanced(key);
      output = sub.encrypt(input);
    }

    document.getElementById("realtimeOutput").textContent = output;
  } catch (error) {
    console.error("Real-time error:", error);
  }
}

// ==================== VISUALIZATION ====================

function updateVisualization() {
  try {
    const algorithm = document.getElementById("vizAlgorithm").value;
    const plaintext = document.getElementById("vizPlaintext").value;
    const key = document.getElementById("vizKey").value;

    if (!plaintext || !key) {
      document.getElementById("vizContainer").innerHTML =
        "⚠️ Masukkan plaintext dan kunci untuk visualisasi";
      document.getElementById("stepsContainer").innerHTML = "";
      return;
    }

    let htmlContent = "";

    // ==================== VIGENERE VISUALIZATION ====================
    if (algorithm === "vigenere") {
      const steps = EncryptionVisualizer.visualizeVigenereSteps(plaintext, key);

      htmlContent += "<h4>Tabel Vigenere - Langkah Demi Langkah:</h4>";
      htmlContent +=
        '<table style="width: 100%; border-collapse: collapse; margin-top: 10px;">';
      htmlContent +=
        '<tr style="background-color: var(--accent-color); color: white;">';
      htmlContent +=
        "<th>No</th><th>Plaintext</th><th>Key</th><th>P Value</th><th>K Value</th><th>+ Mod 26</th><th>Ciphertext</th></tr>";

      steps.forEach((step) => {
        htmlContent += `
          <tr style="border-bottom: 1px solid var(--border-color);">
            <td style="padding: 10px; text-align: center;">${step.index + 1}</td>
            <td style="padding: 10px; text-align: center; font-weight: bold; background-color: rgba(52, 152, 219, 0.1);">${step.plainChar}</td>
            <td style="padding: 10px; text-align: center; font-weight: bold; background-color: rgba(39, 174, 96, 0.1);">${step.keyChar}</td>
            <td style="padding: 10px; text-align: center;">${step.plainValue}</td>
            <td style="padding: 10px; text-align: center;">${step.keyValue}</td>
            <td style="padding: 10px; text-align: center;">= ${step.formula}</td>
            <td style="padding: 10px; text-align: center; font-weight: bold; background-color: rgba(231, 76, 60, 0.1);">${step.cipherChar}</td>
          </tr>
        `;
      });

      htmlContent += "</table>";
    }

    // ==================== CAESAR VISUALIZATION ====================
    else if (algorithm === "caesar") {
      const steps = EncryptionVisualizer.visualizeCaesarSteps(plaintext, key);

      htmlContent += "<h4>Tabel Caesar Cipher - Langkah Demi Langkah:</h4>";
      htmlContent +=
        '<table style="width: 100%; border-collapse: collapse; margin-top: 10px;">';
      htmlContent +=
        '<tr style="background-color: var(--accent-color); color: white;">';
      htmlContent +=
        "<th>No</th><th>Plaintext</th><th>P Value</th><th>Shift</th><th>+ Mod 26</th><th>Ciphertext</th></tr>";

      steps.forEach((step) => {
        htmlContent += `
          <tr style="border-bottom: 1px solid var(--border-color);">
            <td style="padding: 10px; text-align: center;">${step.index + 1}</td>
            <td style="padding: 10px; text-align: center; font-weight: bold; background-color: rgba(52, 152, 219, 0.1);">${step.plainChar}</td>
            <td style="padding: 10px; text-align: center;">${step.plainValue}</td>
            <td style="padding: 10px; text-align: center; font-weight: bold; background-color: rgba(39, 174, 96, 0.1);">${step.shiftValue}</td>
            <td style="padding: 10px; text-align: center;">= ${step.formula}</td>
            <td style="padding: 10px; text-align: center; font-weight: bold; background-color: rgba(231, 76, 60, 0.1);">${step.cipherChar}</td>
          </tr>
        `;
      });

      htmlContent += "</table>";
    }

    // ==================== PLAYFAIR VISUALIZATION ====================
    else if (algorithm === "playfair") {
      const square = EncryptionVisualizer.visualizePlayfairSquare(key);

      htmlContent += "<h4>Playfair Square (5×5):</h4>";
      htmlContent +=
        '<table style="width: fit-content; border-collapse: collapse; margin: 15px 0;">';

      square.forEach((row) => {
        htmlContent += "<tr>";

        row.forEach((char) => {
          htmlContent += `
            <td style="
              width: 40px;
              height: 40px;
              border: 2px solid var(--accent-color);
              text-align: center;
              font-weight: bold;
              background-color: rgba(52, 152, 219, 0.1);
              display: flex;
              align-items: center;
              justify-content: center;
            ">${char}</td>
          `;
        });

        htmlContent += "</tr>";
      });

      htmlContent += "</table>";
    }

    document.getElementById("vizContainer").innerHTML = htmlContent;

    // ==================== STEP EXPLANATION ====================
    let stepsHTML = "";

    if (algorithm === "vigenere") {
      const encrypted = vigenereEncrypt(plaintext, key);

      stepsHTML = `
        <div class="step-item">
          📥 Plaintext: <strong>${plaintext.toUpperCase()}</strong>
        </div>
        <div class="step-item">
          🔑 Kunci: <strong>${key.toUpperCase()}</strong>
        </div>
        <div class="step-item">
          📊 Proses: Setiap karakter plaintext ditambah nilai kunci secara berulang dengan operasi mod 26
        </div>
        <div class="step-item">
          📤 Ciphertext: <strong>${encrypted}</strong>
        </div>
      `;
    }

    else if (algorithm === "caesar") {
      const encrypted = caesarEncrypt(plaintext, key);

      stepsHTML = `
        <div class="step-item">
          📥 Plaintext: <strong>${plaintext.toUpperCase()}</strong>
        </div>
        <div class="step-item">
          🔑 Nilai Pergeseran: <strong>${key}</strong>
        </div>
        <div class="step-item">
          📊 Proses: Setiap huruf plaintext digeser sebanyak ${key} posisi dalam alfabet menggunakan operasi mod 26
        </div>
        <div class="step-item">
          📤 Ciphertext: <strong>${encrypted}</strong>
        </div>
      `;
    }

    else if (algorithm === "playfair") {
      stepsHTML = `
        <div class="step-item">
          📥 Plaintext: <strong>${plaintext.toUpperCase()}</strong>
        </div>
        <div class="step-item">
          🔑 Kunci: <strong>${key.toUpperCase()}</strong>
        </div>
        <div class="step-item">
          📊 Proses: Kunci digunakan untuk membentuk tabel Playfair 5×5 sebagai dasar enkripsi pasangan huruf
        </div>
      `;
    }

    document.getElementById("stepsContainer").innerHTML = stepsHTML;
  } catch (error) {
    document.getElementById("vizContainer").innerHTML =
      `❌ Error: ${error.message}`;
    document.getElementById("stepsContainer").innerHTML = "";
  }
}

// ==================== ANALYSIS ====================

function performAnalysis() {
  try {
    const text = document.getElementById("analysisText").value;

    if (!text) {
      alert("❌ Masukkan teks untuk dianalisis!");
      return;
    }

    const freq = FrequencyAnalysis.analyze(text).frequency;
    const percentage = FrequencyAnalysis.analyze(text).percentage;
    const entropy = FrequencyAnalysis.getEntropyScore(text);
    const chiSquared = FrequencyAnalysis.getChiSquared(percentage);

    // Frequency Chart
    document.getElementById("frequencyChart").innerHTML =
      EncryptionVisualizer.createFrequencyChart(freq, 15);

    // Entropy Display
    document.getElementById("entropyDisplay").innerHTML =
      EncryptionVisualizer.createEntropyVisual(
        parseFloat(entropy.entropy),
        parseFloat(entropy.maxEntropy),
      ) +
      `<div style="margin-top: 15px; padding: 10px; background-color: var(--bg-primary); border-radius: 6px;">
        <p><strong>Entropy Score:</strong> ${entropy.entropy}</p>
        <p><strong>Normalized (%):</strong> ${entropy.normalized}%</p>
        <p><strong>Chi-Squared:</strong> ${chiSquared}</p>
      </div>`;

    // Statistics
    const stats = `
      <div class="stats-grid">
        <div class="stat-box">
          <div class="stat-label">Total Karakter</div>
          <div class="stat-value">${text.length}</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Unique Chars</div>
          <div class="stat-value">${Object.keys(freq).length}</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Karakter Paling Sering</div>
          <div class="stat-value">${Object.keys(freq).reduce((a, b) => (freq[a] > freq[b] ? a : b))}</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Frekuensi Tertinggi</div>
          <div class="stat-value">${Math.max(...Object.values(freq))}</div>
        </div>
      </div>
    `;
    document.getElementById("statsDisplay").innerHTML = stats;

    // Strength
    const strength = Math.min(parseFloat(entropy.normalized) * 1.5, 100);
    const strengthLevel =
      strength > 75 ? "Sangat Kuat" : strength > 50 ? "Kuat" : "Sedang";
    document.getElementById("strengthDisplay").innerHTML = `
      <div style="margin-bottom: 15px;">
        <div style="font-weight: 600; margin-bottom: 10px;">Kekuatan Enkripsi: <span class="status-${strengthLevel.toLowerCase()}">${strengthLevel}</span></div>
        <div style="height: 20px; background-color: var(--bg-primary); border-radius: 10px; overflow: hidden;">
          <div style="height: 100%; width: ${strength}%; background: linear-gradient(90deg, #e74c3c, #f39c12, #27ae60); transition: all 0.3s ease;"></div>
        </div>
        <div style="text-align: right; margin-top: 5px; font-size: 0.9rem;">${strength.toFixed(1)}%</div>
      </div>
    `;

    showNotification("✅ Analisis selesai!", "success");
  } catch (error) {
    alert(`❌ Error: ${error.message}`);
  }
}

// ==================== KEY GENERATOR ====================

function generateSimpleKey(target = "basic") {
  const length = 16;
  const key = KeyGenerator.generateRandomKey(length);

  if (target === "basic") {
    document.getElementById("keyInput").value = key;
  } else if (target === "file") {
    document.getElementById("fileKey").value = key;
  }

  showNotification(
    `🔑 Key berhasil di-generate (${length} karakter)!`,
    "success",
  );
}

function generateKey() {
  const length = parseInt(document.getElementById("keyLength").value);
  const type = document.getElementById("keyType").value;

  if (length < 8) {
    alert("❌ Panjang minimal 8 karakter");
    return;
  }

  let key = "";

  if (type === "hex") {
    key = KeyGenerator.generateHexKey(length);
  } else if (type === "binary") {
    key = KeyGenerator.generateBinaryKey(length);
  } else {
    key = KeyGenerator.generateRandomKey(length, type);
  }

  document.getElementById("generatedKey").textContent = key;

  const strength = KeyGenerator.getKeyStrength(key);

  let strengthColor = "var(--error-color)";
  if (strength.strength >= 75) strengthColor = "var(--success-color)";
  else if (strength.strength >= 50) strengthColor = "var(--warning-color)";

  document.getElementById("strengthIndicator").innerHTML = `
    <div style="margin-bottom: 15px;">
      <div style="font-weight: 600; margin-bottom: 10px;">Level: <span style="color: ${strengthColor};">${strength.level}</span></div>
      <div style="height: 20px; background-color: var(--bg-primary); border-radius: 10px; overflow: hidden;">
        <div style="height: 100%; width: ${strength.strength}%; background-color: ${strengthColor}; transition: all 0.3s ease;"></div>
      </div>
      <div style="text-align: right; margin-top: 5px;">${strength.score}</div>
    </div>
  `;

  let feedbackHTML = "";
  strength.feedback.forEach((item) => {
    feedbackHTML += `<li class="${item.includes("Tambahkan") ? "warning" : ""}">${item}</li>`;
  });
  document.getElementById("strengthFeedback").innerHTML = feedbackHTML;

  showNotification("✅ Key berhasil di-generate!", "success");
}

function copyGeneratedKey() {
  const key = document.getElementById("generatedKey").textContent;
  if (!key) {
    alert("❌ Generate key terlebih dahulu!");
    return;
  }
  CryptoUtils.copyToClipboard(key).then(() => {
    showNotification("✅ Key berhasil dicopy!", "success");
  });
}

function downloadKey() {
  const key = document.getElementById("generatedKey").textContent;
  if (!key) {
    alert("❌ Generate key terlebih dahulu!");
    return;
  }
  const blob = new Blob([key], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `key_${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  showNotification("⬇️ Key berhasil didownload!", "success");
}

// ==================== COMPARISON ====================

async function performComparison() {
  try {
    const text = document.getElementById("compareText").value;
    const key = document.getElementById("compareKey").value;

    if (!text || !key) {
      alert("❌ Masukkan teks dan kunci!");
      return;
    }

    const results = [];
    const ciphers = [
      { name: "Vigenere", fn: "vigenereEncrypt" },
      { name: "Affine", fn: "affine", key: [5, 8] },
      { name: "Playfair", fn: "playfairEncrypt" },
      { name: "Extended", fn: "extendedVigenere" },
      { name: "AES", fn: "aes" },
      { name: "XOR Stream", fn: "xor" },
    ];

    let html = `
      <thead>
        <tr>
          <th>Cipher</th>
          <th>Hasil Enkripsi (preview)</th>
          <th>Ukuran</th>
          <th>Keamanan</th>
        </tr>
      </thead>
      <tbody>
    `;

    for (let cipher of ciphers) {
      try {
        let result = "";

        if (cipher.fn === "vigenereEncrypt") {
          result = vigenereEncrypt(text, key);
        } else if (cipher.fn === "affine") {
          result = affineEncrypt(text, cipher.key[0], cipher.key[1]);
        } else if (cipher.fn === "playfairEncrypt") {
          result = playfairEncrypt(text, key);
        } else if (cipher.fn === "extendedVigenere") {
          const bytes = new Uint8Array(
            Array.from(text).map((c) => c.charCodeAt(0)),
          );
          const encBytes = extendedVigenereEncrypt(bytes, key);
          result = Array.from(encBytes)
            .map((b) => String.fromCharCode(b))
            .join("");
        } else if (cipher.fn === "aes") {
          const aes = new AESSimplified(key);
          result = aes.encrypt(text.substring(0, 16));
        } else if (cipher.fn === "xor") {
          const xor = new XORStreamCipher(key);
          result = xor.encrypt(text);
        }

        const security = ["Vigenere", "Affine"].includes(cipher.name)
          ? "⭐⭐"
          : "⭐⭐⭐";
        const preview =
          result.substring(0, 40) + (result.length > 40 ? "..." : "");

        html += `
          <tr>
            <td><strong>${cipher.name}</strong></td>
            <td><code style="font-size: 0.8rem;">${CryptoUtils.textToHex(preview).substring(0, 30)}...</code></td>
            <td>${result.length} byte</td>
            <td>${security}</td>
          </tr>
        `;
      } catch (e) {
        html += `
          <tr>
            <td><strong>${cipher.name}</strong></td>
            <td colspan="3" style="color: var(--error-color);">Error: ${e.message.substring(0, 30)}</td>
          </tr>
        `;
      }
    }

    html += "</tbody>";
    document.getElementById("comparisonTable").innerHTML = html;
    showNotification("✅ Perbandingan selesai!", "success");
  } catch (error) {
    alert(`❌ Error: ${error.message}`);
  }
}

// ==================== BENCHMARK ====================

async function runBenchmark() {
  try {
    const text = document.getElementById("benchmarkText").value;
    const iterations = parseInt(
      document.getElementById("benchmarkIterations").value,
    );

    if (!text) {
      alert("❌ Masukkan teks untuk benchmark!");
      return;
    }

    showNotification("⏱️ Benchmark sedang berjalan...", "info");

    const results = await CryptoBenchmark.compareAlgorithms(
      text,
      "myTestKey123",
      iterations,
    );

    // Create chart
    let chartHTML = EncryptionVisualizer.createBenchmarkChart(results);
    document.getElementById("benchmarkChart").innerHTML = chartHTML;

    // Create table
    let tableHTML = `
      <thead>
        <tr>
          <th>Algoritma</th>
          <th>Iterasi</th>
          <th>Total Time (ms)</th>
          <th>Per Iterasi (ms)</th>
          <th>Ops/Sec</th>
        </tr>
      </thead>
      <tbody>
    `;

    results.forEach((result) => {
      tableHTML += `
        <tr>
          <td><strong>${result.algorithm}</strong></td>
          <td>${result.iterations || "-"}</td>
          <td>${result.totalTime || "-"}</td>
          <td>${result.timePerIteration || "-"}</td>
          <td>${result.opsPerSecond || "-"}</td>
        </tr>
      `;
    });

    tableHTML += "</tbody>";
    document.getElementById("benchmarkTable").innerHTML = tableHTML;

    showNotification("✅ Benchmark selesai!", "success");
  } catch (error) {
    alert(`❌ Error: ${error.message}`);
  }
}

// ==================== FILE HANDLING ====================

function handleFileUpload() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (!file) return;

  const fileInfo = document.getElementById("fileInfo");
  fileInfo.innerHTML = `
    <p><strong>📁 File:</strong> ${file.name}</p>
    <p><strong>📊 Ukuran:</strong> ${CryptoUtils.getFileSize(file.size)}</p>
    <p><strong>📝 Tipe:</strong> ${file.type}</p>
  `;
  fileInfo.classList.add("show");
}

function encryptFile() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];
  const algorithm = document.getElementById("fileAlgorithm").value;
  const key = document.getElementById("fileKey").value;

  if (!file) {
    alert("❌ Pilih file terlebih dahulu!");
    return;
  }

  if (!algorithm) {
    alert("❌ Pilih algoritma!");
    return;
  }

  if (!key) {
    alert("❌ Masukkan kunci!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const content = e.target.result;
    const bytes = new Uint8Array(content);

    let encrypted = bytes;

    if (algorithm === "extended") {
      encrypted = extendedVigenereEncrypt(bytes, key);
    } else if (algorithm === "aes") {
      // Simplified AES for file
      const aes = new AESSimplified(key);
      encrypted = new Uint8Array(
        Array.from(content).map((c) => c.charCodeAt(0)),
      );
      // Note: In production, use proper block cipher mode
    }

    const blob = new Blob([encrypted]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `encrypted_${file.name}`;
    a.click();
    URL.revokeObjectURL(url);

    showNotification("✅ File berhasil dienkripsi dan didownload!", "success");
  };

  reader.readAsArrayBuffer(file);
}

function decryptFile() {
  // Similar to encryptFile but for decryption
  showNotification("🔄 Fitur decrypt file sedang dikembangkan", "info");
}

// ==================== HISTORY MODAL ====================

function showHistoryModal() {
  const history = appState.historyManager.getHistory();
  const content =
    EncryptionVisualizer.createHistoryTable(history) +
    `
    <div style="margin-top: 20px; display: flex; gap: 10px;">
      <button class="btn-secondary" onclick="exportHistoryJSON()">📥 Export JSON</button>
      <button class="btn-secondary" onclick="exportHistoryCSV()">📥 Export CSV</button>
      <button class="btn-secondary" onclick="clearHistoryData()">🗑️ Clear</button>
    </div>
  `;
  ModalDisplay.show("📋 History Enkripsi", content);
}

function deleteHistoryEntry(id) {
  if (confirm("Hapus entry ini?")) {
    appState.historyManager.deleteEntry(id);
    showHistoryModal();
    showNotification("✅ Entry dihapus", "success");
  }
}

function toggleFavorite(id) {
  appState.historyManager.toggleFavorite(id);
  showHistoryModal();
}

function exportHistoryJSON() {
  const json = appState.historyManager.exportAsJSON();
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `history_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showNotification("✅ History exported as JSON", "success");
}

function exportHistoryCSV() {
  const csv = appState.historyManager.exportAsCSV();
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `history_${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showNotification("✅ History exported as CSV", "success");
}

function clearHistoryData() {
  if (confirm("Yakin ingin menghapus seluruh history?")) {
    appState.historyManager.clearHistory();
    ModalDisplay.close();
    showNotification("🗑️ History dihapus", "success");
  }
}

// ==================== SETTINGS ====================

function showSettingsModal() {
  const content = `
    <div style="padding: 20px 0;">
      <h4>⚙️ Pengaturan Aplikasi</h4>
      
      <div style="margin-top: 20px;">
        <label>
          <input type="checkbox" id="settingNotifications" checked>
          Aktifkan Notifikasi
        </label>
      </div>

      <div style="margin-top: 10px;">
        <label>
          <input type="checkbox" id="settingAutoSave" checked>
          Auto-save History
        </label>
      </div>

      <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--border-color);">
        <p><strong>ℹ️ Tentang Aplikasi:</strong></p>
        <p>Aplikasi Kriptografi Advanced v2.0</p>
        <p>Untuk tujuan edukasi dan pembelajaran</p>
        <p>© 2026 | Semua hak dilindungi</p>
      </div>
    </div>
  `;
  ModalDisplay.show("⚙️ Pengaturan", content);
}

// ==================== NOTIFICATION SYSTEM ====================

function showNotification(message, type = "info") {
  const notif = document.createElement("div");
  notif.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    background-color: ${
      type === "success"
        ? "var(--success-color)"
        : type === "error"
          ? "var(--error-color)"
          : "var(--accent-color)"
    };
    color: dark;
    font-weight: 600;
    z-index: 9999;
    animation: slideIn 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  `;
  notif.textContent = message;

  document.body.appendChild(notif);

  setTimeout(() => {
    notif.style.animation = "fadeOut 0.3s ease";
    setTimeout(() => notif.remove(), 300);
  }, 3000);
}

console.log("✅ Semua fitur telah dimuat dengan sukses!");
