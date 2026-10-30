import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import './App.css'
import { illustratorTemplates } from './data/illustratorTemplates'
import type { IllustratorTemplate } from './data/illustratorTemplates'
import { MockupStudio } from './components/MockupStudio'
import { ImageToPromptStudio } from './components/ImageToPromptStudio'
import type { ImagePromptBreakdown } from './components/ImageToPromptStudio'

type Provider = 'chatgpt' | 'claude' | 'gemini'

type BuilderState = {
  concept: string
  subject: string
  style: string
  mood: string
  camera: string
  lighting: string
  palette: string
  setting: string
  details: string
  negativePrompt: string
  outputLanguage: 'id' | 'en'
  aspectRatio: '1:1' | '3:2' | '4:5' | '16:9' | '9:16'
}

const providerModels: Record<Provider, string[]> = {
  gemini: ['gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3-flash-preview', 'gemini-3.8-flash'],
  chatgpt: ['gpt-5-mini', 'gpt-5', 'gpt-4.1'],
  claude: ['claude-sonnet-4-0', 'claude-3-7-sonnet-latest'],
}

const starterExamples = [
  'Vector illustration portrait of a stylish female fashion model in emerald turtleneck, minimalist geometric facial features, clean linework, pastel background, Dribbble aesthetic --ar 1:1',
  'Anime key visual portrait of a fierce young warrior with glowing azure eyes, wind-blown layered hair catching dramatic sunset rim lighting, Makoto Shinkai sky, crisp cel-shading --ar 16:9',
  'Streetwear vector graphic portrait of an urban youth wearing oversized techwear hoodie and neon face mask, thick white die-cut sticker border, apparel merchandise ready --ar 1:1',
]

const initialBuilder: BuilderState = {
  concept: '',
  subject: '',
  style: '',
  mood: '',
  camera: '',
  lighting: '',
  palette: '',
  setting: '',
  details: '',
  negativePrompt: '',
  outputLanguage: 'en',
  aspectRatio: '1:1',
}

