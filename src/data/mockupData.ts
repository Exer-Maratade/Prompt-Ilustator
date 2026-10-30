export type MockupProductType = 'tshirt' | 'totebag' | 'hoodie' | 'mug' | 'cap' | 'poster'

export type MockupColor = {
  id: string
  name: string
  hex: string
  contrastText: 'light' | 'dark'
}

export const mockupColors: MockupColor[] = [
  { id: 'white', name: 'Pure White', hex: '#ffffff', contrastText: 'dark' },
  { id: 'offwhite', name: 'Natural Cream', hex: '#f7f4ee', contrastText: 'dark' },
  { id: 'black', name: 'Onyx Black', hex: '#1a1a1c', contrastText: 'light' },
  { id: 'charcoal', name: 'Washed Charcoal', hex: '#2f343b', contrastText: 'light' },
  { id: 'navy', name: 'Deep Navy', hex: '#16253d', contrastText: 'light' },
  { id: 'forest', name: 'Forest Green', hex: '#1d3326', contrastText: 'light' },
  { id: 'sand', name: 'Sand Khaki', hex: '#d9cdb8', contrastText: 'dark' },
  { id: 'terracotta', name: 'Terracotta', hex: '#a64b38', contrastText: 'light' },
  { id: 'mustard', name: 'Vintage Mustard', hex: '#e5ad35', contrastText: 'dark' },
]
