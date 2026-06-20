const fs = require('fs')
const path = require('path')

// Buat folder jika belum ada
const uploadDir = path.join(process.cwd(), 'public/uploads/sarpras')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Data gambar
const images = [
  { name: 'ruang-kelas', emoji: '🏫', label: 'Ruang Kelas' },
  { name: 'lab-komputer', emoji: '💻', label: 'Lab Komputer' },
  { name: 'perpustakaan', emoji: '📚', label: 'Perpustakaan' },
  { name: 'sarana-olahraga', emoji: '⚽', label: 'Sarana Olahraga' }
]

// Buat SVG untuk setiap gambar
for (const img of images) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f0f9f4;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#d4e8d8;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#grad)" rx="20"/>
  <text x="400" y="280" font-size="100" text-anchor="middle" dominant-baseline="central" font-family="Arial">${img.emoji}</text>
  <text x="400" y="370" font-size="32" fill="#1a5c3a" text-anchor="middle" dominant-baseline="central" font-weight="bold" font-family="Arial">${img.label}</text>
  <text x="400" y="420" font-size="16" fill="#1a5c3a" text-anchor="middle" dominant-baseline="central" opacity="0.5" font-family="Arial">SMK Ma'arif NU 01 Karangkobar</text>
  <rect x="10" y="10" width="780" height="580" rx="15" fill="none" stroke="#1a5c3a" stroke-width="2" stroke-opacity="0.1"/>
</svg>`
  
  const filePath = path.join(uploadDir, `${img.name}.jpg`)
  fs.writeFileSync(filePath, svg)
  console.log(`✅ ${img.name}.jpg dibuat`)
}

console.log('')
console.log('✅ Semua gambar placeholder berhasil dibuat!')
console.log(`📁 Lokasi: ${uploadDir}`)
console.log('')
console.log('📌 Buka halaman: http://localhost:3000/sarana-prasarana')