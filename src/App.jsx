import { Outlet, useLocation } from 'react-router-dom'
import MobileNav from './components/layout/MobileNav.jsx'
import Navbar from './components/layout/Navbar.jsx'
import Sidebar from './components/layout/Sidebar.jsx'
import { useAuth } from './hooks/useAuth.js'
import './App.css'

const PUBLIC_PATHS = new Set(['/login', '/signup'])

function App() {
  const location = useLocation()
  const { user } = useAuth()

  const isPublicPath = PUBLIC_PATHS.has(location.pathname)
  const showShell = Boolean(user) && !isPublicPath

  if (!showShell) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.12),transparent_35%),linear-gradient(180deg,#f8fbff_0%,#eef4ff_100%)]">
        <Outlet />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />
      <div className="mx-auto flex max-w-420 gap-4 px-3 pb-24 pt-4 sm:px-4 sm:pt-6 lg:gap-6 lg:px-6 lg:pb-8">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  )
}

export default App
