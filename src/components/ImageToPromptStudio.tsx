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

export type PromptStrategyType =
  | 'detailed'
  | 'concise'
  | 'creative-remix'
  | 'merch-apparel'
  | 'photorealistic'
  | 'anime-stylized'

export type CreativityLevelType = 'strict' | 'balanced' | 'creative'

type ImageToPromptStudioProps = {
  provider: 'chatgpt' | 'claude' | 'gemini'
  model: string
  apiKey: string
  providerLabel: string
  outputLanguage: 'id' | 'en'
  availableModels: string[]
  hasServerKey: boolean
  onProviderChange: (provider: 'chatgpt' | 'claude' | 'gemini') => void
  onModelChange: (model: string) => void
  onApiKeyChange: (apiKey: string) => void
  onApplyToBuilder: (breakdown: ImagePromptBreakdown, prompt: string) => void
  onApplyToMockup: (imageUrl: string, prompt: string, concept: string) => void
  onAddExamplePrompt: (prompt: string) => void
  onNavigateTab: (tab: 'prompt-builder' | 'mockup-studio') => void
}

function convertSvgToPngDataUrl(svgDataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        const width = Math.max(img.naturalWidth || 600, 600)
        const height = Math.max(img.naturalHeight || 600, 600)
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, width, height)
          ctx.drawImage(img, 0, 0, width, height)
          resolve(canvas.toDataURL('image/png'))
          return
        }
      } catch {
        // fallback
      }
      resolve(svgDataUrl)
    }
    img.onerror = () => resolve(svgDataUrl)
    img.src = svgDataUrl
  })
}

