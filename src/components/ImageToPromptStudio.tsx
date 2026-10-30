import { useState, useRef } from 'react'
import type { ChangeEvent, DragEvent } from 'react'

export type ImagePromptBreakdown = {
  concept?: string
  subject?: string
  style?: string
  mood?: string
  camera?: string
  lighting?: string
  palette?: string
  setting?: string
  details?: string
  negativePrompt?: string
  aspectRatio?: '1:1' | '3:2' | '4:5' | '16:9' | '9:16'
}

type ImageToPromptStudioProps = {
  provider: 'chatgpt' | 'claude' | 'gemini'
  model: string
  apiKey: string
  providerLabel: string
  outputLanguage: 'id' | 'en'
  onApplyToBuilder: (breakdown: ImagePromptBreakdown, prompt: string) => void
  onApplyToMockup: (imageUrl: string, prompt: string, concept: string) => void
  onAddExamplePrompt: (prompt: string) => void
  onNavigateTab: (tab: 'prompt-builder' | 'mockup-studio') => void
}

export function ImageToPromptStudio({
  provider,
  model,
  apiKey,
  providerLabel,
  outputLanguage,
  onApplyToBuilder,
  onApplyToMockup,
  onAddExamplePrompt,
  onNavigateTab,
}: ImageToPromptStudioProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFileName, setImageFileName] = useState<string>('')
  const [imageFileSize, setImageFileSize] = useState<string>('')
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [targetGenerator, setTargetGenerator] = useState<'midjourney' | 'flux' | 'general'>('midjourney')
  const [resultPrompt, setResultPrompt] = useState<string>('')
  const [breakdown, setBreakdown] = useState<ImagePromptBreakdown | null>(null)
  const [error, setError] = useState<string>('')
  const [copiedStatus, setCopiedStatus] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Preset sample reference images for users to try immediately
  const sampleReferences = [
    {
      id: 'cyberpunk-neon',
      name: 'Cyberpunk Neon Vector',
      desc: 'Maskot Harimau Mecha Neon',
      url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><rect width="300" height="300" fill="%230c1017"/><circle cx="150" cy="150" r="110" fill="none" stroke="%23ff7675" stroke-width="6"/><circle cx="150" cy="150" r="95" fill="%231e272e"/><polygon points="80,105 120,70 130,105" fill="%23e17055"/><polygon points="220,105 180,70 170,105" fill="%23e17055"/><path d="M100 130 Q150 70 200 130 Q215 190 150 230 Q85 190 100 130 Z" fill="%23ff7675"/><polygon points="120,150 135,155 120,160" fill="%232d3436"/><polygon points="180,150 165,155 180,160" fill="%232d3436"/><circle cx="150" cy="190" r="12" fill="%23ffeaa7"/><text x="150" y="270" text-anchor="middle" fill="%2300cec9" font-family="sans-serif" font-size="14" font-weight="bold" letter-spacing="4">NEO TOKYO 2099</text></svg>',
    },
    {
      id: 'retro-wave',
      name: 'Retro 80s Sunset',
      desc: 'Gelombang Pantai & Mentari Senja',
      url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><rect width="300" height="300" fill="%231a1a2e"/><circle cx="150" cy="130" r="75" fill="%23ff4757"/><rect x="75" y="115" width="150" height="7" fill="%231a1a2e"/><rect x="75" y="130" width="150" height="8" fill="%231a1a2e"/><rect x="75" y="146" width="150" height="10" fill="%231a1a2e"/><path d="M40 220 Q95 180 150 220 T260 220 L260 270 L40 270 Z" fill="%232ed573"/><path d="M40 240 Q95 200 150 240 T260 240 L260 270 L40 270 Z" fill="%231e90ff"/><text x="150" y="55" text-anchor="middle" fill="%23ffa502" font-family="sans-serif" font-size="16" font-weight="bold" letter-spacing="5">CALIFORNIA SURF</text></svg>',
    },
    {
      id: 'botanical-art',
      name: 'Minimalist Botanical',
      desc: 'Ilustrasi Garis Daun & Bulan Organik',
      url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23f7f4ee"/><circle cx="150" cy="150" r="115" fill="%23ffffff" stroke="%232d3436" stroke-width="4"/><path d="M150 45 A105 105 0 0 0 150 255 A80 80 0 0 1 150 45 Z" fill="%23d68160"/><path d="M130 240 C125 170 170 130 215 90 C180 150 175 195 130 240 Z" fill="%2326734d"/><path d="M160 180 C135 160 125 130 145 108 C155 135 180 150 160 180 Z" fill="%232d3436"/><circle cx="215" cy="80" r="5" fill="%23e5ad35"/><text x="150" y="275" text-anchor="middle" fill="%232d3436" font-family="sans-serif" font-size="12" font-weight="bold" letter-spacing="3">FLORA & BOTANIC</text></svg>',
    },
  ]

  function processFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('File yang diunggah harus berupa gambar (PNG, JPG, WEBP, GIF, SVG).')
      return
    }

    if (file.size > 15 * 1024 * 1024) {
      setError('Ukuran gambar terlalu besar (maksimum 15MB).')
      return
    }

    setError('')
    setImageFileName(file.name)
    setImageFileSize(`${(file.size / 1024).toFixed(1)} KB`)

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImagePreview(reader.result)
        // Reset previous analysis
        setResultPrompt('')
        setBreakdown(null)
      }
    }
    reader.readAsDataURL(file)
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragging(false)
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragging(false)
    const file = event.dataTransfer.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  function handleSelectSample(sample: typeof sampleReferences[0]) {
    setError('')
    setImageFileName(sample.name)
    setImageFileSize('Preset Vektor')
    setImagePreview(sample.url)
    setResultPrompt('')
    setBreakdown(null)
  }

  async function handleAnalyzeImage() {
    setError('')

    if (!imagePreview) {
      setError('Silakan pilih atau unggah gambar contoh terlebih dahulu.')
      return
    }

    if (!apiKey.trim()) {
      setError(`Masukkan API Key untuk ${providerLabel} pada tab Studio Prompt atau form di atas.`)
      return
    }

    setIsAnalyzing(true)

    try {
      const response = await fetch('/api/image-to-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider,
          model,
          apiKey,
          imageBase64: imagePreview,
          outputLanguage,
          targetGenerator,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal menganalisis gambar.')
      }

      if (!data.prompt) {
        throw new Error('Hasil prompt kosong dari AI.')
      }

      setResultPrompt(data.prompt)
      if (data.breakdown) {
        setBreakdown(data.breakdown)
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan saat reverse-engineering prompt.'
      setError(msg)
    } finally {
      setIsAnalyzing(false)
    }
  }

  async function handleCopyPrompt() {
    if (!resultPrompt) return
    await navigator.clipboard.writeText(resultPrompt)
    setCopiedStatus(true)
    setTimeout(() => setCopiedStatus(false), 2000)
  }

  function handleApplyToBuilderClick() {
    if (!breakdown && !resultPrompt) return
    onApplyToBuilder(breakdown || {}, resultPrompt)
    onNavigateTab('prompt-builder')
  }

  function handleApplyToMockupClick() {
    if (!imagePreview) return
    onApplyToMockup(
      imagePreview,
      resultPrompt,
      breakdown?.concept || breakdown?.subject || imageFileName || 'Desain Kustom',
    )
    onNavigateTab('mockup-studio')
  }

  function handleAddExampleClick() {
    if (!resultPrompt) return
    onAddExamplePrompt(resultPrompt)
    setError('✓ Prompt berhasil ditambahkan ke daftar Contoh Referensi!')
    setTimeout(() => setError(''), 3000)
  }

  return (
    <section className="image-to-prompt-container">
      {/* Header Banner */}
      <div className="vision-header-card">
        <div className="vision-title">
          <span className="badge-pill">Vision AI • Image-to-Prompt</span>
          <h2>Upload Gambar Contoh & Generate Prompt Otomatis</h2>
          <p>
            Punya gambar referensi yang kamu sukai? Unggah gambarnya, dan AI (ChatGPT, Claude, atau Gemini)
            akan menganalisis DNA visualnya (gaya seni, pencahayaan, medium, garis, komposisi, palet warna)
            lalu menghasilkan prompt presisi untuk mereproduksinya di Midjourney v6, Flux, atau Stable Diffusion!
          </p>
        </div>
        <div className="vision-provider-badge">
          <span>Terkoneksi ke:</span>
          <strong>{providerLabel}</strong>
          <small>Model: {model}</small>
        </div>
      </div>

      {error && (
        <div className="global-error-banner">
          <span>⚠️ {error}</span>
          <button type="button" onClick={() => setError('')}>
            ✕
          </button>
        </div>
      )}

      {/* Main Grid: Upload & Preview on Left, Output & Actions on Right */}
      <div className="vision-grid">
        {/* Left Column: Dropzone & Image Preview */}
        <div className="vision-upload-card">
          <h3>1) Unggah atau Pilih Gambar Referensi</h3>

          <div
            className={`dropzone-box ${isDragging ? 'dragging' : ''} ${imagePreview ? 'has-image' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            {imagePreview ? (
              <div className="preview-content">
                <img src={imagePreview} alt="Preview referensi" className="uploaded-image-preview" />
                <div className="preview-overlay">
                  <span>Klik atau seret untuk ganti gambar</span>
                </div>
              </div>
            ) : (
              <div className="dropzone-empty">
                <div className="dropzone-icon">🖼️</div>
                <strong>Tarik & lepas gambar referensi di sini</strong>
                <p>atau klik untuk memilih dari komputer (PNG, JPG, WEBP, SVG)</p>
                <span className="dropzone-tip">Ukuran maksimum: 15MB</span>
              </div>
            )}
          </div>

          {imageFileName && (
            <div className="file-meta-bar">
              <span>📄 {imageFileName}</span>
              <span className="file-size-tag">{imageFileSize}</span>
              <button
                type="button"
                className="clear-file-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  setImagePreview(null)
                  setImageFileName('')
                  setResultPrompt('')
                  setBreakdown(null)
                }}
              >
                ✕ Hapus
              </button>
            </div>
          )}

          {/* Quick preset samples */}
          <div className="sample-presets-block">
            <span className="sample-label">Atau coba dengan contoh gambar berikut:</span>
            <div className="sample-chips">
              {sampleReferences.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  className={`sample-ref-chip ${imageFileName === sample.name ? 'active' : ''}`}
                  onClick={() => handleSelectSample(sample)}
                >
                  <img src={sample.url} alt={sample.name} className="sample-chip-img" />
                  <div>
                    <strong>{sample.name}</strong>
                    <small>{sample.desc}</small>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Target Generator Setting */}
          <div className="generator-selector-row">
            <label>
              Format Prompt Dioptimalkan Untuk:
              <select
                value={targetGenerator}
                onChange={(e) =>
                  setTargetGenerator(e.target.value as 'midjourney' | 'flux' | 'general')
                }
              >
                <option value="midjourney">Midjourney v6 / Niji 6 (disertai --ar, parameter style)</option>
                <option value="flux">Black Forest Labs FLUX.1 (deskripsi visual natural & padat)</option>
                <option value="general">Stable Diffusion XL & DALL-E 3 (standar)</option>
              </select>
            </label>
          </div>

          {/* Analyze Button */}
          <button
            type="button"
            className="primary analyze-btn"
            onClick={handleAnalyzeImage}
            disabled={isAnalyzing || !imagePreview}
          >
            {isAnalyzing ? (
              <span className="spinner-text">
                <span className="spin-dot">⏳</span> Sedang Menganalisis Visual dengan {providerLabel}...
              </span>
            ) : (
              '⚡ Analisis Gambar & Buat Prompt Otomatis'
            )}
          </button>
        </div>

        {/* Right Column: Generated Prompt & Breakdown */}
        <div className="vision-result-card">
          <div className="result-header-row">
            <h3>2) Hasil Prompt Reverse-Engineering</h3>
            {resultPrompt && (
              <button type="button" className="ghost-sm" onClick={handleCopyPrompt}>
                {copiedStatus ? '✓ Tersalin!' : '📋 Salin Prompt'}
              </button>
            )}
          </div>

          {resultPrompt ? (
            <div className="result-active-content">
              {/* Full Prompt Display Box */}
              <div className="prompt-output-box">
                <textarea
                  className="full-prompt-area"
                  rows={6}
                  readOnly
                  value={resultPrompt}
                />
              </div>

              {/* Action Buttons to Flow into Other Features */}
              <div className="vision-actions-bar">
                <button
                  type="button"
                  className="primary-sm highlight-action"
                  onClick={handleApplyToBuilderClick}
                  title="Muat rincian analisis ke form brief gambar"
                >
                  📝 Terapkan ke Brief Gambar
                </button>

                <button
                  type="button"
                  className="primary-sm"
                  onClick={handleApplyToMockupClick}
                  title="Jadikan gambar ini ke mockup kaos/tas/mug"
                >
                  👕 Jadikan Mockup Produk
                </button>

                <button
                  type="button"
                  className="ghost-sm"
                  onClick={handleAddExampleClick}
                  title="Tambahkan ke daftar contoh referensi prompt"
                >
                  📌 Simpan ke Contoh
                </button>
              </div>

              {/* Visual DNA Breakdown Attributes */}
              {breakdown && (
                <div className="breakdown-section">
                  <h4>🔍 Rincian Analisis DNA Visual:</h4>
                  <div className="breakdown-grid">
                    {breakdown.style && (
                      <div className="breakdown-item">
                        <span className="item-label">🎨 Gaya Seni / Medium</span>
                        <p>{breakdown.style}</p>
                      </div>
                    )}
                    {breakdown.concept && (
                      <div className="breakdown-item">
                        <span className="item-label">💡 Konsep Utama</span>
                        <p>{breakdown.concept}</p>
                      </div>
                    )}
                    {breakdown.subject && (
                      <div className="breakdown-item">
                        <span className="item-label">🎯 Subjek & Karakter</span>
                        <p>{breakdown.subject}</p>
                      </div>
                    )}
                    {breakdown.mood && (
                      <div className="breakdown-item">
                        <span className="item-label">✨ Mood & Suasana</span>
                        <p>{breakdown.mood}</p>
                      </div>
                    )}
                    {breakdown.lighting && (
                      <div className="breakdown-item">
                        <span className="item-label">💡 Pencahayaan</span>
                        <p>{breakdown.lighting}</p>
                      </div>
                    )}
                    {breakdown.palette && (
                      <div className="breakdown-item">
                        <span className="item-label">🎨 Palet Warna</span>
                        <p>{breakdown.palette}</p>
                      </div>
                    )}
                    {breakdown.camera && (
                      <div className="breakdown-item">
                        <span className="item-label">📷 Komposisi / Sudut</span>
                        <p>{breakdown.camera}</p>
                      </div>
                    )}
                    {breakdown.details && (
                      <div className="breakdown-item">
                        <span className="item-label">🖋️ Linework & Tekstur</span>
                        <p>{breakdown.details}</p>
                      </div>
                    )}
                    {breakdown.setting && (
                      <div className="breakdown-item">
                        <span className="item-label">🌆 Latar / Background</span>
                        <p>{breakdown.setting}</p>
                      </div>
                    )}
                    {breakdown.negativePrompt && (
                      <div className="breakdown-item negative">
                        <span className="item-label">🚫 Elemen Dihindari</span>
                        <p>{breakdown.negativePrompt}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="result-empty-placeholder">
              <div className="placeholder-art">🪄</div>
              <h4>Belum Ada Gambar yang Dianalisis</h4>
              <p>
                Unggah gambar contoh di sebelah kiri atau pilih salah satu sampel, lalu klik tombol{' '}
                <strong>"⚡ Analisis Gambar & Buat Prompt Otomatis"</strong>.
              </p>
              <div className="how-it-works-box">
                <strong>Cara Kerja:</strong>
                <ol>
                  <li>Gambar dikirim ke AI Vision pilihan (ChatGPT / Claude / Gemini)</li>
                  <li>Model AI membaca medium ilustrasi, pencahayaan, arsir, dan subjek secara mendalam</li>
                  <li>Prompt komprehensif langsung dirumuskan siap pakai</li>
                  <li>Dapat diaplikasikan ke form brief gambar atau langsung ke mockup kaos/tas</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
