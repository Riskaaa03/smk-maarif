import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Warna Sage Green - Natural & Segar
       "nu-green": {
          // Ramp baru: Hijau Segar — lebih cerah & modern
          // Tetap dalam keluarga hijau tapi bergeser ke yellow-green
          // agar tampil energik dan tidak berat seperti hijau tua lama.
          50:  "#f2f8eb",   // latar section, badge bg
          100: "#dff0c4",   // border halus, bg hover ringan
          200: "#bfe08e",   // border card, aksen subtle
          300: "#97c459",   // strip card ketiga, aksen cerah
          400: "#78ab35",   // teks muted di latar terang
          500: "#5e9020",   // icon, label kecil
          600: "#4a7418",   // tombol utama, link aktif
          700: "#385a12",   // bg dark strip card pertama
          800: "#27400c",   // navbar, bg InfoCard
          900: "#182808",   // teks heading utama
        },
        'nu-gold': {
  50: '#fef9e6',
  100: '#fcf0cc',
  200: '#f9e199',
  300: '#f5d266',
  400: '#f2c333',
  500: '#c9a03d',    // Gold lembut (warna aksen)
  600: '#a十七d30',
  700: '#805e24',
  800: '#604618',
  900: '#402e0f',
},
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
