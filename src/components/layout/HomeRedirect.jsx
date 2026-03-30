import { Navigate } from 'react-router-dom'
import { ROLES } from '../../config/roles.js'
import { useAuth } from '../../hooks/useAuth.js'

function HomeRedirect() {
  const { user, role, loading } = useAuth()

  if (loading) {
    return <div className="rounded-3xl bg-white/80 p-10 shadow-xl">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return role === ROLES.ADMIN ? (
    <Navigate to="/admin" replace />
  ) : (
    <Navigate to="/dashboard" replace />
  )
}

export default HomeRedirect