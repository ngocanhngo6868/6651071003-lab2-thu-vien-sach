import { AnimatePresence } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import PageTransition from './components/PageTransition'
import ListPage from './pages/ListPage'
import DetailPage from './pages/DetailPage'

function App() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><ListPage /></PageTransition>} />
        <Route path="/item/:id" element={<PageTransition><DetailPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}

export default App