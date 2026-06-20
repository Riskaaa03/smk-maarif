'use client'

import { useState, useEffect } from 'react'
import HeroSection from '@/components/home/HeroSection'
import InfoCardGrid from '@/components/home/InfoCardGrid'
import ProgramKeahlianSection from '@/components/home/ProgramKeahlianSection'
import GaleriSection from '@/components/home/GaleriSection'
import MitraIndustriSection from '@/components/home/MitraIndustriSection'
import EkstrakurikulerSection from '@/components/home/EkstrakurikulerSection'
import BeritaTerbaruSection from '@/components/home/BeritaTerbaruSection'

export default function HomePage() {
  const [galeriItems, setGaleriItems] = useState([])
  const [beritaItems, setBeritaItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [galeriRes, beritaRes] = await Promise.all([
          fetch('/api/galeri'),
          fetch('/api/berita?limit=3')
        ])
        
        const galeriData = await galeriRes.json()
        const beritaData = await beritaRes.json()
        
        // Debug: cek data di console
        console.log('Data dari API galeri:', galeriData)
        
        if (galeriData.success) {
          const items = galeriData.items.slice(0, 6)
          console.log('Items yang akan ditampilkan:', items)
          setGaleriItems(items)
        } else {
          console.error('Galeri API tidak sukses:', galeriData)
        }
        
        if (beritaData.success) setBeritaItems(beritaData.items || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <main>
        <HeroSection />
        <div className="py-20 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
          <p className="mt-3 text-slate-500">Memuat konten...</p>
        </div>
      </main>
    )
  }

  // Debug: cek state sebelum render
  console.log('State galeriItems sebelum render:', galeriItems)

  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <InfoCardGrid />
      <ProgramKeahlianSection />
      <GaleriSection items={galeriItems} />
      <MitraIndustriSection />
      <EkstrakurikulerSection />
      <BeritaTerbaruSection articles={beritaItems} />
    </main>
  )
}