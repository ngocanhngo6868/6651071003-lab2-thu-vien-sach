import { lazy, Suspense } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import PageTransition from './components/PageTransition'

const ListPage = lazy(() => import('./pages/ListPage'))
const DetailPage = lazy(() => import('./pages/DetailPage'))

function App() {
  const location = useLocation()
  return (
    <Suspense fallback={<p className="p-8">Đang tải...</p>}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><ListPage /></PageTransition>} />
          <Route path="/item/:id" element={<PageTransition><DetailPage /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  )
}

export default App