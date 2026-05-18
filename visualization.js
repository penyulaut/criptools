/**
 * Visualization Functions for Encryption Process and Analysis
 */

class EncryptionVisualizer {
  static visualizeVigenereSteps(plaintext, key) {
    const normalized = plaintext.toUpperCase().replace(/[^A-Z]/g, "");
    const keyNorm = key.toUpperCase().replace(/[^A-Z]/g, "");
    const steps = [];

    for (let i = 0; i < Math.min(normalized.length, 10); i++) {
      const pChar = normalized[i];
      const kChar = keyNorm[i % keyNorm.length];
      const pVal = pChar.charCodeAt(0) - 65;
      const kVal = kChar.charCodeAt(0) - 65;
      const cVal = (pVal + kVal) % 26;
      const cChar = String.fromCharCode(cVal + 65);

      steps.push({
        index: i,
        plainChar: pChar,
        keyChar: kChar,
        plainValue: pVal,
        keyValue: kVal,
        cipherValue: cVal,
        cipherChar: cChar,
        formula: `(${pVal} + ${kVal}) mod 26 = ${cVal}`,
      });
    }

    return steps;
  }

  static visualizeCaesarSteps(plaintext, shiftKey) {
    const normalized = plaintext.toUpperCase().replace(/[^A-Z]/g, "");
    const shift = ((parseInt(shiftKey) % 26) + 26) % 26;
    const steps = [];

    for (let i = 0; i < Math.min(normalized.length, 10); i++) {
      const pChar = normalized[i];
      const pVal = pChar.charCodeAt(0) - 65;
      const cVal = (pVal + shift) % 26;
      const cChar = String.fromCharCode(cVal + 65);

      steps.push({
        index: i,
        plainChar: pChar,
        shiftValue: shift,
        plainValue: pVal,
        cipherValue: cVal,
        cipherChar: cChar,
        formula: `(${pVal} + ${shift}) mod 26 = ${cVal}`,
      });
    }

    return steps;
  }

  static visualizePlayfairSquare(key) {
    const keyNorm = key
      .toUpperCase()
      .replace(/J/g, "I")
      .replace(/[^A-Z]/g, "");
    const used = new Set();
    const square = [];

    for (let ch of keyNorm + "ABCDEFGHIKLMNOPQRSTUVWXYZ") {
      if (!used.has(ch)) {
        used.add(ch);
        square.push(ch);
      }
    }

    const grid = [];
    for (let i = 0; i < 5; i++) {
      grid.push(square.slice(i * 5, i * 5 + 5));
    }

    return grid;
  }

  static highlightCharacter(text, index) {
    let highlighted = "";
    for (let i = 0; i < text.length; i++) {
      if (i === index) {
        highlighted += `<span class="highlight">${text[i]}</span>`;
      } else {
        highlighted += text[i];
      }
    }
    return highlighted;
  }

  static createFrequencyChart(frequency, maxChars = 10) {
    const sorted = Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxChars);

    const maxFreq = Math.max(...sorted.map(([_, freq]) => freq));

    let html = '<div class="frequency-chart">';
    for (let [char, freq] of sorted) {
      const percentage = (freq / maxFreq) * 100;
      const barWidth = Math.max(percentage, 5);

      html += `
        <div class="bar-item">
          <div class="char-label">${char}</div>
          <div class="bar-container">
            <div class="bar" style="width: ${barWidth}%">
              <span class="bar-value">${freq}</span>
            </div>
          </div>
        </div>
      `;
    }
    html += "</div>";

