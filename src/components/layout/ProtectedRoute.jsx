import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROLES } from '../../config/roles.js'
import { useAuth } from '../../hooks/useAuth.js'

function ProtectedRoute({ allowedRoles }) {
	const location = useLocation()
	const { user, role, loading } = useAuth()

	if (loading) {
		return (
			<div className="rounded-3xl bg-white p-10 text-center shadow-xl shadow-slate-200/70">
				<p className="text-lg font-medium text-slate-700">Checking access...</p>
			</div>
		)
	}

	if (!user) {
		return <Navigate to="/login" replace state={{ from: location }} />
	}

	if (allowedRoles && !allowedRoles.includes(role)) {
		const fallbackRoute = role === ROLES.ADMIN ? '/admin' : '/dashboard'
		return <Navigate to={fallbackRoute} replace />
	}

	return <Outlet />
}

export default ProtectedRoute
