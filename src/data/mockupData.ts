export type MockupProductType = 'tshirt' | 'totebag' | 'hoodie' | 'mug' | 'cap' | 'poster'

export type MockupColorCategory =
  | 'all'
  | 'neutral'
  | 'earth'
  | 'blue'
  | 'green'
  | 'pastel'
  | 'vibrant'

export type MockupColor = {
  id: string
  name: string
  hex: string
  contrastText: 'light' | 'dark'
  category: MockupColorCategory
}

export const mockupColorCategories: { id: MockupColorCategory; label: string }[] = [
  { id: 'all', label: 'Semua' },
  { id: 'neutral', label: 'Netral & Monokrom' },
  { id: 'earth', label: 'Earth Tone' },
  { id: 'blue', label: 'Navy & Biru' },
  { id: 'green', label: 'Hijau & Olive' },
  { id: 'pastel', label: 'Pastel' },
  { id: 'vibrant', label: 'Warna Cerah' },
]

export const mockupColors: MockupColor[] = [
  // Netral & Monokrom
  { id: 'white', name: 'Pure White', hex: '#ffffff', contrastText: 'dark', category: 'neutral' },
  { id: 'offwhite', name: 'Natural Cream', hex: '#f7f4ee', contrastText: 'dark', category: 'neutral' },
  { id: 'heather-light', name: 'Light Heather Grey', hex: '#e2e8f0', contrastText: 'dark', category: 'neutral' },
  { id: 'ash-grey', name: 'Ash Grey', hex: '#94a3b8', contrastText: 'dark', category: 'neutral' },
  { id: 'slate', name: 'Slate Grey', hex: '#475569', contrastText: 'light', category: 'neutral' },
  { id: 'charcoal', name: 'Washed Charcoal', hex: '#2f343b', contrastText: 'light', category: 'neutral' },
  { id: 'black', name: 'Onyx Black', hex: '#18181b', contrastText: 'light', category: 'neutral' },

  // Earth Tone & Hangat
  { id: 'sand', name: 'Sand Khaki', hex: '#d4b996', contrastText: 'dark', category: 'earth' },
  { id: 'warm-almond', name: 'Warm Almond', hex: '#e8dcc4', contrastText: 'dark', category: 'earth' },
  { id: 'desert-tan', name: 'Desert Tan', hex: '#c2a68c', contrastText: 'dark', category: 'earth' },
  { id: 'camel', name: 'Warm Camel', hex: '#b58a63', contrastText: 'light', category: 'earth' },
  { id: 'terracotta', name: 'Terracotta', hex: '#a64b38', contrastText: 'light', category: 'earth' },
  { id: 'rust', name: 'Rust Auburn', hex: '#8c321d', contrastText: 'light', category: 'earth' },
  { id: 'mustard', name: 'Vintage Mustard', hex: '#e5ad35', contrastText: 'dark', category: 'earth' },
  { id: 'mocha', name: 'Chocolate Mocha', hex: '#4a2e1b', contrastText: 'light', category: 'earth' },
  { id: 'espresso', name: 'Deep Espresso', hex: '#2b1b17', contrastText: 'light', category: 'earth' },

  // Navy & Biru
  { id: 'navy', name: 'Deep Navy', hex: '#16253d', contrastText: 'light', category: 'blue' },
  { id: 'midnight', name: 'Midnight Blue', hex: '#0f172a', contrastText: 'light', category: 'blue' },
  { id: 'royal-blue', name: 'Royal Blue', hex: '#1d4ed8', contrastText: 'light', category: 'blue' },
  { id: 'cobalt', name: 'Cobalt Blue', hex: '#2563eb', contrastText: 'light', category: 'blue' },
  { id: 'pacific', name: 'Pacific Ocean', hex: '#0284c7', contrastText: 'light', category: 'blue' },
  { id: 'sky-blue', name: 'Sky Blue', hex: '#38bdf8', contrastText: 'dark', category: 'blue' },
  { id: 'powder-blue', name: 'Baby Powder Blue', hex: '#bae6fd', contrastText: 'dark', category: 'blue' },

  // Hijau & Olive
  { id: 'forest', name: 'Forest Green', hex: '#1d3326', contrastText: 'light', category: 'green' },
  { id: 'deep-olive', name: 'Deep Olive', hex: '#3f4f2c', contrastText: 'light', category: 'green' },
  { id: 'army', name: 'Army Green', hex: '#4d5d3e', contrastText: 'light', category: 'green' },
  { id: 'sage', name: 'Sage Green', hex: '#84a98c', contrastText: 'dark', category: 'green' },
  { id: 'mint-green', name: 'Mint Leaf', hex: '#6ee7b7', contrastText: 'dark', category: 'green' },
  { id: 'emerald', name: 'Emerald', hex: '#059669', contrastText: 'light', category: 'green' },
  { id: 'teal', name: 'Dark Teal', hex: '#0f766e', contrastText: 'light', category: 'green' },

  // Pastel
  { id: 'soft-pink', name: 'Soft Blush Pink', hex: '#fbcfe8', contrastText: 'dark', category: 'pastel' },
  { id: 'dusty-rose', name: 'Dusty Rose', hex: '#fda4af', contrastText: 'dark', category: 'pastel' },
  { id: 'lavender', name: 'Lavender Pastel', hex: '#e9d5ff', contrastText: 'dark', category: 'pastel' },
  { id: 'pale-peach', name: 'Pale Peach', hex: '#ffedd5', contrastText: 'dark', category: 'pastel' },
  { id: 'buttercream', name: 'Buttercream', hex: '#fef08a', contrastText: 'dark', category: 'pastel' },
  { id: 'soft-mint', name: 'Soft Mint', hex: '#d1fae5', contrastText: 'dark', category: 'pastel' },
  { id: 'lilac', name: 'Powder Lilac', hex: '#ddd6fe', contrastText: 'dark', category: 'pastel' },

  // Warna Cerah (Vibrant)
  { id: 'crimson', name: 'Crimson Red', hex: '#dc2626', contrastText: 'light', category: 'vibrant' },
  { id: 'chili-red', name: 'Chili Red', hex: '#b91c1c', contrastText: 'light', category: 'vibrant' },
  { id: 'coral', name: 'Vibrant Coral', hex: '#ea580c', contrastText: 'light', category: 'vibrant' },
  { id: 'tangerine', name: 'Tangerine Orange', hex: '#f97316', contrastText: 'dark', category: 'vibrant' },
  { id: 'canary', name: 'Canary Yellow', hex: '#facc15', contrastText: 'dark', category: 'vibrant' },
  { id: 'violet', name: 'Electric Violet', hex: '#7c3aed', contrastText: 'light', category: 'vibrant' },
  { id: 'magenta', name: 'Magenta Pink', hex: '#db2777', contrastText: 'light', category: 'vibrant' },
]

export function createCustomMockupColor(hex: string, name?: string): MockupColor {
  const cleanHex = hex.startsWith('#') ? hex : `#${hex}`
  // Calculate relative luminance to determine contrast text
  let r = 0,
    g = 0,
    b = 0
  if (cleanHex.length === 7) {
    r = parseInt(cleanHex.substring(1, 3), 16)
    g = parseInt(cleanHex.substring(3, 5), 16)
    b = parseInt(cleanHex.substring(5, 7), 16)
  }
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  const contrastText = brightness > 140 ? 'dark' : 'light'

  return {
    id: `custom-${cleanHex.replace('#', '')}`,
    name: name || `Warna Kustom (${cleanHex.toUpperCase()})`,
    hex: cleanHex,
    contrastText,
    category: 'all',
  }
}
