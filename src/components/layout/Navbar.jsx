import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button.jsx'
import { useAuth } from '../../hooks/useAuth.js'

function Navbar() {
	const navigate = useNavigate()
	const { user, role, logout } = useAuth()

	async function handleLogout() {
		await logout()
		navigate('/login', { replace: true })
	}

	return (
		<header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
			<div className="mx-auto flex max-w-420 flex-wrap items-center justify-between gap-3 px-3 py-3 sm:px-4 sm:py-4 lg:px-6">
				<div className="min-w-0 flex-1">
					<p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-700">
						SCP Onboarding System
					</p>
					<h1 className="text-base font-semibold text-slate-900 sm:text-lg">MultiChoice Partner Workflow</h1>
				</div>
				<div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
					<div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-left sm:px-4 sm:text-right">
						<p className="text-xs uppercase tracking-[0.25em] text-slate-500">{role}</p>
						<p className="max-w-40 truncate text-sm font-medium text-slate-800 sm:max-w-56">{user?.email}</p>
					</div>
					<Button variant="secondary" onClick={handleLogout}>
						Sign out
					</Button>
				</div>
			</div>
		</header>
	)
}

export default Navbar
