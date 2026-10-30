import { useMemo, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { mockupColors } from '../data/mockupData'
import type { MockupColor, MockupProductType } from '../data/mockupData'

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

export function MockupStudio({
  currentPrompt,
  currentConcept,
  initialCustomArtworkUrl,
  onGenerateMockupAiPrompt,
  isGeneratingMockup,
  mockupAiResult,
}: MockupStudioProps) {
  const [product, setProduct] = useState<MockupProductType>('tshirt')
  const [color, setColor] = useState<MockupColor>(mockupColors[2]) // black default
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

  const productName = useMemo(() => {
    switch (product) {
      case 'tshirt':
        return 'Kaos (Streetwear Crewneck T-Shirt)'
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
  }, [product])

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

    return `Commercial product photo of a premium ${color.name.toLowerCase()} ${productName}, displayed in a ${sceneSetting.toLowerCase()}, featuring the graphic artwork: "${artworkDesc}". The print has realistic ink texture integrated with the fabric, soft natural shadows, studio lighting, professional 85mm lens, 8k resolution photorealistic catalog mockup.`
  }, [color.name, productName, sceneSetting, currentPrompt, currentConcept])

  // Download high-resolution PNG of the current mockup
  function downloadMockupImage() {
    const svgElement = mockupRef.current
    if (!svgElement) return

    const serializer = new XMLSerializer()
    const svgString = serializer.serializeToString(svgElement)
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
      link.download = `mockup-${product}-${color.id}.png`
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
    onGenerateMockupAiPrompt({
      product: productName,
      color: color.name,
      scene: sceneSetting,
      camera: 'Front view eye-level, 85mm lens, f/2.8',
      lighting: 'Studio softbox with soft ambient bounce light',
      artworkDescription: currentPrompt.trim() || currentConcept.trim() || 'Detailed graphic vector illustration',
      aspectRatio: '1:1',
    })
  }

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
              👕 Kaos
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
                  <stop offset="0%" stopColor="#000000" stopOpacity="0.18" />
                  <stop offset="35%" stopColor="#ffffff" stopOpacity="0.08" />
                  <stop offset="50%" stopColor="#000000" stopOpacity="0.0" />
                  <stop offset="65%" stopColor="#ffffff" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.22" />
                </linearGradient>

                <linearGradient id="verticalWrinkle" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
                  <stop offset="40%" stopColor="#000000" stopOpacity="0.0" />
                  <stop offset="85%" stopColor="#000000" stopOpacity="0.16" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.32" />
                </linearGradient>

                <filter id="softShadow" x="-10%" y="-10%" width="120%" height="130%">
                  <feDropShadow dx="0" dy="16" stdDeviation="16" floodColor="#0f172a" floodOpacity="0.22" />
                </filter>

                {/* Print area clip-paths for different products */}
                <clipPath id="tshirtPrintArea">
                  <rect x="175" y="160" width="150" height="200" rx="6" />
                </clipPath>

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

              {/* 1. T-SHIRT SVG */}
              {product === 'tshirt' && (
                <g filter="url(#softShadow)">
                  {/* Base Body & Sleeves */}
                  <path
                    d="M 180 85 Q 250 115 320 85 L 395 145 L 355 210 L 320 180 L 325 430 L 175 430 L 180 180 L 145 210 L 105 145 Z"
                    fill={color.hex}
                    stroke="#1a1a1a"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  {/* Fabric highlight and folds */}
                  <path
                    d="M 180 85 Q 250 115 320 85 L 395 145 L 355 210 L 320 180 L 325 430 L 175 430 L 180 180 L 145 210 L 105 145 Z"
                    fill="url(#fabricShading)"
                  />
                  <path
                    d="M 180 85 Q 250 115 320 85 L 395 145 L 355 210 L 320 180 L 325 430 L 175 430 L 180 180 L 145 210 L 105 145 Z"
                    fill="url(#verticalWrinkle)"
                  />
                  {/* Collar rib */}
                  <path
                    d="M 180 85 Q 250 125 320 85 Q 250 102 180 85 Z"
                    fill={color.hex}
                    stroke="#222"
                    strokeWidth="1.5"
                    opacity="0.95"
                  />
                  {/* Crease lines */}
                  <path d="M 180 180 Q 210 230 195 290" stroke="#000" strokeWidth="1.5" strokeOpacity="0.15" fill="none" />
                  <path d="M 320 180 Q 290 230 305 290" stroke="#000" strokeWidth="1.5" strokeOpacity="0.15" fill="none" />
                  <path d="M 230 420 Q 250 425 270 420" stroke="#000" strokeWidth="1.5" strokeOpacity="0.15" fill="none" />
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
              <g
                clipPath={
                  product === 'tshirt'
                    ? 'url(#tshirtPrintArea)'
                    : product === 'totebag'
                    ? 'url(#totebagPrintArea)'
                    : product === 'hoodie'
                    ? 'url(#hoodiePrintArea)'
                    : product === 'mug'
                    ? 'url(#mugPrintArea)'
                    : product === 'cap'
                    ? 'url(#capPrintArea)'
                    : 'url(#posterPrintArea)'
                }
              >
                <g
                  style={{
                    transform: `translate(${250 + artworkOffsetX}px, ${
                      product === 'tshirt'
                        ? 250 + artworkOffsetY
                        : product === 'totebag'
                        ? 295 + artworkOffsetY
                        : product === 'hoodie'
                        ? 260 + artworkOffsetY
                        : product === 'mug'
                        ? 265 + artworkOffsetY
                        : product === 'cap'
                        ? 255 + artworkOffsetY
                        : 245 + artworkOffsetY
                    }px) scale(${artworkScale / 100})`,
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
            </svg>
          </div>

          {/* Color Palette Switcher */}
          <div className="swatch-row">
            <span className="swatch-label">Pilihan Warna Produk:</span>
            <div className="color-pills">
              {mockupColors.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  title={c.name}
                  className={`color-swatch-btn ${color.id === c.id ? 'active' : ''}`}
                  style={{ backgroundColor: c.hex }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
            <span className="selected-color-name">{color.name}</span>
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
            <label>
              Ukuran Artwork ({artworkScale}%)
              <input
                type="range"
                min="30"
                max="130"
                value={artworkScale}
                onChange={(e) => setArtworkScale(Number(e.target.value))}
              />
            </label>

            <div className="control-row dual">
              <label>
                Posisi Vertikal Y ({artworkOffsetY}px)
                <input
                  type="range"
                  min="-60"
                  max="60"
                  value={artworkOffsetY}
                  onChange={(e) => setArtworkOffsetY(Number(e.target.value))}
                />
              </label>

              <label>
                Posisi Horizontal X ({artworkOffsetX}px)
                <input
                  type="range"
                  min="-60"
                  max="60"
                  value={artworkOffsetX}
                  onChange={(e) => setArtworkOffsetX(Number(e.target.value))}
                />
              </label>
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
