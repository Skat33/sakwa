import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        /* Biblioteki do osobnych paczek. Suma bajtów zostaje ta sama, ale:
           - przeglądarka pobiera je równolegle zamiast jednego pliku ~1 MB,
           - po wdrożeniu zmiany w aplikacji użytkownik dociąga tylko mały
             fragment z jej kodem, a recharts/react/supabase/ikony zostają
             w cache (dotąd każdy deploy unieważniał cały megabajt).
           Postać funkcyjna, bo build stoi na rolldown (mapa obiektowa nie działa). */
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('recharts') || id.includes('d3-') || id.includes('victory-vendor')) return 'recharts'
          if (id.includes('@supabase')) return 'supabase'
          if (id.includes('lucide-react')) return 'icons'
          if (id.includes('react-dom') || id.includes('/react/') || id.includes('scheduler')) return 'react'
        },
      },
    },
  },
})
