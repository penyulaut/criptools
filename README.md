# 🔐 Aplikasi Kriptografi Advanced v2.0

Aplikasi enkripsi dan dekripsi multi-cipher yang canggih dengan fitur analisis keamanan, visualisasi, benchmarking, dan banyak lagi.

## ✨ Fitur Utama

### 1. **Enkripsi/Dekripsi Tradisional**

- Vigenere Standard
- Auto-Key Vigenere
- Extended Vigenere
- Affine Cipher
- Playfair Cipher
- Hill Cipher (2x2)

### 2. **Enkripsi Modern** ⭐

- **AES (Simplified)** - Advanced Encryption Standard
- **RSA (Simplified)** - Public Key Encryption
- **XOR Stream Cipher** - Stream-based encryption
- **Advanced Substitution** - Enhanced substitution cipher

### 3. **Visualisasi Proses**

- Visualisasi langkah-demi-langkah Vigenere cipher
- Tabel Playfair interaktif
- Tampilan transformasi karakter
- Highlighting proses enkripsi

### 4. **Analisis Keamanan**

- Frequency Analysis - Analisis distribusi huruf
- Entropy Score - Perhitungan entropi
- Chi-Squared Test - Uji kekuatan enkripsi
- Grafik distribusi visual

### 5. **Key Generator**

- Generate kunci random dengan berbagai tipe
- Indikator kekuatan kunci (Weak/Medium/Strong)
- Saran perbaikan kunci
- Support: Alphanumeric, Numeric, Hexadecimal, Binary

### 6. **Mode Real-Time**

- Enkripsi langsung saat mengetik
- Toggle ON/OFF untuk real-time mode
- Hasil instant tanpa klik tombol

### 7. **Perbandingan Cipher**

- Bandingkan hasil enkripsi berbagai cipher
- Analisis kecepatan dan kompleksitas
- Tabel perbandingan interaktif

### 8. **Benchmarking**

- Pengukuran performa enkripsi
- Perbandingan kecepatan antar algoritma
- Operasi per detik (Ops/Sec)
- Visualisasi grafik performa

### 9. **Upload & Download File**

- Enkripsi file .txt, .pdf, .doc, dll
- Dekripsi file terenkripsi
- Support berbagai format
- Direct download hasil

### 10. **History & Logging**

- Simpan riwayat enkripsi/dekripsi
- Timestamp otomatis
- Export ke JSON/CSV
- Search dan filter history
- Favorite entries

### 11. **Dark Mode**

- Toggle Dark/Light mode
- Tema otomatis tersimpan
- UI responsif untuk semua ukuran

### 12. **UI/UX Modern**

- Desain responsif dan modern
- Smooth transitions dan animations
- Tooltip explanations
- Copy to clipboard buttons
- Real-time notifications

## 📁 Struktur File

```
/Kriptografi/
├── index.html                    # Struktur HTML utama (v2.0)
├── style.css                     # Styling & Dark Mode (v2.0)
├── script.js                     # Main script (PERLU UPDATE ke script-new.js)
├── crypto-algorithms.js          # Algoritma kriptografi modern (NEW)
├── utils.js                      # Utility functions (NEW)
├── visualization.js              # Visualization functions (NEW)
├── README.md                     # Dokumentasi ini
└── script-new.js                 # NEW: Script utama yang diperbarui
```

## 🚀 Setup & Instalasi

### Langkah 1: Update script.js (PENTING!)

File script.js masih menggunakan versi lama. Anda perlu mengganti dengan script-new.js:

**Opsi A: Menggunakan Terminal (Windows)**

```bash
cd "D:\My project\Kriptografi"
move /Y script-new.js script.js
```

**Opsi B: Menggunakan Terminal (Linux/Mac)**

```bash
cd "/path/to/Kriptografi"
mv script-new.js script.js
```

**Opsi C: Manual**

1. Buka `script-new.js` di text editor
2. Copy seluruh konten
3. Paste ke `script.js` (replace semua)
4. Save

### Langkah 2: Buka aplikasi di browser

```
Buka file index.html di browser favorit Anda
```

## 💻 Penggunaan

### Enkripsi Dasar

1. Buka tab "Enkripsi/Dekripsi"
2. Pilih cipher dari dropdown
3. Masukkan kunci
4. Masukkan plaintext
5. Klik "Encrypt"

### Enkripsi Modern (AES/RSA)

1. Buka tab "Enkripsi/Dekripsi" → tab "Modern (AES/RSA)"
2. Pilih algoritma (AES, RSA, XOR, Substitution)
3. Generate key atau masukkan key manual
4. Masukkan plaintext
5. Klik "Encrypt (Modern)"

### Visualisasi

1. Buka tab "Visualisasi"
2. Pilih algoritma
3. Masukkan plaintext dan kunci
4. Lihat visualisasi langkah-demi-langkah

### Analisis Keamanan

