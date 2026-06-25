// App.jsx
import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { warmModel } from './services/ai'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ExplorePage from './pages/ExplorePage'
import AnimalProfile from './pages/AnimalProfile'
import ChatPage from './pages/ChatPage'
import EndangeredPage from './pages/EndangeredPage'

// Shared page-transition wrapper: fade + slight upward slide.
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
}

function Page({ children }) {
  return (
    <motion.main
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="mx-auto w-full max-w-7xl px-5 pb-20 pt-24 sm:px-8"
    >
      {children}
    </motion.main>
  )
}

export default function App() {
  const location = useLocation()

  // Pre-load the model into RAM on first mount so the first profile/chat
  // request doesn't pay the cold-start cost while the user waits.
  useEffect(() => {
    warmModel()
  }, [])

  return (
    <div className="min-h-screen">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <Page>
                <Home />
              </Page>
            }
          />
          <Route
            path="/explore"
            element={
              <Page>
                <ExplorePage />
              </Page>
            }
          />
          <Route
            path="/animal/:name"
            element={
              <Page>
                <AnimalProfile />
              </Page>
            }
          />
          <Route
            path="/chat"
            element={
              <Page>
                <ChatPage />
              </Page>
            }
          />
          <Route
            path="/endangered"
            element={
              <Page>
                <EndangeredPage />
              </Page>
            }
          />
          <Route
            path="*"
            element={
              <Page>
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <h1 className="font-display text-5xl font-bold text-text-primary">404</h1>
                  <p className="mt-3 text-text-muted">This trail leads nowhere. Head back home.</p>
                </div>
              </Page>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  )
}