function App() {
  const [activeTab, setActiveTab] = useState<'prompt-builder' | 'image-to-prompt' | 'mockup-studio'>('prompt-builder')
  const [provider, setProvider] = useState<Provider>(() => {
    return (localStorage.getItem('ai_provider') as Provider) || 'gemini'
  })
  const [model, setModel] = useState<string>(() => {
    const saved = localStorage.getItem('ai_model')
    const currentProvider = (localStorage.getItem('ai_provider') as Provider) || 'gemini'
    return saved && providerModels[currentProvider]?.includes(saved)
      ? saved
      : providerModels[currentProvider]?.[0] || 'gemini-3.5-flash'
  })
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('ai_apikey') || ''
  })
  const [serverConfig, setServerConfig] = useState<{
    geminiConfigured?: boolean
    chatgptConfigured?: boolean
    claudeConfigured?: boolean
  }>({})

  const [builder, setBuilder] = useState<BuilderState>(initialBuilder)
  const [exampleText, setExampleText] = useState('')
  const [examples, setExamples] = useState<string[]>(starterExamples)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [error, setError] = useState('')

  // Template category filter
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null)

  // Mockup AI prompt state
  const [isGeneratingMockup, setIsGeneratingMockup] = useState(false)
  const [mockupAiResult, setMockupAiResult] = useState<string>('')
  const [mockupCustomArtworkUrl, setMockupCustomArtworkUrl] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => setServerConfig(data))
      .catch(() => {})
  }, [])

  useEffect(() => {
    localStorage.setItem('ai_provider', provider)
  }, [provider])

  useEffect(() => {
    localStorage.setItem('ai_model', model)
  }, [model])

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('ai_apikey', apiKey)
    }
  }, [apiKey])

  const hasServerKey = useMemo(() => {
    if (provider === 'gemini') return Boolean(serverConfig.geminiConfigured)
    if (provider === 'chatgpt') return Boolean(serverConfig.chatgptConfigured)
    if (provider === 'claude') return Boolean(serverConfig.claudeConfigured)
    return false
  }, [provider, serverConfig])

  const providerLabel = useMemo(() => {
    if (provider === 'chatgpt') return 'ChatGPT (OpenAI)'
    if (provider === 'claude') return 'Claude (Anthropic)'
    return 'Gemini (Google)'
  }, [provider])

  function updateBuilder<K extends keyof BuilderState>(field: K, value: BuilderState[K]) {
    setBuilder((current) => ({ ...current, [field]: value }))
  }

  function handleProviderChange(next: Provider) {
    setProvider(next)
    setModel(providerModels[next][0])
  }

  function handleApplyVisionToBuilder(breakdown: ImagePromptBreakdown, prompt: string) {
    setBuilder((current) => ({
      ...current,
      concept: breakdown.concept || current.concept,
      subject: breakdown.subject || current.subject,
      style: breakdown.style || current.style,
      mood: breakdown.mood || current.mood,
      camera: breakdown.camera || current.camera,
      lighting: breakdown.lighting || current.lighting,
      palette: breakdown.palette || current.palette,
      setting: breakdown.setting || current.setting,
      details: breakdown.details || current.details,
      negativePrompt: breakdown.negativePrompt || current.negativePrompt,
      aspectRatio: breakdown.aspectRatio || current.aspectRatio,
    }))
    if (prompt) {
      setGeneratedPrompt(prompt)
    }
  }

  function handleApplyVisionToMockup(imageUrl: string, prompt: string, concept: string) {
    setMockupCustomArtworkUrl(imageUrl)
    if (prompt) setGeneratedPrompt(prompt)
    if (concept) {
      setBuilder((c) => ({ ...c, concept }))
    }
  }

  function handleAddExamplePrompt(prompt: string) {
    if (!prompt.trim()) return
    setExamples((current) => [prompt.trim(), ...current])
  }

  function handleApplyTemplate(template: IllustratorTemplate) {
    setActiveTemplateId(template.id)
    setBuilder((current) => ({
      ...current,
      ...template.preset,
      outputLanguage: current.outputLanguage,
    }))

    if (!examples.includes(template.samplePrompt)) {
      setExamples((current) => [template.samplePrompt, ...current])
    }
  }

  function addExampleFromText() {
    const cleaned = exampleText.trim()
    if (!cleaned) return

    setExamples((current) => [cleaned, ...current])
    setExampleText('')
  }

  async function handleExampleFileUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const raw = await file.text()
    let extracted: string[] = []

    try {
      const parsed = JSON.parse(raw) as unknown
      if (Array.isArray(parsed)) {
        extracted = parsed.filter((item): item is string => typeof item === 'string')
      } else if (
        typeof parsed === 'object' &&
        parsed !== null &&
        Array.isArray((parsed as { prompts?: unknown }).prompts)
      ) {
        extracted = (parsed as { prompts: unknown[] }).prompts.filter(
          (item): item is string => typeof item === 'string',
        )
      }
    } catch {
      extracted = raw
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
    }

    if (extracted.length > 0) {
      setExamples((current) => [...extracted, ...current])
      setError('')
    } else {
      setError('File contoh tidak berisi prompt yang valid.')
    }

    event.target.value = ''
  }

  function buildLocalDraftPrompt() {
    const parts = [
      builder.concept && `Concept: ${builder.concept}`,
      builder.subject && `Subject: ${builder.subject}`,
      builder.style && `Visual style: ${builder.style}`,
      builder.mood && `Mood & Atmosphere: ${builder.mood}`,
      builder.camera && `Framing & Camera: ${builder.camera}`,
      builder.lighting && `Lighting: ${builder.lighting}`,
      builder.palette && `Color palette: ${builder.palette}`,
      builder.setting && `Environment & Setting: ${builder.setting}`,
      builder.details && `Linework & Details: ${builder.details}`,
      builder.negativePrompt && `--no ${builder.negativePrompt}`,
      `--ar ${builder.aspectRatio}`,
    ].filter(Boolean)

    return parts.join(', ')
  }

  async function generatePrompt(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!builder.concept.trim() && !builder.subject.trim()) {
      setError('Isi minimal konsep atau subjek gambar terlebih dahulu.')
      return
    }

    if (!apiKey.trim() && !hasServerKey) {
      setError(`Masukkan API key untuk ${providerLabel}.`)
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          model,
          apiKey,
          mode: 'illustrator',
          outputLanguage: builder.outputLanguage,
          builder,
          localDraftPrompt: buildLocalDraftPrompt(),
          examples,
        }),
      })

      const data = (await response.json()) as { prompt?: string; error?: string }

      if (!response.ok) {
        throw new Error(data.error ?? 'Gagal membuat prompt.')
      }

      if (!data.prompt) {
        throw new Error('Respons model tidak berisi prompt.')
      }

      setGeneratedPrompt(data.prompt)
    } catch (issue) {
      const message = issue instanceof Error ? issue.message : 'Terjadi kesalahan.'
      setError(message)
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleGenerateMockupAiPrompt(config: {
    product: string
    color: string
    scene: string
    camera: string
    lighting: string
    artworkDescription: string
    aspectRatio: string
  }) {
    setError('')

    if (!apiKey.trim() && !hasServerKey) {
      setError(`Masukkan API key untuk ${providerLabel} pada panel konfigurasi AI terlebih dahulu.`)
      setActiveTab('prompt-builder')
      return
    }

    setIsGeneratingMockup(true)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          model,
          apiKey,
          mode: 'mockup',
          outputLanguage: builder.outputLanguage,
          mockupConfig: config,
          examples,
        }),
      })

      const data = (await response.json()) as { prompt?: string; error?: string }

      if (!response.ok) {
        throw new Error(data.error ?? 'Gagal membuat prompt mockup.')
      }

      if (!data.prompt) {
        throw new Error('Respons model kosong.')
      }

      setMockupAiResult(data.prompt)
    } catch (issue) {
      const message = issue instanceof Error ? issue.message : 'Terjadi kesalahan generate mockup.'
      setError(message)
    } finally {
      setIsGeneratingMockup(false)
    }
  }

  async function copyPrompt() {
    if (!generatedPrompt.trim()) return
    await navigator.clipboard.writeText(generatedPrompt)
  }

  const categories = ['All', 'Vector', 'Anime/Manga', 'Hand-Drawn', 'Retro', 'Merch', 'Concept']

  const filteredTemplates = useMemo(() => {
    if (selectedCategory === 'All') return illustratorTemplates
    return illustratorTemplates.filter((t) => t.category === selectedCategory)
  }, [selectedCategory])

  return (
    <main className="page-shell">
      <header className="hero-block">
        <div className="hero-title-row">
          <div>
            <span className="brand-badge">⚡ AI Creative Studio</span>
            <h1>AI Prompt & Mockup Studio</h1>
            <p className="lead">
              Rancang prompt ilustrasi master, ekstrak otomatis dari gambar contoh dengan Gemini AI, dan terapkan langsung ke mockup produk nyata.
            </p>
          </div>
        </div>

        <div className="tab-navigation">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'prompt-builder' ? 'active' : ''}`}
            onClick={() => setActiveTab('prompt-builder')}
          >
            🎨 1. Studio Prompt
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'image-to-prompt' ? 'active' : ''}`}
            onClick={() => setActiveTab('image-to-prompt')}
          >
            📸 2. Upload Gambar → Prompt
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'mockup-studio' ? 'active' : ''}`}
            onClick={() => setActiveTab('mockup-studio')}
          >
            👕 3. Mockup Produk
          </button>
        </div>
      </header>

      {error && (
        <div className="global-error-banner">
          <span>⚠️ {error}</span>
          <button type="button" onClick={() => setError('')}>
            ✕
          </button>
        </div>
      )}

      {activeTab === 'prompt-builder' && (
        <>
          <section className="templates-section">
            <div className="templates-header">
              <div>
                <h2>Template Gaya Ilustrator Siap Pakai</h2>
                <p>Klik salah satu template model ilustrasi untuk mengisi otomatis gaya, kamera, mood, dan lighting.</p>
              </div>
              <div className="category-filter-chips">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`cat-chip ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="template-cards-slider">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`template-card ${activeTemplateId === template.id ? 'active' : ''}`}
                  onClick={() => handleApplyTemplate(template)}
                >
                  <div className="template-card-preview-box">
                    {template.preview}
                    <span className="template-badge">{template.badge}</span>
                  </div>
                  <div className="template-card-body">
                    <h3>{template.name}</h3>
                    <p>{template.description}</p>
                    <button type="button" className="apply-template-btn">
                      {activeTemplateId === template.id ? '✓ Aktif' : 'Terapkan Template'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid-layout">
            <form className="panel" onSubmit={generatePrompt}>
              <h2>1) Konfigurasi AI Provider</h2>

              <div className="control-row triple">
                <label>
                  Provider
                  <select
                    value={provider}
                    onChange={(event) => handleProviderChange(event.target.value as Provider)}
                  >
                    <option value="chatgpt">ChatGPT (OpenAI)</option>
                    <option value="claude">Claude (Anthropic)</option>
                    <option value="gemini">Gemini (Google)</option>
                  </select>
                </label>

                <label>
                  Model
                  <select value={model} onChange={(event) => setModel(event.target.value)}>
                    {providerModels[provider].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Bahasa Prompt
                  <select
                    value={builder.outputLanguage}
                    onChange={(event) =>
                      updateBuilder('outputLanguage', event.target.value as BuilderState['outputLanguage'])
                    }
                  >
                    <option value="en">English (Direkomendasikan - Kualitas Gambar Terbaik & Eksklusif)</option>
                    <option value="id">Indonesia (dengan prompt English)</option>
                  </select>
                </label>
              </div>

              <label>
                API Key
                <input
                  type="password"
                  value={apiKey}
                  onChange={(event) => setApiKey(event.target.value)}
                  placeholder={`Masukkan API key ${providerLabel}`}
                  autoComplete="off"
                />
              </label>

              <h2>2) Brief Gambar Ilustrator</h2>

              <div className="control-row dual">
                <label>
                  Konsep Utama
                  <input
                    value={builder.concept}
                    onChange={(event) => updateBuilder('concept', event.target.value)}
                    placeholder="contoh: Cyberpunk cat samurai in neon alley"
                  />
                </label>
                <label>
                  Subjek
                  <input
                    value={builder.subject}
                    onChange={(event) => updateBuilder('subject', event.target.value)}
                    placeholder="contoh: Anthropomorphic ginger cat with mini katana"
                  />
                </label>
              </div>

              <div className="control-row dual">
                <label>
                  Gaya Ilustrasi / Visual
                  <input
                    value={builder.style}
                    onChange={(event) => updateBuilder('style', event.target.value)}
                    placeholder="Flat vector, cel-shading anime, watercolor gouache, retro comic"
                  />
                </label>
                <label>
                  Mood & Atmosfer
                  <input
                    value={builder.mood}
                    onChange={(event) => updateBuilder('mood', event.target.value)}
                    placeholder="Energetic, cozy, dystopian, whimsical, majestic"
                  />
                </label>
              </div>

              <div className="control-row triple">
                <label>
                  Komposisi / Framing
                  <input
                    value={builder.camera}
                    onChange={(event) => updateBuilder('camera', event.target.value)}
                    placeholder="Centered emblem, wide angle, dynamic close-up"
                  />
                </label>

                <label>
                  Lighting / Bayangan
                  <input
                    value={builder.lighting}
                    onChange={(event) => updateBuilder('lighting', event.target.value)}
                    placeholder="Neon rim light, soft ambient glow, flat solid"
                  />
                </label>

                <label>
                  Aspect Ratio
                  <select
                    value={builder.aspectRatio}
                    onChange={(event) =>
                      updateBuilder('aspectRatio', event.target.value as BuilderState['aspectRatio'])
                    }
                  >
                    <option value="1:1">1:1 (Persegi - Kaos/Stiker/Icon)</option>
                    <option value="3:2">3:2 (Horizontal Foto)</option>
                    <option value="4:5">4:5 (Vertikal Instagram)</option>
                    <option value="16:9">16:9 (Landscape Wallpaper)</option>
                    <option value="9:16">9:16 (Story / Banner)</option>
                  </select>
                </label>
              </div>

              <div className="control-row dual">
                <label>
                  Palet Warna
                  <input
                    value={builder.palette}
                    onChange={(event) => updateBuilder('palette', event.target.value)}
                    placeholder="Signal orange, deep cyan, black, warm gold"
                  />
                </label>

                <label>
                  Setting Latar Belakang
                  <input
                    value={builder.setting}
                    onChange={(event) => updateBuilder('setting', event.target.value)}
                    placeholder="Isolated white background, neon alley, paper texture"
                  />
                </label>
              </div>

              <label>
                Detail Khusus / Linework
                <textarea
                  value={builder.details}
                  onChange={(event) => updateBuilder('details', event.target.value)}
                  rows={2}
                  placeholder="Ketebalan garis (bold outline), arsiran silang, aksen stiker die-cut..."
                />
              </label>

              <label>
                Negative Prompt (Elemen yang dihindari)
                <textarea
                  value={builder.negativePrompt}
                  onChange={(event) => updateBuilder('negativePrompt', event.target.value)}
                  rows={2}
                  placeholder="photograph, blurry, deformed anatomy, lowres, ugly textures..."
                />
              </label>

              <h2>3) Lampirkan Contoh Prompt Referensi</h2>

              <label>
                Tulis / Tempel Contoh Prompt
                <textarea
                  value={exampleText}
                  onChange={(event) => setExampleText(event.target.value)}
                  rows={2}
                  placeholder="Tempelkan contoh prompt favorit Anda untuk referensi gaya"
                />
              </label>

              <div className="control-row actions-row">
                <button type="button" className="ghost" onClick={addExampleFromText}>
                  + Tambah Contoh Teks
                </button>
                <label className="file-upload">
                  📁 Import File .txt / .json
                  <input
                    type="file"
                    accept=".txt,.json,application/json,text/plain"
                    onChange={handleExampleFileUpload}
                  />
                </label>
                <button
                  type="button"
                  className="ghost image-cta-btn"
                  onClick={() => setActiveTab('image-to-prompt')}
                >
                  📸 Upload Gambar Contoh
                </button>
              </div>

              <button type="submit" className="primary" disabled={isGenerating}>
                {isGenerating ? 'Sedang Menyusun Prompt...' : '✨ Generate Prompt Ilustrasi'}
              </button>
            </form>

            <aside className="panel output-panel">
              <h2>Draft Prompt Lokal (Otomatis)</h2>
              <p className="draft-preview">{buildLocalDraftPrompt() || 'Isi brief untuk melihat draft otomatis.'}</p>

              <div className="output-head">
                <h2>Prompt Final dari AI</h2>
                <div className="action-buttons-group">
                  <button type="button" className="ghost" onClick={copyPrompt}>
                    Salin
                  </button>
                  {generatedPrompt && (
                    <button
                      type="button"
                      className="primary-sm highlight-action"
                      onClick={() => setActiveTab('mockup-studio')}
                    >
                      👕 Jadikan Mockup
                    </button>
                  )}
                </div>
              </div>

              <textarea
                className="result-box"
                value={generatedPrompt}
                readOnly
                placeholder="Hasil prompt AI akan muncul di sini setelah Anda menekan tombol Generate."
                rows={9}
              />

              <h2>Daftar Contoh Referensi ({examples.length})</h2>
              <div className="example-list">
                {examples.map((example, index) => (
                  <article key={`${example.slice(0, 24)}-${index}`}>
                    <p>{example}</p>
                  </article>
                ))}
              </div>
            </aside>
          </section>
        </>
      )}

      {activeTab === 'image-to-prompt' && (
        <ImageToPromptStudio
          provider={provider}
          model={model}
          apiKey={apiKey}
          providerLabel={providerLabel}
          outputLanguage={builder.outputLanguage}
          availableModels={providerModels[provider] || []}
          hasServerKey={hasServerKey}
          onProviderChange={handleProviderChange}
          onModelChange={setModel}
          onApiKeyChange={setApiKey}
          onApplyToBuilder={handleApplyVisionToBuilder}
          onApplyToMockup={handleApplyVisionToMockup}
          onAddExamplePrompt={handleAddExamplePrompt}
          onNavigateTab={setActiveTab}
        />
      )}

      {activeTab === 'mockup-studio' && (
        <MockupStudio
          currentPrompt={generatedPrompt}
          currentConcept={builder.concept || builder.subject}
          initialCustomArtworkUrl={mockupCustomArtworkUrl}
          onGenerateMockupAiPrompt={handleGenerateMockupAiPrompt}
          isGeneratingMockup={isGeneratingMockup}
          mockupAiResult={mockupAiResult}
        />
      )}
    </main>
  )
}

export default App
