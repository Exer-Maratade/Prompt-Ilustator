import { useMemo, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { mockupColors, mockupColorCategories, createCustomMockupColor } from '../data/mockupData'
import type { MockupColor, MockupProductType, MockupColorCategory } from '../data/mockupData'

const sampleArtworks = [
  {
    id: 'tiger',
    name: 'Cyber Tiger Badge',
    svg: (
      <svg viewBox="0 0 160 160" width="100%" height="100%">
        <circle cx="80" cy="80" r="74" fill="#0f172a" stroke="#ff7675" strokeWidth="5" />
        <circle cx="80" cy="80" r="66" fill="none" stroke="#fab1a0" strokeDasharray="5,4" strokeWidth="2" />
        <path d="M40 56 L64 35 L70 56 Z M120 56 L96 35 L90 56 Z" fill="#e17055" />
        <path d="M50 70 Q80 40 110 70 Q118 105 80 128 Q42 105 50 70 Z" fill="#ff7675" />
        <path d="M60 82 L70 86 L60 90 Z M100 82 L90 86 L100 90 Z" fill="#2d3436" />
        <path d="M72 100 Q80 112 88 100 Q80 106 72 100 Z" fill="#ffeaa7" />
        <text x="80" y="146" textAnchor="middle" fill="#ffeaa7" fontSize="11" fontWeight="bold" letterSpacing="2">
          TOKYO • 2088
        </text>
      </svg>
    ),
    description: 'Streetwear cyber tiger emblem with kanji badge aesthetic',
  },
  {
    id: 'retro-wave',
    name: 'Retro Sun & Wave',
    svg: (
      <svg viewBox="0 0 160 160" width="100%" height="100%">
        <rect x="6" y="6" width="148" height="148" rx="28" fill="#1e272e" />
        <circle cx="80" cy="68" r="42" fill="#ff5e57" />
        <rect x="30" y="58" width="100" height="4" fill="#1e272e" />
        <rect x="30" y="66" width="100" height="4" fill="#1e272e" />
        <rect x="30" y="74" width="100" height="5" fill="#1e272e" />
        <path d="M20 118 Q50 92 80 118 T140 118 L140 144 L20 144 Z" fill="#0be881" opacity="0.9" />
        <path d="M20 128 Q50 106 80 128 T140 128 L140 144 L20 144 Z" fill="#4bcffa" />
        <text x="80" y="32" textAnchor="middle" fill="#ffd32a" fontSize="10" fontWeight="bold" letterSpacing="3">
          PACIFIC SURF
        </text>
      </svg>
    ),
    description: 'Vintage 80s California wave and sunset badge',
  },
  {
    id: 'botanical',
    name: 'Botanical Moon',
    svg: (
      <svg viewBox="0 0 160 160" width="100%" height="100%">
        <circle cx="80" cy="80" r="74" fill="#fdfbf7" stroke="#2d3436" strokeWidth="4" />
        <path d="M80 20 A60 60 0 0 0 80 140 A45 45 0 0 1 80 20 Z" fill="#e17055" />
        <path d="M68 135 C65 95 90 70 115 50 C95 85 92 110 68 135 Z" fill="#00b894" />
        <path d="M84 100 C70 90 65 72 75 60 C80 75 95 85 84 100 Z" fill="#2d3436" />
        <circle cx="118" cy="40" r="3" fill="#ffeaa7" />
        <circle cx="126" cy="56" r="2" fill="#ffeaa7" />
        <circle cx="48" cy="98" r="2" fill="#2d3436" />
        <text x="80" y="150" textAnchor="middle" fill="#2d3436" fontSize="9" fontWeight="bold" letterSpacing="2">
          FLORA & FAUNA
        </text>
      </svg>
    ),
    description: 'Minimalist organic botanical moon line art emblem',
  },
  {
    id: 'astronaut',
    name: 'Cosmic Voyager',
    svg: (
      <svg viewBox="0 0 160 160" width="100%" height="100%">
        <circle cx="80" cy="80" r="72" fill="#0c1017" stroke="#0984e3" strokeWidth="4" />
        <circle cx="80" cy="80" r="62" fill="none" stroke="#74b9ff" strokeWidth="1.5" strokeDasharray="3,3" />
        <ellipse cx="80" cy="74" rx="28" ry="32" fill="#dfe6e9" />
        <ellipse cx="80" cy="74" rx="21" ry="17" fill="#0984e3" />
        <ellipse cx="76" cy="71" rx="6" ry="4" fill="#81ecec" />
        <path d="M52 74 Q42 80 44 94 Q48 108 58 106" fill="none" stroke="#dfe6e9" strokeWidth="6" strokeLinecap="round" />
        <path d="M108 74 Q118 80 116 94 Q112 108 102 106" fill="none" stroke="#dfe6e9" strokeWidth="6" strokeLinecap="round" />
        <path d="M58 106 Q80 120 102 106 L98 126 Q80 132 62 126 Z" fill="#b2bec3" />
        <text x="80" y="146" textAnchor="middle" fill="#74b9ff" fontSize="9" fontWeight="bold" letterSpacing="2">
          DEEP SPACE • LABS
        </text>
      </svg>
    ),
    description: 'Vector astronaut exploration patch with deep blue contrast',
  },
]

type MockupStudioProps = {
  currentPrompt: string
  currentConcept: string
  initialCustomArtworkUrl?: string | null
  onApplyPromptToBrief?: (prompt: string) => void
  onGenerateMockupAiPrompt: (config: {
    product: string
    color: string
    scene: string
    camera: string
    lighting: string
    artworkDescription: string
    aspectRatio: string
  }) => Promise<void>
  isGeneratingMockup: boolean
  mockupAiResult: string
}

export type TshirtView = 'front' | 'back' | 'left-sleeve' | 'right-sleeve'
export type TshirtSleeve = 'short' | 'long'

export function MockupStudio({
  currentPrompt,
  currentConcept,
  initialCustomArtworkUrl,
  onGenerateMockupAiPrompt,
  isGeneratingMockup,
  mockupAiResult,
}: MockupStudioProps) {
  const [product, setProduct] = useState<MockupProductType>('tshirt')
  const [color, setColor] = useState<MockupColor>(mockupColors[6]) // Onyx black default
  const [selectedColorCategory, setSelectedColorCategory] = useState<MockupColorCategory>('all')
  const [customHex, setCustomHex] = useState<string>(mockupColors[6].hex)
  const [tshirtView, setTshirtView] = useState<TshirtView>('front')
  const [tshirtSleeve, setTshirtSleeve] = useState<TshirtSleeve>('short')
  const [showPrintZone, setShowPrintZone] = useState<boolean>(true)
  const [selectedArtworkId, setSelectedArtworkId] = useState<string>(
    initialCustomArtworkUrl ? 'custom' : 'tiger',
  )
  const [customArtworkUrl, setCustomArtworkUrl] = useState<string | null>(
    initialCustomArtworkUrl || null,
  )
  const [artworkScale, setArtworkScale] = useState<number>(75)
  const [artworkOffsetY, setArtworkOffsetY] = useState<number>(0)
  const [artworkOffsetX, setArtworkOffsetX] = useState<number>(0)
  const [blendMode, setBlendMode] = useState<'normal' | 'multiply' | 'overlay'>('normal')
  const [sceneSetting, setSceneSetting] = useState<string>('Studio Minimalist dengan bayangan lembut')
  const [copyStatus, setCopyStatus] = useState<string>('')
  const [prevInitialArtworkUrl, setPrevInitialArtworkUrl] = useState(initialCustomArtworkUrl)

  if (initialCustomArtworkUrl !== prevInitialArtworkUrl) {
    setPrevInitialArtworkUrl(initialCustomArtworkUrl)
    if (initialCustomArtworkUrl) {
      setCustomArtworkUrl(initialCustomArtworkUrl)
      setSelectedArtworkId('custom')
    }
  }

  const mockupRef = useRef<SVGSVGElement>(null)

  const filteredColors = useMemo(() => {
    if (selectedColorCategory === 'all') return mockupColors
    return mockupColors.filter((c) => c.category === selectedColorCategory)
  }, [selectedColorCategory])

  function handleCustomColorChange(newHex: string) {
    const formatted = newHex.startsWith('#') ? newHex : `#${newHex}`
    setCustomHex(formatted)
    if (/^#([0-9A-Fa-f]{3}){1,2}$/.test(formatted)) {
      const customCol = createCustomMockupColor(formatted)
      setColor(customCol)
    }
  }

  const productName = useMemo(() => {
    switch (product) {
      case 'tshirt':
        return tshirtSleeve === 'long'
          ? 'Kaos Oblong Lengan Panjang (Long-Sleeve Crewneck T-Shirt)'
          : 'Kaos Oblong Lengan Pendek (Classic Crewneck T-Shirt)'
      case 'totebag':
        return 'Tas Kanvas (Heavyweight Canvas Tote Bag)'
      case 'hoodie':
        return 'Hoodie Pullover (Streetwear Fleece Hoodie)'
      case 'mug':
        return 'Mug Keramik (Glossy Ceramic Coffee Mug)'
      case 'cap':
        return 'Topi Baseball (6-Panel Curved Brim Dad Cap)'
      case 'poster':
        return 'Bingkai Poster (Minimalist Wall Gallery Frame)'
    }
  }, [product, tshirtSleeve])

  const viewPlacementPrompt = useMemo(() => {
    if (product !== 'tshirt') return ''
    switch (tshirtView) {
      case 'front':
        return 'front view showcasing center chest print graphic'
      case 'back':
        return 'back view showcasing large upper back graphic print and clean collar stitching'
      case 'left-sleeve':
        return 'side profile angle focusing on the left sleeve printed badge artwork'
      case 'right-sleeve':
        return 'side profile angle focusing on the right sleeve printed badge artwork'
    }
  }, [product, tshirtView])

  // Handle user custom artwork upload
  function handleArtworkUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCustomArtworkUrl(reader.result)
        setSelectedArtworkId('custom')
      }
    }
    reader.readAsDataURL(file)
  }

  // Generate constructed local prompt for mockup
  const localMockupPrompt = useMemo(() => {
    const artworkDesc =
      currentPrompt.trim() || currentConcept.trim() || 'streetwear graphic badge illustration'
    const viewDetail = viewPlacementPrompt ? `, ${viewPlacementPrompt}` : ''

    return `Commercial product photo of a premium ${color.name.toLowerCase()} (${color.hex}) ${productName}${viewDetail}, displayed in a ${sceneSetting.toLowerCase()}, featuring the graphic artwork: "${artworkDesc}". Authentic cotton t-shirt fabric drape, realistic screen print ink texture, soft ambient shadows, studio lighting, professional 85mm lens, 8k resolution photorealistic catalog mockup.`
  }, [color.name, color.hex, productName, viewPlacementPrompt, sceneSetting, currentPrompt, currentConcept])

  // Download high-resolution PNG of the current mockup
  function downloadMockupImage() {
    const svgElement = mockupRef.current
    if (!svgElement) return

    // Clone element so print guide box is excluded in downloaded PNG
    const clone = svgElement.cloneNode(true) as SVGSVGElement
    const guideGroup = clone.querySelector('.print-guide-group')
    if (guideGroup) guideGroup.remove()

    const serializer = new XMLSerializer()
    const svgString = serializer.serializeToString(clone)
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    const URLObject = window.URL || window.webkitURL || window
    const blobURL = URLObject.createObjectURL(svgBlob)

    const image = new Image()
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 900
      canvas.height = 900
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // draw background
      ctx.fillStyle = '#f0f3f8'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
      const pngData = canvas.toDataURL('image/png')

      const link = document.createElement('a')
      const viewTag = product === 'tshirt' ? `${tshirtSleeve}-${tshirtView}-` : ''
      link.download = `mockup-${product}-${viewTag}${color.id}.png`
      link.href = pngData
      link.click()

      URLObject.revokeObjectURL(blobURL)
    }
    image.src = blobURL
  }

  async function copyToClipboard(text: string, label: string) {
    if (!text) return
    await navigator.clipboard.writeText(text)
    setCopyStatus(label)
    setTimeout(() => setCopyStatus(''), 2500)
  }

  function handleTriggerAiMockup() {
    let cameraAngle = 'Front view eye-level, 85mm lens, f/2.8'
    if (product === 'tshirt') {
      if (tshirtView === 'back') cameraAngle = 'Back view eye-level, 85mm lens, f/2.8, showcasing back artwork'
      else if (tshirtView === 'left-sleeve') cameraAngle = 'Angled close-up shot focused on left sleeve graphic, 85mm macro lens, f/2.8'
      else if (tshirtView === 'right-sleeve') cameraAngle = 'Angled close-up shot focused on right sleeve graphic, 85mm macro lens, f/2.8'
    }

    onGenerateMockupAiPrompt({
      product: `${productName}${viewPlacementPrompt ? ` (${viewPlacementPrompt})` : ''}`,
      color: `${color.name} (${color.hex})`,
      scene: sceneSetting,
      camera: cameraAngle,
      lighting: 'Studio softbox with soft ambient bounce light',
      artworkDescription: currentPrompt.trim() || currentConcept.trim() || 'Detailed graphic vector illustration',
      aspectRatio: '1:1',
    })
  }

  const artworkTransform = useMemo(() => {
    if (product !== 'tshirt') {
      return {
        x: 250 + artworkOffsetX,
        y:
          (product === 'totebag'
            ? 295
            : product === 'hoodie'
            ? 260
            : product === 'mug'
            ? 265
            : product === 'cap'
            ? 255
            : 245) + artworkOffsetY,
        scale: artworkScale / 100,
        clip:
          product === 'totebag'
            ? 'url(#totebagPrintArea)'
            : product === 'hoodie'
            ? 'url(#hoodiePrintArea)'
            : product === 'mug'
            ? 'url(#mugPrintArea)'
            : product === 'cap'
            ? 'url(#capPrintArea)'
            : 'url(#posterPrintArea)',
      }
    }

    if (tshirtView === 'front') {
      return {
        x: 250 + artworkOffsetX,
        y: 250 + artworkOffsetY,
        scale: artworkScale / 100,
        clip: 'url(#tshirtFrontPrintArea)',
      }
    }
    if (tshirtView === 'back') {
      return {
        x: 250 + artworkOffsetX,
        y: 240 + artworkOffsetY,
        scale: artworkScale / 100,
        clip: 'url(#tshirtBackPrintArea)',
      }
    }
    if (tshirtView === 'left-sleeve') {
      return {
        x: (tshirtSleeve === 'short' ? 122 : 124) + artworkOffsetX,
        y: (tshirtSleeve === 'short' ? 175 : 235) + artworkOffsetY,
        scale: (artworkScale / 100) * 0.52,
        clip: tshirtSleeve === 'short' ? 'url(#tshirtLeftShortPrintArea)' : 'url(#tshirtLeftLongPrintArea)',
      }
    }
    // right sleeve
    return {
      x: (tshirtSleeve === 'short' ? 378 : 376) + artworkOffsetX,
      y: (tshirtSleeve === 'short' ? 175 : 235) + artworkOffsetY,
      scale: (artworkScale / 100) * 0.52,
      clip: tshirtSleeve === 'short' ? 'url(#tshirtRightShortPrintArea)' : 'url(#tshirtRightLongPrintArea)',
    }
  }, [product, tshirtView, tshirtSleeve, artworkOffsetX, artworkOffsetY, artworkScale])

  const activeArtwork = sampleArtworks.find((item) => item.id === selectedArtworkId)

  return (
    <section className="mockup-studio-container">
      <div className="mockup-header">
        <div>
          <span className="badge-pill">Mockup Studio</span>
          <h2>Koleksi Desain Mockup Produk</h2>
          <p>
            Terapkan ilustrasi atau prompt kamu langsung ke produk nyata seperti Kaos, Tas Kanvas, Hoodie,
            Mug, Topi, dan Poster dengan kontrol warna, posisi, dan ekspor instan.
          </p>
        </div>
        <div className="mockup-quick-actions">
          <button type="button" className="ghost" onClick={downloadMockupImage}>
            📥 Download PNG Mockup
          </button>
        </div>
      </div>

      <div className="mockup-grid">
        {/* Left column: Interactive Visual Canvas */}
        <div className="mockup-canvas-card">
          <div className="product-selector-bar">
            <button
              type="button"
              className={`product-pill ${product === 'tshirt' ? 'active' : ''}`}
              onClick={() => setProduct('tshirt')}
            >
              👕 Kaos Oblong
            </button>
            <button
              type="button"
              className={`product-pill ${product === 'totebag' ? 'active' : ''}`}
              onClick={() => setProduct('totebag')}
            >
              👜 Tas Kanvas
            </button>
            <button
              type="button"
              className={`product-pill ${product === 'hoodie' ? 'active' : ''}`}
              onClick={() => setProduct('hoodie')}
            >
              🧥 Hoodie
            </button>
            <button
              type="button"
              className={`product-pill ${product === 'mug' ? 'active' : ''}`}
              onClick={() => setProduct('mug')}
            >
              ☕ Mug
            </button>
            <button
              type="button"
              className={`product-pill ${product === 'cap' ? 'active' : ''}`}
              onClick={() => setProduct('cap')}
            >
              🧢 Topi
            </button>
            <button
              type="button"
              className={`product-pill ${product === 'poster' ? 'active' : ''}`}
              onClick={() => setProduct('poster')}
            >
              🖼️ Poster
            </button>
          </div>

          {/* T-Shirt Specific Customization: Sleeve & Placement View */}
          {product === 'tshirt' && (
            <div className="tshirt-options-panel">
              {/* Sleeve Type */}
              <div className="tshirt-option-row">
                <span className="tshirt-opt-label">Model Lengan:</span>
                <div className="tshirt-btn-group">
                  <button
                    type="button"
                    className={`tshirt-opt-btn ${tshirtSleeve === 'short' ? 'active' : ''}`}
                    onClick={() => setTshirtSleeve('short')}
                  >
                    👕 Lengan Pendek
                  </button>
                  <button
                    type="button"
                    className={`tshirt-opt-btn ${tshirtSleeve === 'long' ? 'active' : ''}`}
                    onClick={() => setTshirtSleeve('long')}
                  >
                    🧥 Lengan Panjang
                  </button>
                </div>
              </div>

              {/* View / Print Placement */}
              <div className="tshirt-option-row">
                <span className="tshirt-opt-label">Posisi Sablon:</span>
                <div className="tshirt-btn-group wrap-group">
                  <button
                    type="button"
                    className={`tshirt-opt-btn ${tshirtView === 'front' ? 'active' : ''}`}
                    onClick={() => setTshirtView('front')}
                  >
                    Depan (Dada)
                  </button>
                  <button
                    type="button"
                    className={`tshirt-opt-btn ${tshirtView === 'back' ? 'active' : ''}`}
                    onClick={() => setTshirtView('back')}
                  >
                    Belakang (Punggung)
                  </button>
                  <button
                    type="button"
                    className={`tshirt-opt-btn ${tshirtView === 'left-sleeve' ? 'active' : ''}`}
                    onClick={() => setTshirtView('left-sleeve')}
                  >
                    Lengan Kiri
                  </button>
                  <button
                    type="button"
                    className={`tshirt-opt-btn ${tshirtView === 'right-sleeve' ? 'active' : ''}`}
                    onClick={() => setTshirtView('right-sleeve')}
                  >
                    Lengan Kanan
                  </button>
                </div>

                <button
                  type="button"
                  className={`toggle-print-zone-btn ${showPrintZone ? 'active' : ''}`}
                  onClick={() => setShowPrintZone(!showPrintZone)}
                  title="Tampilkan garis bantu area sablon"
                >
                  {showPrintZone ? '👁️ Garis Sablon: ON' : '👁️ Garis Sablon: OFF'}
                </button>
              </div>
            </div>
          )}

          <div className="canvas-wrapper">
            {/* Realistic Product Vector SVG */}
            <svg
              ref={mockupRef}
              viewBox="0 0 500 500"
              className="mockup-svg-viewport"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Fabric gradient for realistic depth */}
                <linearGradient id="fabricShading" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#000000" stopOpacity="0.2" />
                  <stop offset="30%" stopColor="#000000" stopOpacity="0.05" />
                  <stop offset="50%" stopColor="#ffffff" stopOpacity="0.12" />
                  <stop offset="70%" stopColor="#000000" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.22" />
                </linearGradient>

                <linearGradient id="verticalWrinkle" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.16" />
                  <stop offset="35%" stopColor="#000000" stopOpacity="0.0" />
                  <stop offset="85%" stopColor="#000000" stopOpacity="0.14" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
                </linearGradient>

                <filter id="softShadow" x="-10%" y="-10%" width="120%" height="130%">
                  <feDropShadow dx="0" dy="16" stdDeviation="16" floodColor="#0f172a" floodOpacity="0.22" />
                </filter>

                {/* Print area clip-paths for t-shirt views */}
                <clipPath id="tshirtFrontPrintArea">
                  <rect x="170" y="145" width="160" height="230" rx="6" />
                </clipPath>

                <clipPath id="tshirtBackPrintArea">
                  <rect x="170" y="125" width="160" height="250" rx="6" />
                </clipPath>

                <clipPath id="tshirtLeftShortPrintArea">
                  <rect x="85" y="135" width="80" height="85" rx="6" />
                </clipPath>

                <clipPath id="tshirtLeftLongPrintArea">
                  <rect x="85" y="165" width="80" height="150" rx="6" />
                </clipPath>

                <clipPath id="tshirtRightShortPrintArea">
                  <rect x="335" y="135" width="80" height="85" rx="6" />
                </clipPath>

                <clipPath id="tshirtRightLongPrintArea">
                  <rect x="335" y="165" width="80" height="150" rx="6" />
                </clipPath>

                {/* Other products clip-paths */}
                <clipPath id="totebagPrintArea">
                  <rect x="170" y="210" width="160" height="190" rx="4" />
                </clipPath>

                <clipPath id="hoodiePrintArea">
                  <rect x="180" y="195" width="140" height="150" rx="6" />
                </clipPath>

                <clipPath id="mugPrintArea">
                  <rect x="185" y="190" width="130" height="160" rx="6" />
                </clipPath>

                <clipPath id="capPrintArea">
                  <rect x="190" y="225" width="120" height="75" rx="8" />
                </clipPath>

                <clipPath id="posterPrintArea">
                  <rect x="145" y="100" width="210" height="300" rx="3" />
                </clipPath>
              </defs>

              {/* Background ambient ground shadow */}
              <ellipse cx="250" cy="455" rx="190" ry="22" fill="#000000" opacity="0.12" />

              {/* 1. REALISTIC CREWNECK T-SHIRT (KAOS OBLONG SEBENARNYA) */}
              {product === 'tshirt' && (
                <g filter="url(#softShadow)">
                  {/* --- SHORT SLEEVE SILHOUETTE --- */}
                  {tshirtSleeve === 'short' ? (
                    <>
                      {/* Body & short sleeves with natural ergonomic shoulder & arm drape */}
                      <path
                        d="M 195 78 Q 160 88 130 112 L 85 178 Q 105 200 128 214 L 165 186 C 162 250, 160 330, 158 432 Q 250 442 342 432 C 340 330, 338 250, 335 186 L 372 214 Q 395 200 415 178 L 370 112 Q 340 88 305 78 Z"
                        fill={color.hex}
                        stroke="#1a1a1a"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                      {/* Fabric shading & vertical drape folds */}
                      <path
                        d="M 195 78 Q 160 88 130 112 L 85 178 Q 105 200 128 214 L 165 186 C 162 250, 160 330, 158 432 Q 250 442 342 432 C 340 330, 338 250, 335 186 L 372 214 Q 395 200 415 178 L 370 112 Q 340 88 305 78 Z"
                        fill="url(#fabricShading)"
                      />
                      <path
                        d="M 195 78 Q 160 88 130 112 L 85 178 Q 105 200 128 214 L 165 186 C 162 250, 160 330, 158 432 Q 250 442 342 432 C 340 330, 338 250, 335 186 L 372 214 Q 395 200 415 178 L 370 112 Q 340 88 305 78 Z"
                        fill="url(#verticalWrinkle)"
                      />
                      {/* Sleeve cuff double-needle hem stitches */}
                      <path d="M 94 186 Q 110 204 126 212" stroke="#000" strokeWidth="1" strokeDasharray="3,2" strokeOpacity="0.25" fill="none" />
                      <path d="M 406 186 Q 390 204 374 212" stroke="#000" strokeWidth="1" strokeDasharray="3,2" strokeOpacity="0.25" fill="none" />
                    </>
                  ) : (
                    <>
                      {/* --- LONG SLEEVE SILHOUETTE --- */}
                      {/* Body & long sleeves with ribbed wrist cuffs */}
                      <path
                        d="M 195 78 Q 160 88 130 112 L 105 200 L 88 388 Q 106 398 124 404 L 140 280 L 165 186 C 162 250, 160 330, 158 432 Q 250 442 342 432 C 340 330, 338 250, 335 186 L 360 280 L 376 404 Q 394 398 412 388 L 395 200 L 370 112 Q 340 88 305 78 Z"
                        fill={color.hex}
                        stroke="#1a1a1a"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M 195 78 Q 160 88 130 112 L 105 200 L 88 388 Q 106 398 124 404 L 140 280 L 165 186 C 162 250, 160 330, 158 432 Q 250 442 342 432 C 340 330, 338 250, 335 186 L 360 280 L 376 404 Q 394 398 412 388 L 395 200 L 370 112 Q 340 88 305 78 Z"
                        fill="url(#fabricShading)"
                      />
                      <path
                        d="M 195 78 Q 160 88 130 112 L 105 200 L 88 388 Q 106 398 124 404 L 140 280 L 165 186 C 162 250, 160 330, 158 432 Q 250 442 342 432 C 340 330, 338 250, 335 186 L 360 280 L 376 404 Q 394 398 412 388 L 395 200 L 370 112 Q 340 88 305 78 Z"
                        fill="url(#verticalWrinkle)"
                      />
                      {/* Wrist ribbed cuffs & seam lines */}
                      <path d="M 91 370 Q 107 380 123 386" stroke="#000" strokeWidth="1.2" strokeOpacity="0.35" fill="none" />
                      <line x1="97" y1="372" x2="95" y2="389" stroke="#000" strokeWidth="0.8" strokeOpacity="0.2" />
                      <line x1="107" y1="378" x2="105" y2="395" stroke="#000" strokeWidth="0.8" strokeOpacity="0.2" />
                      <line x1="117" y1="382" x2="115" y2="399" stroke="#000" strokeWidth="0.8" strokeOpacity="0.2" />

                      <path d="M 409 370 Q 393 380 377 386" stroke="#000" strokeWidth="1.2" strokeOpacity="0.35" fill="none" />
                      <line x1="403" y1="372" x2="405" y2="389" stroke="#000" strokeWidth="0.8" strokeOpacity="0.2" />
                      <line x1="393" y1="378" x2="395" y2="395" stroke="#000" strokeWidth="0.8" strokeOpacity="0.2" />
                      <line x1="383" y1="382" x2="385" y2="399" stroke="#000" strokeWidth="0.8" strokeOpacity="0.2" />
                    </>
                  )}

                  {/* Natural Fabric Creases and Drapery */}
                  <path d="M 165 186 Q 192 215 180 265" stroke="#000" strokeWidth="2" strokeOpacity="0.15" fill="none" />
                  <path d="M 335 186 Q 308 215 320 265" stroke="#000" strokeWidth="2" strokeOpacity="0.15" fill="none" />
                  <path d="M 185 385 Q 250 405 315 385" stroke="#000" strokeWidth="2" strokeOpacity="0.1" fill="none" />

                  {/* Bottom Hem Twin-needle Stitching */}
                  <path d="M 158 418 Q 250 428 342 418" stroke="#000" strokeWidth="1" strokeDasharray="3,2" strokeOpacity="0.25" fill="none" />
                  <path d="M 158 422 Q 250 432 342 422" stroke="#000" strokeWidth="1" strokeDasharray="3,2" strokeOpacity="0.2" fill="none" />

                  {/* --- AUTHENTIC CREWNECK COLLAR (KERAH OBLONG) --- */}
                  {tshirtView === 'front' || tshirtView === 'left-sleeve' || tshirtView === 'right-sleeve' ? (
                    <>
                      {/* Inner back neck depth behind front scoop */}
                      <path
                        d="M 195 78 Q 250 102 305 78 Q 250 64 195 78 Z"
                        fill="#0c1017"
                        opacity="0.32"
                      />
                      {/* Authentic Woven Tag / Label */}
                      <rect x="236" y="80" width="28" height="15" rx="2" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.6" opacity="0.95" />
                      <text x="250" y="89" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#334155">
                        SIZE L
                      </text>
                      <text x="250" y="93.5" textAnchor="middle" fontSize="4" fill="#64748b">
                        100% COTTON
                      </text>

                      {/* Front Ribbed Crewneck Collar Band */}
                      <path
                        d="M 195 78 Q 250 132 305 78 Q 250 114 203 78 Z"
                        fill={color.hex}
                        stroke="#1a1a1a"
                        strokeWidth="1.4"
                      />
                      <path
                        d="M 195 78 Q 250 132 305 78 Q 250 114 203 78 Z"
                        fill="url(#fabricShading)"
                        opacity="0.8"
                      />
                      {/* Collar Twin-needle Topstitch */}
                      <path
                        d="M 192 80 Q 250 135 308 80"
                        fill="none"
                        stroke="#000"
                        strokeWidth="1"
                        strokeDasharray="2,2"
                        strokeOpacity="0.3"
                      />
                    </>
                  ) : (
                    <>
                      {/* Back Crewneck Collar Band */}
                      <path
                        d="M 195 78 Q 250 94 305 78 Q 250 78 195 78 Z"
                        fill={color.hex}
                        stroke="#1a1a1a"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M 195 78 Q 250 94 305 78 Q 250 78 195 78 Z"
                        fill="url(#fabricShading)"
                        opacity="0.8"
                      />
                      {/* Back Neck Tape Stitch */}
                      <path
                        d="M 188 84 Q 250 98 312 84"
                        fill="none"
                        stroke="#000"
                        strokeWidth="1.2"
                        strokeDasharray="3,2"
                        strokeOpacity="0.3"
                      />
                      {/* Shoulder Yoke Seams */}
                      <line x1="195" y1="78" x2="130" y2="112" stroke="#000" strokeWidth="1" strokeDasharray="3,2" strokeOpacity="0.3" />
                      <line x1="305" y1="78" x2="370" y2="112" stroke="#000" strokeWidth="1" strokeDasharray="3,2" strokeOpacity="0.3" />
                    </>
                  )}
                </g>
              )}

              {/* 2. TOTE BAG SVG */}
              {product === 'totebag' && (
                <g filter="url(#softShadow)">
                  {/* Handles */}
                  <path
                    d="M 205 200 L 205 90 Q 205 75 220 75 L 280 75 Q 295 75 295 90 L 295 200"
                    fill="none"
                    stroke={color.hex}
                    strokeWidth="20"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 205 200 L 205 90 Q 205 75 220 75 L 280 75 Q 295 75 295 90 L 295 200"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="3"
                    strokeOpacity="0.2"
                  />
                  {/* Tote Bag Main Body */}
                  <rect
                    x="150"
                    y="180"
                    width="200"
                    height="240"
                    rx="8"
                    fill={color.hex}
                    stroke="#1a1a1a"
                    strokeWidth="1.5"
                  />
                  {/* Canvas texture & folds */}
                  <rect x="150" y="180" width="200" height="240" rx="8" fill="url(#fabricShading)" />
                  <rect x="150" y="180" width="200" height="240" rx="8" fill="url(#verticalWrinkle)" />
                  {/* Seams */}
                  <line x1="150" y1="200" x2="350" y2="200" stroke="#000" strokeWidth="1" strokeDasharray="3,3" opacity="0.3" />
                  <path d="M 165 410 L 190 420 L 310 420 L 335 410" stroke="#000" strokeWidth="1" opacity="0.2" fill="none" />
                </g>
              )}

              {/* 3. HOODIE SVG */}
              {product === 'hoodie' && (
                <g filter="url(#softShadow)">
                  {/* Hood in background */}
                  <path
                    d="M 180 130 Q 250 50 320 130 Z"
                    fill={color.hex}
                    stroke="#111"
                    strokeWidth="1.5"
                  />
                  {/* Hoodie Body & Sleeves */}
                  <path
                    d="M 175 125 Q 250 145 325 125 L 415 190 L 375 270 L 335 240 L 340 435 L 160 435 L 165 240 L 125 270 L 85 190 Z"
                    fill={color.hex}
                    stroke="#111"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M 175 125 Q 250 145 325 125 L 415 190 L 375 270 L 335 240 L 340 435 L 160 435 L 165 240 L 125 270 L 85 190 Z"
                    fill="url(#fabricShading)"
                  />
                  <path
                    d="M 175 125 Q 250 145 325 125 L 415 190 L 375 270 L 335 240 L 340 435 L 160 435 L 165 240 L 125 270 L 85 190 Z"
                    fill="url(#verticalWrinkle)"
                  />
                  {/* Kangaroo pocket */}
                  <path
                    d="M 195 345 L 305 345 L 320 405 L 180 405 Z"
                    fill={color.hex}
                    stroke="#000"
                    strokeWidth="1.5"
                    strokeOpacity="0.4"
                  />
                  {/* Drawstrings */}
                  <path d="M 230 140 Q 225 190 220 220" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
                  <path d="M 270 140 Q 275 190 280 220" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
                </g>
              )}

              {/* 4. MUG SVG */}
              {product === 'mug' && (
                <g filter="url(#softShadow)">
                  {/* Handle */}
                  <path
                    d="M 320 210 C 400 210 400 320 320 320"
                    fill="none"
                    stroke={color.hex}
                    strokeWidth="28"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 320 210 C 390 210 390 320 320 320"
                    fill="none"
                    stroke="#000"
                    strokeWidth="3"
                    strokeOpacity="0.25"
                  />
                  {/* Main Cylinder */}
                  <rect
                    x="160"
                    y="170"
                    width="180"
                    height="200"
                    rx="18"
                    fill={color.hex}
                    stroke="#222"
                    strokeWidth="1.5"
                  />
                  {/* Gloss & Ceramic reflection */}
                  <rect x="160" y="170" width="180" height="200" rx="18" fill="url(#fabricShading)" />
                  <path
                    d="M 175 180 L 185 350 L 195 350 L 185 180 Z"
                    fill="#ffffff"
                    opacity="0.3"
                  />
                  {/* Rim Ellipse */}
                  <ellipse cx="250" cy="170" rx="90" ry="16" fill={color.hex} stroke="#222" strokeWidth="1.5" />
                  <ellipse cx="250" cy="170" rx="80" ry="12" fill="#e4e7eb" opacity="0.8" />
                </g>
              )}

              {/* 5. CAP SVG */}
              {product === 'cap' && (
                <g filter="url(#softShadow)">
                  {/* Crown */}
                  <path
                    d="M 160 270 Q 250 150 340 270 Z"
                    fill={color.hex}
                    stroke="#111"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M 160 270 Q 250 150 340 270 Z"
                    fill="url(#fabricShading)"
                  />
                  {/* Visor / Brim */}
                  <path
                    d="M 140 270 Q 250 330 360 270 Q 250 290 140 270 Z"
                    fill={color.hex}
                    stroke="#111"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M 140 270 Q 250 330 360 270 Q 250 290 140 270 Z"
                    fill="url(#verticalWrinkle)"
                  />
                  {/* Top Button */}
                  <circle cx="250" cy="180" r="7" fill={color.hex} stroke="#000" strokeWidth="1" />
                  {/* Seams */}
                  <path d="M 250 180 L 250 270" stroke="#000" strokeWidth="1" opacity="0.3" />
                  <path d="M 250 180 Q 200 220 180 270" stroke="#000" strokeWidth="1" opacity="0.2" fill="none" />
                  <path d="M 250 180 Q 300 220 320 270" stroke="#000" strokeWidth="1" opacity="0.2" fill="none" />
                </g>
              )}

              {/* 6. POSTER FRAME SVG */}
              {product === 'poster' && (
                <g filter="url(#softShadow)">
                  {/* Wooden outer frame */}
                  <rect x="130" y="80" width="240" height="340" rx="6" fill="#2d3436" stroke="#111" strokeWidth="2" />
                  {/* Mat board */}
                  <rect x="145" y="95" width="210" height="310" rx="2" fill={color.hex} />
                  {/* Glass subtle diagonal reflection */}
                  <polygon points="145,95 240,95 145,260" fill="#ffffff" opacity="0.08" />
                </g>
              )}

              {/* ARTWORK OVERLAY GRAPHIC IN PRINT AREA */}
              <g clipPath={artworkTransform.clip}>
                <g
                  style={{
                    transform: `translate(${artworkTransform.x}px, ${artworkTransform.y}px) scale(${artworkTransform.scale})`,
                    transformOrigin: '0 0',
                    mixBlendMode: blendMode,
                  }}
                >
                  <g transform="translate(-75, -75)">
                    {customArtworkUrl ? (
                      <image href={customArtworkUrl} width="150" height="150" preserveAspectRatio="xMidYMid meet" />
                    ) : activeArtwork ? (
                      <foreignObject width="150" height="150">
                        <div style={{ width: 150, height: 150 }}>{activeArtwork.svg}</div>
                      </foreignObject>
                    ) : (
                      <foreignObject width="150" height="150">
                        <div
                          style={{
                            width: 150,
                            height: 150,
                            background: '#0984e3',
                            borderRadius: 16,
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            padding: 10,
                            fontSize: 12,
                            fontWeight: 'bold',
                          }}
                        >
                          {currentConcept || 'DESIGN ARTWORK'}
                        </div>
                      </foreignObject>
                    )}
                  </g>
                </g>
              </g>

              {/* PRINT ZONE GUIDELINE BOX (HELPER FOR USER DESIGN) */}
              {product === 'tshirt' && showPrintZone && (
                <g className="print-guide-group" pointerEvents="none" opacity="0.75">
                  {tshirtView === 'front' && (
                    <>
                      <rect
                        x="170"
                        y="145"
                        width="160"
                        height="230"
                        rx="6"
                        fill="none"
                        stroke={color.contrastText === 'light' ? '#38bdf8' : '#0284c7'}
                        strokeWidth="1.2"
                        strokeDasharray="4,4"
                      />
                      <text
                        x="250"
                        y="139"
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="bold"
                        fill={color.contrastText === 'light' ? '#38bdf8' : '#0284c7'}
                      >
                        Area Sablon Dada Depan
                      </text>
                    </>
                  )}
                  {tshirtView === 'back' && (
                    <>
                      <rect
                        x="170"
                        y="125"
                        width="160"
                        height="250"
                        rx="6"
                        fill="none"
                        stroke={color.contrastText === 'light' ? '#38bdf8' : '#0284c7'}
                        strokeWidth="1.2"
                        strokeDasharray="4,4"
                      />
                      <text
                        x="250"
                        y="119"
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="bold"
                        fill={color.contrastText === 'light' ? '#38bdf8' : '#0284c7'}
                      >
                        Area Sablon Punggung
                      </text>
                    </>
                  )}
                  {tshirtView === 'left-sleeve' && (
                    <>
                      <rect
                        x="85"
                        y={tshirtSleeve === 'short' ? 135 : 165}
                        width="80"
                        height={tshirtSleeve === 'short' ? 85 : 150}
                        rx="6"
                        fill="none"
                        stroke={color.contrastText === 'light' ? '#38bdf8' : '#0284c7'}
                        strokeWidth="1.2"
                        strokeDasharray="4,4"
                      />
                      <text
                        x="125"
                        y={tshirtSleeve === 'short' ? 130 : 160}
                        textAnchor="middle"
                        fontSize="8.5"
                        fontWeight="bold"
                        fill={color.contrastText === 'light' ? '#38bdf8' : '#0284c7'}
                      >
                        Area Lengan Kiri
                      </text>
                    </>
                  )}
                  {tshirtView === 'right-sleeve' && (
                    <>
                      <rect
                        x="335"
                        y={tshirtSleeve === 'short' ? 135 : 165}
                        width="80"
                        height={tshirtSleeve === 'short' ? 85 : 150}
                        rx="6"
                        fill="none"
                        stroke={color.contrastText === 'light' ? '#38bdf8' : '#0284c7'}
                        strokeWidth="1.2"
                        strokeDasharray="4,4"
                      />
                      <text
                        x="375"
                        y={tshirtSleeve === 'short' ? 130 : 160}
                        textAnchor="middle"
                        fontSize="8.5"
                        fontWeight="bold"
                        fill={color.contrastText === 'light' ? '#38bdf8' : '#0284c7'}
                      >
                        Area Lengan Kanan
                      </text>
                    </>
                  )}
                </g>
              )}
            </svg>
          </div>

          {/* Color Selection & Manual Custom Picker */}
          <div className="color-section-box">
            <div className="color-section-header">
              <div className="active-color-badge">
                <span
                  className="active-color-dot"
                  style={{ backgroundColor: color.hex }}
                />
                <div>
                  <span className="active-color-title">Warna Terpilih:</span>
                  <div className="active-color-info">
                    <strong>{color.name}</strong>
                    <code className="active-color-hex">{color.hex.toUpperCase()}</code>
                  </div>
                </div>
              </div>

              {/* Manual Color Picker Controls */}
              <div className="manual-color-picker-group">
                <label className="manual-picker-label" title="Pilih warna apapun secara bebas">
                  <span className="picker-icon">🎨</span>
                  <span className="picker-text">Pilih Bebas:</span>
                  <input
                    type="color"
                    className="native-color-input"
                    value={customHex.length === 7 ? customHex : '#18181b'}
                    onChange={(e) => handleCustomColorChange(e.target.value)}
                  />
                </label>
                <div className="hex-manual-input-wrap">
                  <span className="hex-prefix">#</span>
                  <input
                    type="text"
                    maxLength={6}
                    className="hex-manual-input"
                    placeholder="HEX..."
                    value={customHex.replace('#', '')}
                    onChange={(e) => handleCustomColorChange(`#${e.target.value}`)}
                  />
                </div>
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="color-category-chips">
              {mockupColorCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`color-cat-chip ${selectedColorCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedColorCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Swatch grid */}
            <div className="color-swatches-grid">
              {filteredColors.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  title={`${c.name} (${c.hex})`}
                  className={`color-swatch-item ${color.id === c.id || color.hex.toLowerCase() === c.hex.toLowerCase() ? 'active' : ''}`}
                  style={{ backgroundColor: c.hex }}
                  onClick={() => {
                    setColor(c)
                    setCustomHex(c.hex)
                  }}
                >
                  {(color.id === c.id || color.hex.toLowerCase() === c.hex.toLowerCase()) && (
                    <span className={`swatch-check ${c.contrastText === 'light' ? 'light-check' : 'dark-check'}`}>
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Controls & AI Prompt Generator */}
        <div className="mockup-controls-card">
          <h3>2) Pengaturan Artwork Mockup</h3>

          <div className="artwork-select-grid">
            {sampleArtworks.map((art) => (
              <button
                key={art.id}
                type="button"
                className={`artwork-chip ${selectedArtworkId === art.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedArtworkId(art.id)
                  setCustomArtworkUrl(null)
                }}
              >
                <div className="chip-icon">{art.svg}</div>
                <div className="chip-text">
                  <strong>{art.name}</strong>
                  <small>{art.description}</small>
                </div>
              </button>
            ))}
          </div>

          <div className="custom-upload-box">
            <label className="file-upload full-width">
              📁 Upload Gambar / Desain Sendiri (PNG/JPG)
              <input type="file" accept="image/*" onChange={handleArtworkUpload} />
            </label>
            {customArtworkUrl && (
              <p className="custom-active-notice">✓ Desain kustom Anda aktif pada mockup</p>
            )}
          </div>

          <div className="sliders-panel">
            <div className="scale-control-header">
              <label>Ukuran Artwork ({artworkScale}%)</label>
              <div className="scale-preset-buttons">
                <button
                  type="button"
                  className={`preset-scale-btn ${artworkScale === 50 ? 'active' : ''}`}
                  onClick={() => setArtworkScale(50)}
                >
                  50%
                </button>
                <button
                  type="button"
                  className={`preset-scale-btn ${artworkScale === 75 ? 'active' : ''}`}
                  onClick={() => setArtworkScale(75)}
                >
                  75%
                </button>
                <button
                  type="button"
                  className={`preset-scale-btn ${artworkScale === 100 ? 'active' : ''}`}
                  onClick={() => setArtworkScale(100)}
                >
                  100%
                </button>
              </div>
            </div>

            <input
              type="range"
              min="30"
              max="130"
              value={artworkScale}
              onChange={(e) => setArtworkScale(Number(e.target.value))}
            />

            <div className="position-control-box">
              <div className="position-header-row">
                <span>Posisi Artwork</span>
                {(artworkOffsetX !== 0 || artworkOffsetY !== 0) && (
                  <button
                    type="button"
                    className="reset-center-btn"
                    onClick={() => {
                      setArtworkOffsetX(0)
                      setArtworkOffsetY(0)
                    }}
                  >
                    🎯 Posisikan di Tengah
                  </button>
                )}
              </div>

              <div className="control-row dual">
                <label>
                  Vertikal Y ({artworkOffsetY}px)
                  <input
                    type="range"
                    min="-60"
                    max="60"
                    value={artworkOffsetY}
                    onChange={(e) => setArtworkOffsetY(Number(e.target.value))}
                  />
                </label>

                <label>
                  Horizontal X ({artworkOffsetX}px)
                  <input
                    type="range"
                    min="-60"
                    max="60"
                    value={artworkOffsetX}
                    onChange={(e) => setArtworkOffsetX(Number(e.target.value))}
                  />
                </label>
              </div>
            </div>

            <div className="control-row dual">
              <label>
                Efek Sablon / Blend
                <select
                  value={blendMode}
                  onChange={(e) => setBlendMode(e.target.value as 'normal' | 'multiply' | 'overlay')}
                >
                  <option value="normal">Solid / Opaque (Stiker / Patch)</option>
                  <option value="multiply">Multiply (Tinta Menyatu Serat Kain)</option>
                  <option value="overlay">Overlay (Vintage Soft Wash)</option>
                </select>
              </label>

              <label>
                Latar Scene Foto
                <select value={sceneSetting} onChange={(e) => setSceneSetting(e.target.value)}>
                  <option value="Studio Minimalist dengan bayangan lembut">Studio Minimalist Clean</option>
                  <option value="Aesthetic flat-lay di lantai kayu rustic dengan aksesoris kopi">
                    Flat-lay Rustic Wood
                  </option>
                  <option value="Dipakai oleh model streetwear di jalanan urban kota">
                    Lifestyle Streetwear Model
                  </option>
                  <option value="Podium display batu marmer abu-abu modern">Podium Marmer Mewah</option>
                  <option value="Gantungan kayu di dinding beton industrial">Hanger Beton Industrial</option>
                </select>
              </label>
            </div>
          </div>

          <div className="mockup-ai-section">
            <div className="section-title-row">
              <h4>Mockup AI Prompt Generator</h4>
              <button
                type="button"
                className="primary-sm"
                onClick={handleTriggerAiMockup}
                disabled={isGeneratingMockup}
              >
                {isGeneratingMockup ? 'Menyusun Mockup...' : '✨ Generate Prompt Mockup (AI)'}
              </button>
            </div>

            <p className="hint-text">
              Gunakan prompt ini di <strong>Midjourney v6</strong>, <strong>Flux</strong>, atau{' '}
              <strong>DALL-E 3</strong> untuk menghasilkan foto produk komersial berkualitas tinggi!
            </p>

            <div className="prompt-display-block">
              <div className="prompt-block-header">
                <span>Prompt Mockup Final</span>
                <button
                  type="button"
                  className="ghost-sm"
                  onClick={() =>
                    copyToClipboard(mockupAiResult || localMockupPrompt, 'Prompt Mockup Tersalin!')
                  }
                >
                  {copyStatus || 'Salin Prompt'}
                </button>
              </div>
              <textarea
                className="mockup-prompt-textarea"
                rows={4}
                readOnly
                value={mockupAiResult || localMockupPrompt}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