export function ImageToPromptStudio({
  provider,
  model,
  apiKey,
  providerLabel,
  outputLanguage,
  availableModels,
  hasServerKey,
  onProviderChange,
  onModelChange,
  onApiKeyChange,
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
  const [showApiKey, setShowApiKey] = useState(false)

  // Options for automatic prompt generation
  const [promptStrategy, setPromptStrategy] = useState<PromptStrategyType>('detailed')
  const [creativityLevel, setCreativityLevel] = useState<CreativityLevelType>('balanced')
  const [targetGenerator, setTargetGenerator] = useState<'midjourney' | 'flux' | 'general'>('midjourney')
  const [aspectRatioOverride, setAspectRatioOverride] = useState<string>('auto')
  const [customFocus, setCustomFocus] = useState<string>('')
  const [autoGenerateOnUpload, setAutoGenerateOnUpload] = useState<boolean>(true)

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
      suggestedStrategy: 'merch-apparel' as PromptStrategyType,
      url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><rect width="300" height="300" fill="%230c1017"/><circle cx="150" cy="150" r="110" fill="none" stroke="%23ff7675" stroke-width="6"/><circle cx="150" cy="150" r="95" fill="%231e272e"/><polygon points="80,105 120,70 130,105" fill="%23e17055"/><polygon points="220,105 180,70 170,105" fill="%23e17055"/><path d="M100 130 Q150 70 200 130 Q215 190 150 230 Q85 190 100 130 Z" fill="%23ff7675"/><polygon points="120,150 135,155 120,160" fill="%232d3436"/><polygon points="180,150 165,155 180,160" fill="%232d3436"/><circle cx="150" cy="190" r="12" fill="%23ffeaa7"/><text x="150" y="270" text-anchor="middle" fill="%2300cec9" font-family="sans-serif" font-size="14" font-weight="bold" letter-spacing="4">NEO TOKYO 2099</text></svg>',
    },
    {
      id: 'retro-wave',
      name: 'Retro 80s Sunset',
      desc: 'Gelombang Pantai & Mentari Senja',
      suggestedStrategy: 'creative-remix' as PromptStrategyType,
      url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><rect width="300" height="300" fill="%231a1a2e"/><circle cx="150" cy="130" r="75" fill="%23ff4757"/><rect x="75" y="115" width="150" height="7" fill="%231a1a2e"/><rect x="75" y="130" width="150" height="8" fill="%231a1a2e"/><rect x="75" y="146" width="150" height="10" fill="%231a1a2e"/><path d="M40 220 Q95 180 150 220 T260 220 L260 270 L40 270 Z" fill="%232ed573"/><path d="M40 240 Q95 200 150 240 T260 240 L260 270 L40 270 Z" fill="%231e90ff"/><text x="150" y="55" text-anchor="middle" fill="%23ffa502" font-family="sans-serif" font-size="16" font-weight="bold" letter-spacing="5">CALIFORNIA SURF</text></svg>',
    },
    {
      id: 'botanical-art',
      name: 'Minimalist Botanical',
      desc: 'Ilustrasi Garis Daun & Bulan Organik',
      suggestedStrategy: 'detailed' as PromptStrategyType,
      url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23f7f4ee"/><circle cx="150" cy="150" r="115" fill="%23ffffff" stroke="%232d3436" stroke-width="4"/><path d="M150 45 A105 105 0 0 0 150 255 A80 80 0 0 1 150 45 Z" fill="%23d68160"/><path d="M130 240 C125 170 170 130 215 90 C180 150 175 195 130 240 Z" fill="%2326734d"/><path d="M160 180 C135 160 125 130 145 108 C155 135 180 150 160 180 Z" fill="%232d3436"/><circle cx="215" cy="80" r="5" fill="%23e5ad35"/><text x="150" y="275" text-anchor="middle" fill="%232d3436" font-family="sans-serif" font-size="12" font-weight="bold" letter-spacing="3">FLORA & BOTANIC</text></svg>',
    },
  ]

  // Strategies definitions
  const strategyOptions: {
    id: PromptStrategyType
    title: string
    badge: string
    description: string
    icon: string
  }[] = [
    {
      id: 'detailed',
      title: 'DNA Lengkap & Tekstur',
      badge: 'Direkomendasikan',
      description: 'Analisis mendalam seluruh aspek: medium seni, pencahayaan, tekstur mikro, dan framing.',
      icon: '🔬',
    },
    {
      id: 'concise',
      title: 'Ringkas & Padat',
      badge: 'Cepat & Tajam',
      description: 'Format kata kunci to-the-point tanpa kalimat berbelit, cocok untuk Midjourney v6 & SDXL.',
      icon: '⚡',
    },
    {
      id: 'creative-remix',
      title: 'Creative Remix & Ekspansi',
      badge: 'Artistik',
      description: 'Menangkap esensi utama lalu menambahkan sentuhan kreatif baru dan atmosfer sinematik.',
      icon: '🎨',
    },
    {
      id: 'merch-apparel',
      title: 'Sablon Kaos & Merch Ready',
      badge: 'Siap Mockup',
      description: 'Garis vektor tebal, warna kontras tinggi, background bersih untuk sablon apparel & stiker.',
      icon: '👕',
    },
    {
      id: 'photorealistic',
      title: 'Konversi Fotorealistis',
      badge: 'Kamera Nyata',
      description: 'Mengubah konsep gambar ke dalam fotografi komersial studio (lensa 85mm, softbox, realis).',
      icon: '📸',
    },
    {
      id: 'anime-stylized',
      title: 'Anime & Manga Key Visual',
      badge: 'Gaya Niji',
      description: 'Cel-shading berlapis, linework dinamis, efek partikel bercahaya gaya animasi Jepang.',
      icon: '🎌',
    },
  ]

  async function executeAnalysis(imgBase64: string, strategy = promptStrategy) {
    setError('')

    if (!imgBase64) {
      setError('Silakan pilih atau unggah gambar contoh terlebih dahulu.')
      return
    }

    if (!apiKey.trim() && !hasServerKey) {
      setError(`Masukkan API Key untuk ${providerLabel} pada kolom konfigurasi AI di atas terlebih dahulu.`)
      return
    }

    setIsAnalyzing(true)

    try {
      let payloadImage = imgBase64
      if (payloadImage.startsWith('data:image/svg')) {
        payloadImage = await convertSvgToPngDataUrl(payloadImage)
      }

      const response = await fetch('/api/image-to-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider,
          model,
          apiKey,
          imageBase64: payloadImage,
          outputLanguage,
          targetGenerator,
          promptStrategy: strategy,
          creativityLevel,
          aspectRatioOverride,
          customFocus,
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
    reader.onload = async () => {
      if (typeof reader.result === 'string') {
        let base64 = reader.result
        if (file.type === 'image/svg+xml' || base64.startsWith('data:image/svg')) {
          base64 = await convertSvgToPngDataUrl(base64)
        }
        setImagePreview(base64)
        setResultPrompt('')
        setBreakdown(null)

        // If auto-generate is active and user provided API key or server key exists, trigger automatically!
        if (autoGenerateOnUpload && (apiKey.trim() || hasServerKey)) {
          executeAnalysis(base64)
        }
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

  async function handleSelectSample(sample: typeof sampleReferences[0]) {
    setError('')
    setImageFileName(sample.name)
    setImageFileSize('Preset Vektor')
    setResultPrompt('')
    setBreakdown(null)

    const targetStrat = sample.suggestedStrategy || promptStrategy
    setPromptStrategy(targetStrat)

    const pngUrl = await convertSvgToPngDataUrl(sample.url)
    setImagePreview(pngUrl)

    if (autoGenerateOnUpload && (apiKey.trim() || hasServerKey)) {
      executeAnalysis(pngUrl, targetStrat)
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
            Pilih gaya strategi analisis AI, unggah gambar referensi (atau klik contoh siap pakai), dan AI ({providerLabel})
            akan otomatis menyusun prompt master presisi untuk Midjourney v6, Flux, atau Stable Diffusion!
          </p>
        </div>

        {/* Inline AI Provider & Model Bar */}
        <div className="vision-quick-config">
          <div className="quick-config-group">
            <label className="quick-config-label">Provider AI</label>
            <select
              className="quick-select"
              value={provider}
              onChange={(e) => onProviderChange(e.target.value as 'chatgpt' | 'claude' | 'gemini')}
            >
              <option value="gemini">✨ Gemini (Google AI)</option>
              <option value="chatgpt">ChatGPT (OpenAI)</option>
              <option value="claude">Claude (Anthropic)</option>
            </select>
          </div>

          <div className="quick-config-group">
            <label className="quick-config-label">Model Vision</label>
            <select
              className="quick-select"
              value={model}
              onChange={(e) => onModelChange(e.target.value)}
            >
              {availableModels.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="quick-config-group key-group">
            <label className="quick-config-label">
              API Key ({providerLabel})
              {hasServerKey && !apiKey && (
                <span className="server-connected-badge">✓ Aktif (.env)</span>
              )}
            </label>
            <div className="key-input-wrapper">
              <input
                type={showApiKey ? 'text' : 'password'}
                className="quick-key-input"
                value={apiKey}
                onChange={(e) => onApiKeyChange(e.target.value)}
                placeholder={hasServerKey ? 'Terhubung via .env server' : `Masukkan API Key ${providerLabel}`}
                autoComplete="off"
              />
              <button
                type="button"
                className="toggle-key-btn"
                onClick={() => setShowApiKey(!showApiKey)}
                title={showApiKey ? 'Sembunyikan' : 'Tampilkan'}
              >
                {showApiKey ? '👁️' : '🔒'}
              </button>
            </div>
          </div>
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

      {/* Main Grid */}
      <div className="vision-grid">
        {/* Left Column: Upload, Preset, & Options */}
        <div className="vision-upload-card">
          {/* Section 1: Upload */}
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

          {/* Preset quick samples */}
          <div className="sample-presets-block">
            <span className="sample-label">Atau coba dengan gambar contoh berikut:</span>
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

          {/* Section 2: AI Prompting Strategy Choices */}
          <div className="strategy-selection-section">
            <div className="section-title-with-badge">
              <h4>2) Pilihan Mode Analisis Otomatis AI</h4>
              <span className="choice-count-badge">6 Pilihan Mode</span>
            </div>
            <p className="strategy-hint">
              Pilih bagaimana AI menganalisis dan memformulasikan prompt dari gambar:
            </p>

            <div className="strategy-grid">
              {strategyOptions.map((opt) => (
                <div
                  key={opt.id}
                  className={`strategy-card ${promptStrategy === opt.id ? 'active' : ''}`}
                  onClick={() => setPromptStrategy(opt.id)}
                >
                  <div className="strategy-card-top">
                    <span className="strategy-icon">{opt.icon}</span>
                    <span className="strategy-badge">{opt.badge}</span>
                  </div>
                  <strong>{opt.title}</strong>
                  <p>{opt.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Fine-Tuning Options */}
          <div className="fine-tuning-options-box">
            <h4>3) Pengaturan Mesin AI & Otomatisasi</h4>

            {/* Creativity Level pills */}
            <div className="options-control-group">
              <label className="options-label">Tingkat Kesetiaan / Kreativitas AI:</label>
              <div className="creativity-pills">
                <button
                  type="button"
                  className={`creativity-pill ${creativityLevel === 'strict' ? 'active' : ''}`}
                  onClick={() => setCreativityLevel('strict')}
                  title="Sangat setia pada gambar asli (suhu rendah 0.2)"
                >
                  🎯 Strict (100% Mirip)
                </button>
                <button
                  type="button"
                  className={`creativity-pill ${creativityLevel === 'balanced' ? 'active' : ''}`}
                  onClick={() => setCreativityLevel('balanced')}
                  title="Seimbang antara replikasi dan pengayaan kata (suhu 0.5)"
                >
                  ⚖️ Balanced (Seimbang)
                </button>
                <button
                  type="button"
                  className={`creativity-pill ${creativityLevel === 'creative' ? 'active' : ''}`}
                  onClick={() => setCreativityLevel('creative')}
                  title="Kreatif dan eksploratif mengembangkan variasi baru (suhu 0.85)"
                >
                  🚀 Creative (Eksploratif)
                </button>
              </div>
            </div>

            <div className="control-row dual">
              <label>
                Target Mesin AI Gambar:
                <select
                  value={targetGenerator}
                  onChange={(e) =>
                    setTargetGenerator(e.target.value as 'midjourney' | 'flux' | 'general')
                  }
                >
                  <option value="midjourney">Midjourney v6 / Niji 6 (dengan --ar & parameters)</option>
                  <option value="flux">Black Forest Labs FLUX.1 (natural deskriptif)</option>
                  <option value="general">Stable Diffusion XL & DALL-E 3</option>
                </select>
              </label>

              <label>
                Rasio Aspek (Aspect Ratio):
                <select
                  value={aspectRatioOverride}
                  onChange={(e) => setAspectRatioOverride(e.target.value)}
                >
                  <option value="auto">Otomatis (Sesuai Gambar / 1:1)</option>
                  <option value="1:1">1:1 (Persegi - Kaos/Stiker)</option>
                  <option value="16:9">16:9 (Landscape Wallpaper)</option>
                  <option value="9:16">9:16 (Story / Banner)</option>
                  <option value="4:5">4:5 (Instagram Portrait)</option>
                  <option value="3:2">3:2 (Fotografi Klasik)</option>
                </select>
              </label>
            </div>

            {/* Custom Focus Prompt Input */}
            <label className="custom-focus-label">
              Fokus Khusus / Permintaan Tambahan (Opsional):
              <input
                type="text"
                value={customFocus}
                onChange={(e) => setCustomFocus(e.target.value)}
                placeholder="contoh: 'ubah waktu jadi malam hari dengan lampu neon', 'fokuskan pada karakter utama'..."
              />
            </label>

            {/* Auto generate on upload toggle */}
            <label className="auto-generate-toggle">
              <input
                type="checkbox"
                checked={autoGenerateOnUpload}
                onChange={(e) => setAutoGenerateOnUpload(e.target.checked)}
              />
              <span className="toggle-text">
                ⚡ <strong>Otomatis jalankan analisis & buat prompt saat gambar diunggah</strong>
              </span>
            </label>
          </div>

          {/* Action Button */}
          <button
            type="button"
            className="primary analyze-btn"
            onClick={() => imagePreview && executeAnalysis(imagePreview)}
            disabled={isAnalyzing || !imagePreview}
          >
            {isAnalyzing ? (
              <span className="spinner-text">
                <span className="spin-dot">⏳</span> Sedang Menganalisis Gambar dengan Mode "{strategyOptions.find((s) => s.id === promptStrategy)?.title}"...
              </span>
            ) : (
              `⚡ Analisis Gambar (${strategyOptions.find((s) => s.id === promptStrategy)?.title})`
            )}
          </button>
        </div>

        {/* Right Column: Generated Prompt & Breakdown */}
        <div className="vision-result-card">
          <div className="result-header-row">
            <h3>Hasil Prompt Otomatis AI</h3>
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
                <div className="prompt-box-meta">
                  <span>
                    Mode: <strong>{strategyOptions.find((s) => s.id === promptStrategy)?.title}</strong>
                  </span>
                  <span>
                    Engine: <strong>{targetGenerator.toUpperCase()}</strong>
                  </span>
                  <span>
                    Kreativitas: <strong>{creativityLevel.toUpperCase()}</strong>
                  </span>
                </div>
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
              <h4>Siap Menganalisis Gambar Contoh</h4>
              <p>
                Pilih salah satu dari <strong>6 Mode Analisis</strong> di sebelah kiri, lalu unggah gambar atau pilih sampel.
                AI akan secara otomatis merumuskan prompt sesuai gaya yang Anda tentukan!
              </p>
              <div className="how-it-works-box">
                <strong>Fitur Unggulan Pilihan AI:</strong>
                <ol>
                  <li><strong>Mode DNA Lengkap</strong>: Cocok untuk reverse-engineering detail mikroskopis</li>
                  <li><strong>Mode Sablon & Merch</strong>: Mempersiapkan gambar untuk sablon kaos & mockup</li>
                  <li><strong>Mode Ringkas</strong>: Prompt efisien tanpa kata sambung berlebih</li>
                  <li><strong>Auto-Generate</strong>: Otomatis memproses begitu gambar dipilih</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