1. Buka tab "Analisis Keamanan"
2. Paste ciphertext
3. Klik "Analisis"
4. Lihat grafik distribusi, entropi, dan kekuatan enkripsi

### Generate Key

1. Buka tab "Key Generator"
2. Set panjang kunci
3. Pilih tipe kunci
4. Klik "Generate Key"
5. Copy atau download key

### Real-Time Mode

1. Buka tab "Enkripsi" → tab "Real-Time"
2. Aktifkan toggle
3. Pilih cipher dan masukkan kunci
4. Mulai mengetik - hasil update secara real-time

### Benchmark

1. Buka tab "Benchmark"
2. Masukkan teks (atau gunakan default)
3. Set jumlah iterasi
4. Klik "Jalankan Benchmark"
5. Lihat perbandingan performa

### History

1. Klik tombol "📋 History" di header
2. Lihat daftar enkripsi/dekripsi
3. Bisa export ke JSON/CSV
4. Atau clear semua history

## 🔧 Konfigurasi

### Dark Mode

- Klik tombol "🌙" di header untuk toggle dark mode
- Preferensi tersimpan otomatis di localStorage

### Pengaturan

- Klik tombol "⚙️" di header
- Aktifkan/non-aktifkan notifikasi
- Toggle auto-save history

## 📊 Dari Algoritma

### Algoritma Tradisional

- **Vigenere**: Polyalphabetic substitution cipher
- **Affine**: Mathematical substitution cipher ax+b mod 26
- **Playfair**: Digraph substitution cipher
- **Hill**: Matrix-based cipher
- **Extended Vigenere**: Byte-wise Vigenere

### Algoritma Modern

- **AES**: Advanced Encryption Standard (Simplified version)
- **RSA**: Rivest-Shamir-Adleman (Public key cryptography)
- **XOR**: Stream cipher berbasis XOR
- **Substitution**: Advanced substitution dengan shuffling

## 📈 Analisis

### Frequency Analysis

Analisis frekuensi karakter dalam ciphertext untuk mengidentifikasi pola.

### Entropy

Mengukur tingkat randomness/keacakan dari ciphertext. Nilai lebih tinggi = enkripsi lebih kuat.

### Chi-Squared Test

Membandingkan distribusi karakter dengan distribusi Bahasa Inggris untuk estimasi kekuatan.

## ⚕️ Fitur Keamanan

1. **Local Storage**: Semua data disimpan di browser, tidak dikirim ke server
2. **Client-Side**: Semua enkripsi terjadi di client, bukan di server
3. **Key Strength Indicator**: Feedback tentang kekuatan kunci
4. **Entropy Analysis**: Pembelajaran tentang keamanan enkripsi

## 🎨 UI/UX Features

- **Responsive Design**: Bekerja di desktop, tablet, mobile
- **Dark Mode**: Mode gelap untuk penggunaan malam hari
- **Real-Time Notifications**: Notifikasi aksi berhasil/gagal
- **Copy to Clipboard**: One-click copy untuk semua output
- **Export Functions**: Export history dan download hasil

## 📱 Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Responsive design

## ⚠️ Catatan Penting

1. **Educational Purpose**: Aplikasi ini untuk tujuan pendidikan. Untuk keperluan produksi/security-critical, gunakan library crypto profesional.

2. **AES/RSA Simplified**: Implementasi disederhanakan untuk pembelajaran. Tidak menggunakan implementasi standard/optimized production.

3. **Browser Security**: Tergantung pada security kebijakan browser dan OS.

4. **Performance**: Benchmarking akurat tergantung pada CPU, RAM, dan background processes.

## 🔍 Troubleshooting

### Fitur tidak berfungsi

- Refresh halaman (Ctrl+F5 atau Cmd+Shift+R)
- Buka console (F12) untuk melihat error messages
- Pastikan semua file (.js, .css) terupload dengan benar

### Script.js belum terupdate

- Lihat bagian "Setup & Instalasi"
- Pastikan script-new.js sudah di-replace dengan script.js

### Dark mode tidak simpan

- Aktifkan cookies/localStorage di browser
- Cek permission browser untuk website

## 📝 Changelog v2.0

- ✅ Tambahan 10 fitur utama
- ✅ Algoritma modern (AES, RSA, XOR)
- ✅ Visualisasi proses enkripsi
- ✅ Frequency analysis visualization
- ✅ Real-time encryption mode
- ✅ Benchmark tool
- ✅ History/logging dengan export
- ✅ Dark mode support
- ✅ Responsive design
- ✅ File encryption/decryption

## 🙏 Kontribusi

Untuk bug report atau feature request, silahkan create issue atau fork repository.

## 📄 Lisensi

MIT License - Untuk tujuan pendidikan dan pembelajaran.

---

**Versi**: 2.0  
**Update**: Tahun 2026  
**Status**: Active Development  
**Kategori**: Educational Cryptography

Enjoy learning cryptography! 🔐
