import type { ReactNode } from 'react'

export type IllustratorTemplate = {
  id: string
  name: string
  category: 'Vector' | 'Anime/Manga' | 'Hand-Drawn' | 'Retro' | 'Concept' | 'Merch'
  badge: string
  description: string
  gradient: string
  preview: ReactNode
  preset: {
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
    aspectRatio: '1:1' | '3:2' | '4:5' | '16:9' | '9:16'
  }
  samplePrompt: string
}

export const illustratorTemplates: IllustratorTemplate[] = [
  {
    id: 'flat-vector',
    name: 'Flat Vector Minimalist',
    category: 'Vector',
    badge: 'Clean & Modern',
    description: 'Model karakter manusia dalam bentuk geometris bersih, warna solid tanpa gradien berlebih, modern dan stylish.',
    gradient: 'linear-gradient(135deg, #00b894, #00cec9)',
    preview: (
      <svg viewBox="0 0 320 150" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="fv-human-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e8f8f5" />
            <stop offset="100%" stopColor="#d1f2eb" />
          </linearGradient>
        </defs>
        <rect width="320" height="150" fill="url(#fv-human-bg)" />
        <circle cx="215" cy="72" r="55" fill="#ffeaa7" />
        <rect x="50" y="25" width="40" height="40" rx="20" fill="#00cec9" opacity="0.35" />
        {/* Torso & Turtleneck */}
        <path d="M 105 150 L 125 105 L 195 105 L 215 150 Z" fill="#0984e3" />
        <rect x="145" y="85" width="30" height="25" rx="4" fill="#0652dd" />
        {/* Neck */}
        <rect x="150" y="75" width="20" height="18" fill="#f5cd79" />
        {/* Head & Face */}
        <ellipse cx="160" cy="62" rx="22" ry="26" fill="#f5cd79" />
        {/* Hair: Minimalist dark bob */}
        <path d="M 134 58 C 134 32 186 32 186 58 C 186 78 180 85 180 85 L 174 65 Q 160 62 146 65 L 140 85 C 140 85 134 78 134 58 Z" fill="#2d3436" />
        {/* Round Glasses */}
        <circle cx="151" cy="63" r="7" fill="none" stroke="#2d3436" strokeWidth="2" />
        <circle cx="169" cy="63" r="7" fill="none" stroke="#2d3436" strokeWidth="2" />
        <line x1="158" y1="63" x2="162" y2="63" stroke="#2d3436" strokeWidth="2" />
        {/* Features */}
        <path d="M 160 65 L 158 71 L 163 71" fill="none" stroke="#e17055" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 155 76 Q 160 80 165 76" fill="none" stroke="#d63031" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="145" cy="70" r="3.5" fill="#ff7675" opacity="0.6" />
        <circle cx="175" cy="70" r="3.5" fill="#ff7675" opacity="0.6" />
      </svg>
    ),
    preset: {
      concept: 'Minimalist flat vector illustration portrait of a stylish creative professional woman',
      subject: 'Young female designer with geometric glasses, styled dark bob haircut, and emerald turtleneck',
      style: 'Flat 2D vector art, clean sharp lines, bold geometric facial silhouettes, corporate modern editorial vector',
      mood: 'Confident, modern, professional, approachable, stylish',
      camera: 'Frontal bust portrait framing, centered eye-level view',
      lighting: 'Clean ambient daylight, solid flat color fills without noisy gradients',
      palette: 'Warm ochre skin tone, cobalt blue sweater, mustard yellow disc accent, crisp navy linework',
      setting: 'Clean minimalist graphic background with subtle geometric color blocks',
      details: 'Crisp vector anchor points, SVG precision, elegant minimal facial features',
      negativePrompt: 'photorealistic, 3d render, messy brushwork, noisy textures, blur, bevels, disfigured face',
      aspectRatio: '1:1',
    },
    samplePrompt:
      'Flat 2D vector art portrait of a stylish young female designer wearing round glasses and emerald turtleneck, minimalist geometric facial features, clean linework, pastel background, Dribbble aesthetic --ar 1:1',
  },
  {
    id: 'anime-cel-shade',
    name: 'Japanese Anime / Manga Key Visual',
    category: 'Anime/Manga',
    badge: 'Shonen / Makoto Shinkai',
    description: 'Karakter manusia anime modern dengan mata ekspresif bersinar, cel-shading rapi, dan rim light sinematik.',
    gradient: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
    preview: (
      <svg viewBox="0 0 320 150" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="anime-h-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="60%" stopColor="#4338ca" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>
          <linearGradient id="anime-hair-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
        </defs>
        <rect width="320" height="150" fill="url(#anime-h-bg)" />
        <circle cx="160" cy="65" r="50" fill="#f43f5e" opacity="0.3" filter="blur(8px)" />
        <polygon points="100,150 135,115 185,115 220,150" fill="#0f172a" />
        <polygon points="135,115 160,135 185,115" fill="#334155" />
        {/* Neck with cel-shade shadow */}
        <polygon points="152,85 168,85 172,118 148,118" fill="#fed7aa" />
        <polygon points="152,85 168,85 165,102 150,100" fill="#fdba74" />
        {/* Anime Face Shape */}
        <polygon points="138,55 182,55 176,82 160,102 144,82" fill="#ffedd5" />
        <polygon points="144,82 160,102 176,82 172,78 160,94 148,78" fill="#fed7aa" />
        {/* Eyes */}
        <path d="M 144 65 Q 150 60 155 65" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <ellipse cx="149" cy="71" rx="4.5" ry="6.5" fill="#0284c7" />
        <ellipse cx="149" cy="71" rx="2.5" ry="4" fill="#082f49" />
        <circle cx="147.5" cy="68.5" r="1.8" fill="#ffffff" />
        <circle cx="150.5" cy="73.5" r="1" fill="#ffffff" />
        <path d="M 165 65 Q 170 60 176 65" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <ellipse cx="171" cy="71" rx="4.5" ry="6.5" fill="#0284c7" />
        <ellipse cx="171" cy="71" rx="2.5" ry="4" fill="#082f49" />
        <circle cx="169.5" cy="68.5" r="1.8" fill="#ffffff" />
        <circle cx="172.5" cy="73.5" r="1" fill="#ffffff" />
        {/* Nose & mouth */}
        <polygon points="159,77 161,78 159,80" fill="#f97316" />
        <path d="M 157 88 Q 160 90 163 88" stroke="#be123c" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <line x1="140" y1="76" x2="144" y2="74" stroke="#fb7185" strokeWidth="1.2" />
        <line x1="176" y1="74" x2="180" y2="76" stroke="#fb7185" strokeWidth="1.2" />
        {/* Layered anime hair */}
        <path d="M 132 55 Q 160 22 188 55 Q 198 40 185 28 Q 160 18 135 28 Q 122 40 132 55 Z" fill="url(#anime-hair-grad)" />
        <polygon points="135,48 145,68 150,52" fill="#0284c7" />
        <polygon points="148,50 158,74 163,50" fill="#38bdf8" />
        <polygon points="160,50 172,70 178,48" fill="#0284c7" />
        <polygon points="175,48 185,65 188,52" fill="#1e3a8a" />
        <path d="M 142 38 Q 160 32 178 38" stroke="#ffffff" strokeWidth="2" strokeDasharray="8,4,12,3" fill="none" opacity="0.8" />
        <circle cx="186" cy="45" r="2.5" fill="#fef08a" />
        <circle cx="130" cy="50" r="2" fill="#fef08a" />
      </svg>
    ),
    preset: {
      concept: 'Breathtaking anime key visual portrait of a fierce young warrior',
      subject: 'Young anime protagonist with expressive glowing azure eyes and wind-blown layered hair',
      style: 'Japanese animation key visual, crisp ink linework, multi-layered cel shading, Makoto Shinkai aesthetic',
      mood: 'Heroic, determined, emotional, cinematic, wondrous',
      camera: 'Dramatic close-up portrait perspective, slightly angled heroic framing',
      lighting: 'Golden hour rim lighting catching hair strands, volumetric light rays, soft lens flare',
      palette: 'Deep twilight indigo, radiant cyan, warm amber highlights, soft porcelain skin tones',
      setting: 'Distant cinematic cumulonimbus clouds and sunset sky background',
      details: 'Intricate anime eye reflections, fine flowing hair strands, crisp shadows under chin and collar',
      negativePrompt: 'blurry, western comic style, photographic skin, extra limbs, dull eyes, low quality anime',
      aspectRatio: '16:9',
    },
    samplePrompt:
      'Anime key visual portrait of a fierce young warrior with glowing azure eyes, wind-blown layered hair catching dramatic sunset rim lighting, Makoto Shinkai sky background, crisp cel-shading, 4k anime masterpiece --ar 16:9',
  },
  {
    id: 'watercolor-storybook',
    name: 'Watercolor & Children’s Book',
    category: 'Hand-Drawn',
    badge: 'Cozy & Whimsical',
    description: 'Karakter manusia gaya buku cerita anak dengan tekstur cat air basah, pipi merona, dan kesan hangat.',
    gradient: 'linear-gradient(135deg, #fd79a8, #fab1a0)',
    preview: (
      <svg viewBox="0 0 320 150" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="wc-h-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fefaf2" />
            <stop offset="100%" stopColor="#faecd6" />
          </linearGradient>
        </defs>
        <rect width="320" height="150" fill="url(#wc-h-bg)" />
        <circle cx="160" cy="70" r="55" fill="#fbcfe8" opacity="0.35" />
        <circle cx="195" cy="50" r="35" fill="#fed7aa" opacity="0.4" />
        {/* Coat & Scarf */}
        <path d="M 115 150 Q 130 115 160 115 Q 190 115 205 150 Z" fill="#4d7c0f" opacity="0.85" />
        <path d="M 140 105 Q 160 116 180 105 Q 185 118 160 124 Q 135 118 140 105 Z" fill="#dc2626" opacity="0.9" />
        <rect x="162" y="118" width="14" height="28" rx="2" fill="#b91c1c" opacity="0.9" />
        {/* Head */}
        <circle cx="160" cy="72" r="24" fill="#ffedd5" stroke="#78350f" strokeWidth="1.2" />
        {/* Soft Watercolor Blush */}
        <circle cx="148" cy="78" r="6" fill="#f43f5e" opacity="0.4" />
        <circle cx="172" cy="78" r="6" fill="#f43f5e" opacity="0.4" />
        {/* Facial details */}
        <circle cx="151" cy="71" r="2.5" fill="#451a03" />
        <circle cx="169" cy="71" r="2.5" fill="#451a03" />
        <circle cx="152" cy="70" r="0.8" fill="#ffffff" />
        <circle cx="170" cy="70" r="0.8" fill="#ffffff" />
        <path d="M 157 80 Q 160 83 163 80" stroke="#78350f" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        {/* Curls */}
        <circle cx="138" cy="70" r="8" fill="#b45309" opacity="0.9" />
        <circle cx="182" cy="70" r="8" fill="#b45309" opacity="0.9" />
        {/* Beret */}
        <ellipse cx="160" cy="52" rx="28" ry="14" fill="#eab308" stroke="#78350f" strokeWidth="1.2" />
        <circle cx="160" cy="38" r="3" fill="#ca8a04" />
      </svg>
    ),
    preset: {
      concept: 'Whimsical storybook watercolor illustration of a gentle young character',
      subject: 'A sweet curious girl with rosy watercolor cheeks wearing a knitted yellow beret and red woolen scarf',
      style: 'Hand-painted watercolor and gouache, visible cold-press paper grain, delicate sepia ink outlines, soft edge bleeds',
      mood: 'Cozy, nostalgic, gentle, endearing, heartfelt storybook warmth',
      camera: 'Warm eye-level portrait framing, gentle close-up composition',
      lighting: 'Soft diffused morning sunshine, golden warm ambient glow, natural paper illumination',
      palette: 'Warm peach blush, cozy mustard yellow, forest olive, terracotta red, soft creamy paper tones',
      setting: 'Delicate storybook forest clearing background with soft painterly leaves and dew',
      details: 'Organic watercolor pigment puddling on cheeks, textured pencil outlines, expressive gentle eyes',
      negativePrompt: 'photorealistic, harsh neon, sharp vector edges, plastic 3d render, dark gory theme, uncanny valley',
      aspectRatio: '4:5',
    },
    samplePrompt:
      'Whimsical storybook watercolor portrait of a curious little girl with rosy cheeks wearing a yellow knit beret and red scarf, soft paper tooth texture, wet-on-wet paint bleeds, cozy storybook illustration --ar 4:5',
  },
  {
    id: 'retro-pop-art',
    name: 'Vintage Pop Art & Comic Book',
    category: 'Retro',
    badge: 'Roy Lichtenstein & Comic',
    description: 'Potret manusia komik klasik 1960-an dengan pola titik Ben-Day, garis tinta tebal, dan bibir merah tegas.',
    gradient: 'linear-gradient(135deg, #e17055, #ffeaa7)',
    preview: (
      <svg viewBox="0 0 320 150" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="pop-dots-h" x="0" y="0" width="7" height="7" patternUnits="userSpaceOnUse">
            <circle cx="3.5" cy="3.5" r="1.6" fill="#ef4444" opacity="0.4" />
          </pattern>
        </defs>
        <rect width="320" height="150" fill="#fffbeb" />
        <rect width="320" height="150" fill="url(#pop-dots-h)" />
        {/* Speech Bubble */}
        <path d="M 210 25 Q 260 25 260 50 Q 260 70 230 70 L 220 85 L 222 70 Q 210 70 210 50 Z" fill="#ffffff" stroke="#18181b" strokeWidth="2" />
        <text x="235" y="52" textAnchor="middle" fontSize="12" fontWeight="900" fill="#dc2626" fontFamily="sans-serif">
          OH!
        </text>
        {/* Pop Art Female Portrait */}
        <path d="M 110 90 Q 95 30 150 25 Q 200 20 205 60 Q 215 100 185 130 L 110 130 Z" fill="#facc15" stroke="#18181b" strokeWidth="3" />
        <polygon points="125,65 175,65 170,105 150,125 130,105" fill="#ffedd5" stroke="#18181b" strokeWidth="2.5" />
        <path d="M 130 105 L 150 125 L 170 105 Q 150 115 130 105 Z" fill="#fca5a5" />
        {/* Cat-eye Glasses */}
        <polygon points="122,66 148,60 146,76 126,76" fill="#18181b" />
        <polygon points="154,60 180,66 176,76 156,76" fill="#18181b" />
        <ellipse cx="136" cy="68" rx="6" ry="4" fill="#0284c7" />
        <ellipse cx="166" cy="68" rx="6" ry="4" fill="#0284c7" />
        <line x1="147" y1="65" x2="155" y2="65" stroke="#18181b" strokeWidth="3" />
        {/* Lush Red Pop Lips */}
        <path d="M 140 100 Q 150 94 160 100 Q 150 112 140 100 Z" fill="#dc2626" stroke="#18181b" strokeWidth="2" />
        <line x1="143" y1="100" x2="157" y2="100" stroke="#ffffff" strokeWidth="1.5" />
        {/* Tear drop */}
        <path d="M 134 80 Q 131 92 135 94 Q 139 92 136 80 Z" fill="#38bdf8" stroke="#18181b" strokeWidth="1.2" />
      </svg>
    ),
    preset: {
      concept: '1960s vintage pop art comic book female portrait in Roy Lichtenstein style',
      subject: 'Glamorous retro woman with flowing blonde wave hair, crimson red lips, and dramatic cat-eye sunglasses',
      style: 'Classic vintage comic book print, bold black brush ink contours, Ben-Day dot halftone skin screening, Pop Art aesthetic',
      mood: 'Dramatic, iconic, glamorous, retro-chic, emotional',
      camera: 'Tight close-up dramatic portrait framing with vintage comic speech balloon',
      lighting: 'Graphic flat shading, high contrast hard shadows, bold primary CMYK lighting',
      palette: 'Primary CMYK: cadmium red, cobalt blue, lemon yellow, stark newsprint off-white',
      setting: 'Retro vintage comic book panel background with halftone pattern',
      details: 'Authentic newsprint screen dots, offset ink registration, bold black graphic eyelashes and hair strokes',
      negativePrompt: 'photorealistic 3d, smooth airbrush gradient, modern digital clean, washed out pastel, blurry face',
      aspectRatio: '1:1',
    },
    samplePrompt:
      'Vintage Roy Lichtenstein pop art comic portrait of a glamorous 1960s woman with crying teardrop and cat-eye sunglasses, Ben-Day dot halftone skin shading, bold black brush outlines, primary red and yellow colors --ar 1:1',
  },
  {
    id: 'sticker-merch',
    name: 'Sticker & Apparel Vector Merch',
    category: 'Merch',
    badge: 'T-shirt & Merch Ready',
    description: 'Karakter model manusia streetwear dengan garis luar stiker putih tebal, siap cetak kaos dan merchandise.',
    gradient: 'linear-gradient(135deg, #e84393, #fd79a8)',
    preview: (
      <svg viewBox="0 0 320 150" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="merch-h-bg" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0b0f19" />
          </radialGradient>
        </defs>
        <rect width="320" height="150" fill="url(#merch-h-bg)" />
        {/* Die-Cut Contour */}
        <path d="M 100 150 Q 105 85 130 65 Q 120 40 160 30 Q 200 40 190 65 Q 215 85 220 150 Z" fill="#ffffff" />
        {/* Character Hoodie */}
        <path d="M 106 150 Q 112 92 135 72 Q 128 48 160 38 Q 192 48 185 72 Q 208 92 214 150 Z" fill="#111827" />
        {/* Face */}
        <ellipse cx="160" cy="78" rx="20" ry="24" fill="#fed7aa" />
        {/* Street Mask */}
        <polygon points="142,76 178,76 170,98 150,98" fill="#f97316" stroke="#111827" strokeWidth="2" />
        <text x="160" y="90" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#ffffff">NEO</text>
        {/* Eyes */}
        <line x1="144" y1="64" x2="154" y2="67" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="176" y1="64" x2="166" y2="67" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="149" cy="70" rx="3" ry="2" fill="#00f2fe" />
        <ellipse cx="171" cy="70" rx="3" ry="2" fill="#00f2fe" />
        {/* Hoodie Trim & Headphones */}
        <path d="M 136 52 Q 160 44 184 52" stroke="#00f2fe" strokeWidth="3" fill="none" strokeLinecap="round" />
        <rect x="130" y="65" width="8" height="20" rx="4" fill="#facc15" stroke="#111827" strokeWidth="1.5" />
        <rect x="182" y="65" width="8" height="20" rx="4" fill="#facc15" stroke="#111827" strokeWidth="1.5" />
        <path d="M 134 68 Q 160 38 186 68" fill="none" stroke="#facc15" strokeWidth="3" />
      </svg>
    ),
    preset: {
      concept: 'Bold streetwear human character mascot graphic for t-shirt apparel and die-cut stickers',
      subject: 'Edgy cyberpunk youth character wearing techwear oversized hoodie, face mask, and futuristic DJ headphones',
      style: 'Vector streetwear badge, heavy white die-cut contour border, bold screen-print lines, high-contrast ink separation',
      mood: 'Edgy, rebellious, urban, futuristic, high-energy streetwear',
      camera: 'Centered frontal character emblem, isolated composition',
      lighting: 'Crisp high-contrast lighting, bold neon cyan and orange accent rim lights',
      palette: 'Signal neon orange, electric cyan, matte jet black, crisp pure white contour',
      setting: 'Clean solid background isolated for direct garment screen-printing and mockup placement',
      details: 'Extra-thick 6px outer die-cut sticker border, solid ink fills, sharp vector angles on fabric and mask',
      negativePrompt: 'photograph, blurry background, gradient mesh, complex photographic scene, deformed face',
      aspectRatio: '1:1',
    },
    samplePrompt:
      'Streetwear vector badge illustration of an urban cyberpunk youth wearing oversized techwear hoodie and neon face mask, thick white die-cut sticker border, high-contrast screen-print separation, apparel merchandise ready --ar 1:1',
  },
  {
    id: 'cyberpunk-lineart',
    name: 'Cyberpunk & Sci-Fi Technical Line Art',
    category: 'Concept',
    badge: 'Detailed Mecha',
    description: 'Model manusia siborg fiksi ilmiah dengan implan okular bercahaya dan skema garis teknikal CAD.',
    gradient: 'linear-gradient(135deg, #0984e3, #6c5ce7)',
    preview: (
      <svg viewBox="0 0 320 150" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-cyb" width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#1e293b" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="320" height="150" fill="#090d16" />
        <rect width="320" height="150" fill="url(#grid-cyb)" />
        {/* Human Cyborg Face Side Profile */}
        <path d="M 135 140 L 140 105 Q 138 95 142 90 L 152 82 L 150 72 L 165 72 L 155 60 L 162 48 Q 160 30 135 32 Q 115 35 110 55 L 115 140 Z" fill="none" stroke="#00f2fe" strokeWidth="1.8" />
        {/* Ocular Eye & HUD */}
        <circle cx="150" cy="58" r="6" fill="#0f172a" stroke="#00f2fe" strokeWidth="1.5" />
        <circle cx="150" cy="58" r="2.5" fill="#f59e0b" />
        <line x1="150" y1="46" x2="150" y2="70" stroke="#00f2fe" strokeWidth="0.8" strokeDasharray="2,2" />
        <line x1="138" y1="58" x2="162" y2="58" stroke="#00f2fe" strokeWidth="0.8" strokeDasharray="2,2" />
        {/* Circuit traces */}
        <path d="M 130 50 L 140 50 L 145 42 L 155 42" fill="none" stroke="#00f2fe" strokeWidth="1.2" />
        <circle cx="155" cy="42" r="2" fill="#00f2fe" />
        <path d="M 125 75 L 138 75 L 144 85 L 150 85" fill="none" stroke="#38bdf8" strokeWidth="1.2" />
        <circle cx="150" cy="85" r="2" fill="#38bdf8" />
        <circle cx="132" cy="95" r="1.8" fill="#f59e0b" />
        <circle cx="126" cy="110" r="1.8" fill="#f59e0b" />
        {/* Data Callouts */}
        <text x="180" y="55" fill="#38bdf8" fontSize="8" fontFamily="monospace">
          OCULAR // MK.IX
        </text>
        <line x1="156" y1="58" x2="175" y2="58" stroke="#38bdf8" strokeWidth="0.8" />
        <text x="180" y="85" fill="#f59e0b" fontSize="8" fontFamily="monospace">
          NEURAL // LINK 98%
        </text>
        <line x1="152" y1="85" x2="175" y2="85" stroke="#f59e0b" strokeWidth="0.8" />
      </svg>
    ),
    preset: {
      concept: 'High-tech sci-fi technical illustration and blueprint schematic of an augmented human cyborg',
      subject: 'Cyborg human face profile with glowing ocular eye lens, exposed temple micro-circuits, and titanium jaw plating',
      style: 'Technical linework illustration, blueprint CAD vector schematics, fine cross-sections, cyberpunk cyber-anatomy',
      mood: 'Intricate, hyper-precise, futuristic, clinical, high-tech',
      camera: 'Profile portrait technical breakdown angle, precision cross-section framing',
      lighting: 'Dark field illumination with glowing holographic cyan and amber LED indicators',
      palette: 'Graphite charcoal, electric laser cyan, hazard amber, titanium silver accents',
      setting: 'Technical engineering CAD blueprint background with measurement grids and callout annotations',
      details: 'Micro-wiring around cheekbones, optical lens reticle markings, fine technical typography notations',
      negativePrompt: 'organic messy watercolor, low detail, cartoon, fuzzy blur, photorealistic human photo',
      aspectRatio: '16:9',
    },
    samplePrompt:
      'Technical CAD blueprint illustration of an augmented human cyborg face, glowing cyan ocular implant, intricate subdermal circuit lines, mecha precision schematics, dark blueprint grid background --ar 16:9',
  },
  {
    id: 'vintage-engraving',
    name: 'Vintage Woodcut & Etching Engraving',
    category: 'Hand-Drawn',
    badge: 'Antique Classic',
    description: 'Potret manusia ukiran abad ke-19 dengan arsiran silang (cross-hatching) rumit di atas kertas perkamen kuno.',
    gradient: 'linear-gradient(135deg, #b2bec3, #636e72)',
    preview: (
      <svg viewBox="0 0 320 150" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="eng-h-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fbf6eb" />
            <stop offset="100%" stopColor="#ebdcb9" />
          </linearGradient>
        </defs>
        <rect width="320" height="150" fill="url(#eng-h-bg)" />
        <rect x="25" y="10" width="270" height="130" fill="none" stroke="#261b11" strokeWidth="1.8" />
        <rect x="29" y="14" width="262" height="122" fill="none" stroke="#261b11" strokeWidth="0.8" strokeDasharray="3,2" />
        {/* Bust */}
        <path d="M 115 136 C 125 110 145 108 160 108 C 175 108 195 110 205 136 Z" fill="#261b11" />
        <line x1="135" y1="112" x2="185" y2="112" stroke="#fbf6eb" strokeWidth="1" />
        {/* Neck */}
        <path d="M 148 75 L 148 108 L 172 108 L 172 75 Z" fill="#ebdcb9" stroke="#261b11" strokeWidth="1.2" />
        <line x1="152" y1="85" x2="168" y2="95" stroke="#261b11" strokeWidth="0.8" />
        <line x1="152" y1="92" x2="168" y2="102" stroke="#261b11" strokeWidth="0.8" />
        {/* Face */}
        <ellipse cx="160" cy="65" rx="20" ry="25" fill="#fbf6eb" stroke="#261b11" strokeWidth="1.5" />
        <path d="M 166 60 Q 174 70 172 80" stroke="#261b11" strokeWidth="0.8" fill="none" />
        <path d="M 168 62 Q 176 72 174 82" stroke="#261b11" strokeWidth="0.8" fill="none" />
        <path d="M 170 64 Q 178 74 176 84" stroke="#261b11" strokeWidth="0.8" fill="none" />
        {/* Features */}
        <path d="M 152 60 Q 157 58 162 60" stroke="#261b11" strokeWidth="1.5" fill="none" />
        <path d="M 154 64 Q 158 66 162 64" stroke="#261b11" strokeWidth="1.2" fill="none" />
        <path d="M 160 62 L 158 72 L 163 72" stroke="#261b11" strokeWidth="1.2" fill="none" />
        <path d="M 156 79 Q 160 81 164 79" stroke="#261b11" strokeWidth="1.4" fill="none" />
        {/* Curly Hair */}
        <path d="M 140 60 C 135 30 185 30 180 60 Q 185 50 175 42 Q 160 38 145 42 Q 138 50 140 60 Z" fill="#261b11" />
        <circle cx="140" cy="55" r="5" fill="#261b11" />
        <circle cx="180" cy="55" r="5" fill="#261b11" />
      </svg>
    ),
    preset: {
      concept: 'Antique 19th-century copperplate woodcut portrait of a distinguished human scholar',
      subject: 'A noble Renaissance figure with dignified expression, engraved curly hair, and ornate collar',
      style: 'Traditional copperplate etching, woodblock print, intricate cross-hatching, antique Victorian bookplate portrait',
      mood: 'Scholarly, dignified, historical, timeless, classical',
      camera: 'Classic formal portrait composition with ornate filigree engraved border',
      lighting: 'Dramatic stark chiaroscuro created purely through variable ink line density and cross-hatching',
      palette: 'Deep sepia charcoal ink on weathered antique parchment cream paper',
      setting: 'Scholarly Victorian study background rendered in delicate antique engraved lines',
      details: 'Microscopic parallel engraving lines carving facial contours, cheekbone shading, aged parchment texture',
      negativePrompt: 'modern vector, 3d render, bright neon colors, smooth airbrush, photographic, blur',
      aspectRatio: '3:2',
    },
    samplePrompt:
      '19th-century antique copperplate etching portrait of a noble Renaissance scholar, dense cross-hatching facial shadows, intricate curly hair engraving, aged parchment paper, Victorian bookplate style --ar 3:2',
  },
  {
    id: 'isometric-3d-vector',
    name: 'Cute 3D Isometric Diorama',
    category: 'Vector',
    badge: '3D Miniature',
    description: 'Karakter model manusia 3D bergaya miniatur chibi yang imut, permukaan tanah liat halus (claymorphism).',
    gradient: 'linear-gradient(135deg, #55efc4, #81ecec)',
    preview: (
      <svg viewBox="0 0 320 150" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="iso-h-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#eefbf7" />
            <stop offset="100%" stopColor="#c7f3e1" />
          </linearGradient>
        </defs>
        <rect width="320" height="150" fill="url(#iso-h-bg)" />
        <polygon points="160,85 210,110 160,135 110,110" fill="#a8e6cf" stroke="#55b38f" strokeWidth="1.2" />
        <polygon points="110,110 160,135 160,145 110,120" fill="#786c57" />
        <polygon points="210,110 160,135 160,145 210,120" fill="#524738" />
        {/* Chibi Human */}
        <ellipse cx="160" cy="110" rx="18" ry="8" fill="#000000" opacity="0.15" />
        <rect x="150" y="96" width="7" height="14" rx="3.5" fill="#0984e3" />
        <rect x="163" y="96" width="7" height="14" rx="3.5" fill="#0984e3" />
        <rect x="146" y="68" width="28" height="30" rx="8" fill="#ff7675" />
        <circle cx="160" cy="52" r="17" fill="#ffeaa7" />
        <circle cx="152" cy="56" r="3" fill="#ff7675" opacity="0.5" />
        <circle cx="168" cy="56" r="3" fill="#ff7675" opacity="0.5" />
        <ellipse cx="154" cy="51" rx="1.8" ry="2.5" fill="#2d3436" />
        <ellipse cx="166" cy="51" rx="1.8" ry="2.5" fill="#2d3436" />
        <circle cx="154.5" cy="50" r="0.8" fill="#ffffff" />
        <circle cx="166.5" cy="50" r="0.8" fill="#ffffff" />
        <path d="M 143 52 C 143 32 177 32 177 52 C 177 44 172 40 160 40 C 148 40 143 44 143 52 Z" fill="#6c5ce7" />
        <circle cx="188" cy="42" r="5" fill="#fdcb6e" />
        <circle cx="132" cy="46" r="3.5" fill="#00cec9" />
      </svg>
    ),
    preset: {
      concept: 'Cute 3D isometric stylized character render of an adorable human chibi figure',
      subject: 'Charming miniature chibi character with big expressive eyes wearing a cozy oversized hoodie on a floating cube',
      style: 'Isometric 3D stylized character art, claymorphism, smooth matte surfaces, toy vinyl figurine aesthetic',
      mood: 'Playful, charming, cozy, delightful, heartwarming',
      camera: 'True 30-degree orthographic isometric angle, centered diorama perspective',
      lighting: 'Warm studio key light, soft ambient occlusion contact shadows, gentle colorful bounce light',
      palette: 'Pastel coral hoodie, soft matcha pedestal, warm golden accents, creamy skin tone',
      setting: 'Floating isometric miniature pedestal platform with subtle floating geometric elements',
      details: 'Smooth beveled edges, soft clay toy texture, clean specular highlights on eyes',
      negativePrompt: 'photorealistic adult human, harsh realistic skin pores, noisy grunge, flat 2d, distorted isometric angle',
      aspectRatio: '1:1',
    },
    samplePrompt:
      'Cute 3D isometric stylized character render of a charming human chibi figurine in a pastel hoodie, smooth matte clay surfaces, warm ambient lighting, miniature toy diorama aesthetic --ar 1:1',
  },
]
