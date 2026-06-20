// lib/db.ts
import fs from 'fs'
import path from 'path'

// @ts-ignore
const Database = require('better-sqlite3')

// Pastikan folder database ada
const dbDir = path.join(process.cwd(), 'database')
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const db = new Database(path.join(dbDir, 'galeri.db'))

// Buat tabel jika belum ada
db.exec(`
  CREATE TABLE IF NOT EXISTS galeri (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    kategori TEXT DEFAULT 'kegiatan',
    imageUrl TEXT NOT NULL,
    date TEXT DEFAULT (date('now')),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

console.log('✅ Database siap digunakan')

export default db
