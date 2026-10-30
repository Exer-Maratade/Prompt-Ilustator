# Prompt & Mockup Studio - Generator Ilustrasi & Mockup Produk

Aplikasi web modern untuk merancang prompt gambar ilustrasi berkualitas tinggi dan mengubah desain/artwork ke dalam **mockup produk nyata** (Kaos, Tas Kanvas, Hoodie, Mug, Topi, Poster).

Terhubung langsung dengan pilihan AI: **ChatGPT (OpenAI)**, **Claude (Anthropic)**, dan **Gemini (Google)**.

---

## Fitur Utama

### 1. Template Model Gaya Ilustrator Siap Pakai
- **Flat Vector Minimalist**: Bentuk geometris rapi, warna solid, gaya modern SVG / Dribbble.
- **Japanese Anime / Manga Key Visual**: Garis dinamis, cel-shading berlapis, pencahayaan Shinkai & efek partikel.
- **Watercolor & Children's Book**: Tekstur kertas berpori (cold-press), gradasi basah cat air lembut & puitis.
- **Vintage Pop Art & Comic Book**: Halftone Ben-Day dots, tinta hitam tebal, gaya komik retro 60-an.
- **Sticker & Merch Vector Design**: Border die-cut putih tebal, lencana vector kontras tinggi untuk sablon kaos & stiker.
- **Cyberpunk & Sci-Fi Technical Line Art**: Garis mecha rumit, skema blueprint, aksen neon menyala.
- **Vintage Woodcut & Etching Engraving**: Arsir silang (cross-hatching) klasik, gaya ukiran buku antik.
- **Cute 3D Isometric Diorama**: Model miniatur 3D imut, pencahayaan ambient lembut, sudut pandang isometrik.

> Cukup klik salah satu template, semua field konfigurasi (style, mood, lighting, framing, palette, negative prompt) akan terisi otomatis dan contoh prompt referensi akan ditambahkan!

### 2. Upload Gambar Contoh & Generate Prompt Otomatis (Image-to-Prompt)
- **Vision AI Reverse-Engineering**:
  - Unggah gambar referensi atau ilustrasi yang Anda sukai (drag & drop atau pilih file PNG, JPG, WEBP, SVG hingga 15MB).
  - Tersedia tombol sampel gambar bawaan (Cyberpunk Neon, Retro Sunset, Minimalist Botanical) untuk pengujian cepat tanpa harus mencari gambar terlebih dahulu.
  - Model AI (ChatGPT Vision, Claude Vision, atau Gemini Vision) menganalisis detail seni secara mendalam:
    - Gaya seni & medium (misal: vector flat, cat air, arsir silang)
    - Subjek & pose
    - Pencahayaan, highlight, & bayangan
    - Palet warna dominan & aksen
    - Linework & teknik goresan
    - Komposisi & sudut kamera
    - Negative constraints
  - **Format Output Sesuai Mesin AI**:
    - **Midjourney v6 / Niji 6** (dilengkapi aspect ratio dan parameter gaya)
    - **Black Forest Labs FLUX.1** (deskripsi visual deskriptif & padat)
    - **Stable Diffusion XL & DALL-E 3**
  - **Aksi Cepat 1-Klik**:
    - `📋 Salin Prompt`: Salin prompt final langsung ke clipboard.
    - `📝 Terapkan ke Brief Gambar`: Mengisi semua atribut analisis (konsep, subjek, style, palet, dll.) langsung ke form builder di Tab 1 untuk dimodifikasi atau di-remix lebih lanjut.
    - `👕 Jadikan Mockup Produk`: Membawa gambar dan prompt tersebut langsung ke studio mockup kaos/tas/mug di Tab 3.
    - `📌 Simpan ke Contoh`: Menyimpan prompt yang dihasilkan ke daftar referensi contoh prompt.

### 3. Mockup Studio Produk (Kaos, Tas, Hoodie, Mug, Topi, Poster)
- **Live Interactive Mockup Preview**:
  - Pilihan produk: **Kaos (T-Shirt)**, **Tas Kanvas (Tote Bag)**, **Hoodie Pullover**, **Mug Keramik**, **Topi Baseball (Cap)**, dan **Bingkai Poster Dinding**.
  - Pilihan warna produk: *Pure White, Natural Cream, Onyx Black, Washed Charcoal, Deep Navy, Forest Green, Sand Khaki, Terracotta, Vintage Mustard*.
  - Realistic fabric folds, highlight kilap, dan bayangan produk realistis.
  - Upload gambar/desain sendiri (PNG/JPG transparan) atau pilih dari badge vektor bawaan (Cyber Tiger, Retro Wave, Botanical Moon, Cosmic Voyager).
  - Kontrol posisi dan ukuran: Slider Scale (30%-130%), Offset Vertikal Y, Offset Horizontal X, dan Blend Mode (Solid, Multiply menyatu serat kain, Overlay).
  - **Download Gambar PNG Mockup**: Ekspor gambar mockup beresolusi tinggi langsung ke perangkat.
- **AI Mockup Prompt Generator**:
  - Buat prompt foto produk komersial otomatis untuk **Midjourney v6**, **Flux**, **Stable Diffusion**, atau **DALL-E 3**.
  - Pengaturan scene: Studio Clean, Flat-lay Rustic Wood, Lifestyle Urban Model, Podium Marmer, Hanger Industrial.
  - Salin prompt mockup dalam satu klik.

### 3. Koneksi AI Multi-Provider
- **ChatGPT**: GPT-5-mini, GPT-5, GPT-4.1
- **Claude**: Claude Sonnet 4, Claude 3.7 Sonnet
- **Gemini**: Gemini 2.5 Pro, Gemini 2.5 Flash

### 4. Lampirkan Contoh Prompt Referensi
- Tulis dan tambahkan manual dari kotak teks.
- Import langsung dari file `.txt` atau `.json`.

## Menjalankan Project

1. Install dependency:

```bash
npm install
```

2. Jalankan frontend + backend bersamaan:

```bash
npm run dev
```

3. Buka URL Vite (default):

```text
http://localhost:5173
```

Backend API berjalan di:

```text
http://localhost:8787
```

## Cara Menghubungkan AI

API key dimasukkan langsung di UI saat generate.

- ChatGPT (OpenAI): gunakan OpenAI API key.
- Claude (Anthropic): gunakan Anthropic API key.
- Gemini (Google): gunakan Gemini API key.

Catatan keamanan:

- API key hanya dipakai saat request generate dan tidak disimpan permanen di server.
- Untuk produksi, disarankan menambahkan autentikasi dan rate limiting.

## Format File Contoh Prompt

Anda bisa import:

- `.txt` berisi satu prompt per baris.
- `.json` berupa array string:

```json
[
  "Cinematic portrait, warm light...",
  "Ultra realistic product shot..."
]
```

Atau objek JSON:

```json
{
  "prompts": ["prompt 1", "prompt 2"]
}
```
