export type IllustratorTemplate = {
  id: string
  name: string
  category: 'Vector' | 'Anime/Manga' | 'Hand-Drawn' | 'Retro' | 'Concept' | 'Merch'
  badge: string
  description: string
  gradient: string
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
    description: 'Bentuk geometris bersih, warna solid tanpa gradien berlebih, cocok untuk icon, UI, dan maskot.',
    gradient: 'linear-gradient(135deg, #00b894, #00cec9)',
    preset: {
      concept: 'Minimalist flat vector illustration of an urban creative workspace',
      subject: 'A creative professional working with coffee, laptop, and monstera plant',
      style: 'Flat 2D vector art, clean sharp lines, bold geometric silhouettes, corporate modern illustration',
      mood: 'Productive, calm, friendly, accessible',
      camera: 'Orthographic front view, eye level composition',
      lighting: 'Bright ambient daylight, minimal soft drop shadows, solid fills',
      palette: 'Sage green, soft terracotta, warm beige, crisp navy accents',
      setting: 'Sunlit modern Scandinavian home office studio with tidy shelves',
      details: 'Crisp vector anchor points, SVG precision, elegant minimal facial features',
      negativePrompt: 'photorealistic, 3d render, messy brushwork, noisy textures, blur, bevels',
      aspectRatio: '1:1',
    },
    samplePrompt:
      'Flat 2D vector art of a coffee barista brewing latte, minimalist geometric shapes, crisp linework, pastel mustard and warm slate palette, clean white background, vector graphic, dribbble aesthetic --ar 1:1',
  },
  {
    id: 'anime-cel-shade',
    name: 'Japanese Anime / Manga Key Visual',
    category: 'Anime/Manga',
    badge: 'Shonen / Makoto Shinkai',
    description: 'Gaya anime modern dengan garis dinamis, cel-shading rapi, dan efek pencahayaan dramatis.',
    gradient: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
    preset: {
      concept: 'Breathtaking anime key visual illustration with dynamic sky',
      subject: 'Young anime protagonist holding a glowing crystal relic',
      style: 'Japanese animation key visual, crisp ink linework, multi-layered cel shading, Makoto Shinkai inspired lighting',
      mood: 'Nostalgic, emotional, wonder, epic cinematic atmosphere',
      camera: 'Low angle heroic perspective, wide-angle cinematic framing',
      lighting: 'Brilliant sunset rim light, sun flares, volumetric atmospheric light rays',
      palette: 'Deep indigo sky, vibrant magenta, gold amber sunset reflections, cyan highlights',
      setting: 'Overlooking a seaside coastal cliff and towering cumulonimbus clouds',
      details: 'Fine detailed hair strands catching wind, floating light particles, crisp anime eyes',
      negativePrompt: 'blurry, western comic style, photographic, low quality anatomy, extra limbs, dull colors',
      aspectRatio: '16:9',
    },
    samplePrompt:
      'Anime illustration key visual of a cyber samurai standing atop a neon skyscraper in rainy Tokyo, cel shaded, glowing katana, lens flares, dramatic composition, 4k anime masterpiece --ar 16:9',
  },
  {
    id: 'watercolor-storybook',
    name: 'Watercolor & Children’s Book',
    category: 'Hand-Drawn',
    badge: 'Cozy & Whimsical',
    description: 'Tekstur kertas berpori, goresan cat air basah (wet-on-wet), hangat dan puitis untuk buku cerita.',
    gradient: 'linear-gradient(135deg, #fd79a8, #fab1a0)',
    preset: {
      concept: 'Whimsical watercolor illustration for a storybook tale',
      subject: 'A curious red fox and a tiny hedgehog sharing tea under a giant mushroom',
      style: 'Hand-painted watercolor and gouache, visible cold-press paper grain, delicate ink outline, soft edge bleeds',
      mood: 'Cozy, gentle, enchanting, peaceful storybook charm',
      camera: 'Eye-level close-up diorama composition, shallow focus',
      lighting: 'Soft dappled morning forest sunshine, golden warm glow',
      palette: 'Forest moss green, burnt orange ochre, warm cream, soft lavender shadows',
      setting: 'Enchanted autumn forest floor carpeted with glowing moss and dew drops',
      details: 'Organic watercolor pigment puddling, dry brush accents, whimsical character expressions',
      negativePrompt: 'photorealistic, harsh neon, sharp vector edges, plastic 3d, dark gory theme, digital sheen',
      aspectRatio: '4:5',
    },
    samplePrompt:
      'Whimsical watercolor storybook illustration of a cozy bookstore cottage inside an old oak tree, warm glowing lantern, hand-painted gouache details, textured paper grain --ar 4:5',
  },
  {
    id: 'retro-pop-art',
    name: 'Vintage Pop Art & Comic Book',
    category: 'Retro',
    badge: 'Roy Lichtenstein & Comic',
    description: 'Titik halftone Ben-Day, tinta hitam tebal, warna CMYK kontras tinggi, dan gaya komik klasik.',
    gradient: 'linear-gradient(135deg, #e17055, #ffeaa7)',
    preset: {
      concept: '1960s vintage pop art comic book panel illustration',
      subject: 'Retro heroic astronaut looking at a cosmic anomaly with shock and awe',
      style: 'Classic vintage comic book print, bold black brush ink contours, Ben-Day dot halftone screening, Pop Art aesthetic',
      mood: 'Dramatic, nostalgic, punchy, retro-futuristic',
      camera: 'Close-up dramatic portrait framing with dynamic speech bubble border',
      lighting: 'Graphic flat shading, high contrast hard shadows, vibrant primary color illumination',
      palette: 'Primary CMYK: cadmium red, cobalt blue, lemon yellow, stark newsprint off-white',
      setting: 'Retro sci-fi spaceship cockpit filled with mechanical gauges and levers',
      details: 'Authentic paper aging texture, offset screen-print misalignment, bold comic hatching',
      negativePrompt: 'photorealistic 3d, smooth airbrush gradient, modern digital clean, washed out pastel',
      aspectRatio: '1:1',
    },
    samplePrompt:
      'Vintage pop art comic panel of a stylish woman wearing 60s cat-eye sunglasses, Ben-Day halftone dots, thick black ink lines, bold red and cyan colors, vintage print texture --ar 1:1',
  },
  {
    id: 'sticker-merch',
    name: 'Sticker & Apparel Vector Merch',
    category: 'Merch',
    badge: 'T-shirt & Merch Ready',
    description: 'Desain lencana vector dengan border die-cut putih tebal, sangat ideal untuk cetak kaos dan stiker.',
    gradient: 'linear-gradient(135deg, #e84393, #fd79a8)',
    preset: {
      concept: 'Bold die-cut sticker and streetwear merchandise graphic illustration',
      subject: 'Cybernetic tiger roaring with neon Japanese kanji calligraphy',
      style: 'Vector streetwear badge, thick white die-cut contour border, bold screen-print lines, aggressive dynamic typography',
      mood: 'Edgy, energetic, premium streetwear, rebellious',
      camera: 'Centered frontal graphic emblem, isolated layout',
      lighting: 'Crisp high-contrast lighting, bold neon accent highlights',
      palette: 'Signal orange, electric cyan, matte jet black, crisp pure white',
      setting: 'Isolated on plain neutral background for easy print placement',
      details: 'Heavy outer sticker border, vector screen-print separation, intricate fur line art',
      negativePrompt: 'photograph, blurry background, gradient mesh, complex photographic scene, human face photo',
      aspectRatio: '1:1',
    },
    samplePrompt:
      'Streetwear vector graphic of a cosmic astronaut surfing a solar wave, thick die-cut white sticker border, bold screen-print linework, isolated on white background, apparel design ready --ar 1:1',
  },
  {
    id: 'cyberpunk-lineart',
    name: 'Cyberpunk & Sci-Fi Technical Line Art',
    category: 'Concept',
    badge: 'Detailed Mecha',
    description: 'Garis teknikal rumit, skema mecha fiksi ilmiah, aksen hologram neon pada latar gelap.',
    gradient: 'linear-gradient(135deg, #0984e3, #6c5ce7)',
    preset: {
      concept: 'High-tech sci-fi technical illustration and mecha blueprint',
      subject: 'Futuristic bionic cybernetic prosthetic arm with exposed internal gears and carbon fiber plates',
      style: 'Technical linework illustration, blueprint vector schematics, fine cross-sections, cyberpunk aesthetic',
      mood: 'Intricate, intellectual, high-tech, precise',
      camera: 'Detailed three-quarter product breakdown angle',
      lighting: 'Dark field illumination with glowing holographic cyan and amber LED indicators',
      palette: 'Graphite charcoal, electric cyan, bright hazard yellow, titanium silver',
      setting: 'Technical CAD blueprint background with measurement grids and callout annotations',
      details: 'Micro-wiring details, hydraulic pistons, fine technical typography notations',
      negativePrompt: 'organic messy watercolor, low detail, cartoon, fuzzy blur, photorealistic skin',
      aspectRatio: '16:9',
    },
    samplePrompt:
      'Cyberpunk technical line art of a futuristic hoverbike, exploded view schematic, glowing neon wires, ultra-detailed vector line work, dark blueprint style --ar 16:9',
  },
  {
    id: 'vintage-engraving',
    name: 'Vintage Woodcut & Etching Engraving',
    category: 'Hand-Drawn',
    badge: 'Antique Classic',
    description: 'Teknik ukiran kayu klasik (woodcut), arsir silang rapi (cross-hatching), gaya logo dan botani antik.',
    gradient: 'linear-gradient(135deg, #b2bec3, #636e72)',
    preset: {
      concept: 'Antique 19th-century woodcut engraving illustration',
      subject: 'Majestic mythical kraken rising beneath an old galleon sailing ship',
      style: 'Traditional copperplate etching, woodblock print, intricate cross-hatching, antique Victorian book illustration',
      mood: 'Mysterious, classic, historical, scholarly, timeless',
      camera: 'Classic hand-engraved book plate composition with ornate ornamental border',
      lighting: 'Dramatic stark chiaroscuro created purely through variable ink line density',
      palette: 'Deep sepia ink on weathered parchment cream background',
      setting: 'Turbulent ocean waves with storm clouds in vintage etched style',
      details: 'Microscopic parallel engraving lines, parchment paper stains, ornate filigree frame',
      negativePrompt: 'modern vector, 3d render, bright neon colors, smooth airbrush, photographic, blur',
      aspectRatio: '3:2',
    },
    samplePrompt:
      'Vintage etching illustration of an antique pocket watch entwined with wild roses and thorns, fine cross-hatching linework, monochrome sepia ink on parchment paper --ar 1:1',
  },
  {
    id: 'isometric-3d-vector',
    name: 'Cute 3D Isometric Diorama',
    category: 'Vector',
    badge: '3D Miniature',
    description: 'Diorama isometrik imut dengan pencahayaan lembut, tampilan seperti miniatur mainan atau kota kecil.',
    gradient: 'linear-gradient(135deg, #55efc4, #81ecec)',
    preset: {
      concept: 'Cute isometric 3D miniature diorama island illustration',
      subject: 'A cozy Japanese ramen bar stand with glowing red lanterns and steaming bowls on a floating mini cube',
      style: 'Isometric 3D stylized vector art, claymorphism, smooth matte surfaces, miniature toy aesthetic',
      mood: 'Playful, charming, cozy, inviting, delightful',
      camera: 'True 30-degree orthographic isometric angle',
      lighting: 'Warm ambient interior lantern glow, soft ambient occlusion shadows, gentle bounce light',
      palette: 'Pastel matcha green, warm vermilion, creamy broth white, bamboo timber brown',
      setting: 'Floating miniature square parcel with tiny cobblestone path and sakura bonsai tree',
      details: 'Tiny steaming soup particles, soft rounded beveled corners, clean solid colors',
      negativePrompt: 'photorealistic human, harsh noisy grunge, flat 2d, distorted isometric angle, dark grim',
      aspectRatio: '1:1',
    },
    samplePrompt:
      'Cute 3D isometric diorama of a miniature coffee shop greenhouse on a floating floating island, soft pastel colors, clay render aesthetic, warm ambient lighting --ar 1:1',
  },
]