    return html;
  }

  static createEntropyVisual(entropy, maxEntropy) {
    const percentage = (entropy / maxEntropy) * 100;
    const color =
      percentage > 75 ? "#27ae60" : percentage > 50 ? "#f39c12" : "#e74c3c";

    return `
      <div class="entropy-visual">
        <div class="entropy-meter">
          <div class="entropy-fill" style="width: ${percentage}%; background-color: ${color};"></div>
        </div>
        <div class="entropy-info">
          <span class="entropy-value">${entropy.toFixed(2)}</span>
          <span class="entropy-max">/ ${maxEntropy.toFixed(2)}</span>
        </div>
      </div>
    `;
  }

  static animateEncryption(plaintext, ciphertext, duration = 2000) {
    const steps = [];
    const stepDuration =
      duration / Math.max(plaintext.length, ciphertext.length);

    for (let i = 0; i < Math.max(plaintext.length, ciphertext.length); i++) {
      steps.push({
        time: i * stepDuration,
        plainIndex: i,
        cipherIndex: i,
        plainShown: plaintext.substring(0, i),
        cipherShown: ciphertext.substring(0, i),
      });
    }

    return steps;
  }

  static createProcessTimeline(steps) {
    let html = '<div class="process-timeline">';

    steps.forEach((step, index) => {
      html += `
        <div class="timeline-item" style="animation-delay: ${index * 0.1}s">
          <div class="timeline-marker">${index + 1}</div>
          <div class="timeline-content">
            ${typeof step === "string" ? step : JSON.stringify(step)}
          </div>
        </div>
      `;
    });

    html += "</div>";
    return html;
  }

  static createKeyVisualization(key, type = "string") {
    let html = '<div class="key-visualization">';

    if (type === "string") {
      for (let i = 0; i < key.length; i++) {
        const charCode = key.charCodeAt(i);
        const hue = (charCode * 137.5) % 360;
        html += `
          <div class="key-byte" style="background-color: hsl(${hue}, 80%, 50%);" title="${key[i]} (${charCode})">
            ${key[i]}
          </div>
        `;
      }
    } else if (type === "hex") {
      const bytes = key.match(/.{1,2}/g) || [];
      for (let byte of bytes) {
        const val = parseInt(byte, 16);
        const hue = (val * 1.41) % 360;
        html += `
          <div class="key-byte" style="background-color: hsl(${hue}, 80%, 50%);" title="${byte} (${val})">
            ${byte}
          </div>
        `;
      }
    }

    html += "</div>";
    return html;
  }

  static createBenchmarkChart(results) {
    const colors = ["#3498db", "#e74c3c", "#f39c12", "#27ae60"];
    let html = '<div class="benchmark-chart">';

    const maxOps = Math.max(
      ...results.map((r) => parseInt(r.opsPerSecond) || 0),
    );

    results.forEach((result, index) => {
      const opsPerSec = parseInt(result.opsPerSecond) || 0;
      const percentage = (opsPerSec / maxOps) * 100;

      html += `
        <div class="benchmark-bar">
          <div class="bar-label">${result.algorithm}</div>
          <div class="bar-chart">
            <div class="bar-fill" style="width: ${percentage}%; background-color: ${colors[index]};">
              <span class="bar-text">${result.opsPerSecond} ops/s</span>
            </div>
          </div>
          <div class="bar-detail">${result.timePerIteration}ms/iter</div>
        </div>
      `;
    });

    html += "</div>";
    return html;
  }

  static createHistoryTable(history) {
    if (history.length === 0) {
      return '<p class="no-data">Belum ada history</p>';
    }

    let html = `
      <table class="history-table">
        <thead>
          <tr>
            <th>⭐</th>
            <th>Waktu</th>
            <th>Algoritma</th>
            <th>Aksi</th>
            <th>Input</th>
            <th>Output</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
    `;

    history.slice(0, 20).forEach((entry) => {
      const starClass = entry.isFavorite ? "favorite" : "";
      html += `
        <tr>
          <td><button class="star-btn ${starClass}" data-id="${entry.id}" onclick="toggleFavorite(${entry.id})">★</button></td>
          <td>${entry.timestamp}</td>
          <td>${entry.algorithm}</td>
          <td>${entry.action}</td>
          <td>${entry.inputLength}</td>
          <td>${entry.outputLength}</td>
          <td><button class="delete-btn" onclick="deleteHistoryEntry(${entry.id})">🗑️</button></td>
        </tr>
      `;
    });

    html += "</tbody></table>";
    return html;
  }

  static createComparisonTable(results) {
    let html = `
      <table class="comparison-table">
        <thead>
          <tr>
            <th>Algoritma</th>
            <th>Enkripsi</th>
            <th>Dekripsi</th>
            <th>Kecepatan</th>
            <th>Keamanan</th>
          </tr>
        </thead>
        <tbody>
    `;

    const algorithmInfo = {
      vigenere: { speed: "⚡⚡⚡", security: "★★☆", encDec: "Ya" },
      caesar: { speed: "⚡⚡⚡", security: "★☆☆", encDec: "Ya" },
      affine: { speed: "⚡⚡⚡", security: "★★☆", encDec: "Ya" },
      playfair: { speed: "⚡⚡☆", security: "★★★", encDec: "Ya" },
      hill: { speed: "⚡⚡☆", security: "★★★", encDec: "Ya" },
      aes: { speed: "⚡⚡", security: "★★★★★", encDec: "Ya" },
      rsa: { speed: "⚡", security: "★★★★★", encDec: "Ya" },
    };

    for (let cipher in algorithmInfo) {
      const info = algorithmInfo[cipher];
      html += `
        <tr>
          <td>${cipher.toUpperCase()}</td>
          <td>${info.encDec}</td>
          <td>${info.encDec}</td>
          <td>${info.speed}</td>
          <td>${info.security}</td>
        </tr>
      `;
    }

    html += "</tbody></table>";
    return html;
  }
}

// ==================== MODAL DISPLAY HELPER ====================

class ModalDisplay {
  static show(title, content, type = "info") {
    let modal = document.getElementById("customModal");

    if (!modal) {
      modal = document.createElement("div");
      modal.id = "customModal";
      modal.className = "custom-modal";
      modal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h3 id="modalTitle"></h3>
            <button class="modal-close" onclick="document.getElementById('customModal').style.display='none'">&times;</button>
          </div>
          <div id="modalBody" class="modal-body"></div>
          <div class="modal-footer">
            <button class="btn-primary" onclick="document.getElementById('customModal').style.display='none'">Tutup</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    document.getElementById("modalTitle").textContent = title;
    document.getElementById("modalBody").innerHTML = content;
    modal.className = `custom-modal modal-${type}`;
    modal.style.display = "flex";
  }

  static close() {
    const modal = document.getElementById("customModal");
    if (modal) modal.style.display = "none";
  }
}

// ==================== EXPORT ====================

const Visualization = {
  EncryptionVisualizer: EncryptionVisualizer,
  ModalDisplay: ModalDisplay,
};

// Agar bisa dipanggil dari file JS lain
window.EncryptionVisualizer = EncryptionVisualizer;
window.ModalDisplay = ModalDisplay;