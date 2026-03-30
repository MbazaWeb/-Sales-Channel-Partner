import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button.jsx'
import { useAuth } from '../../hooks/useAuth.js'

const HEADER_LOGO_SRC = '/Header.png'

function Navbar() {
	const navigate = useNavigate()
	const { user, profile, role, logout } = useAuth()

	async function handleLogout() {
		await logout()
		navigate('/login', { replace: true })
	}

	return (
		<header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
			<div className="mx-auto flex w-full max-w-[1680px] flex-wrap items-center justify-between gap-3 px-3 py-3 sm:px-4 sm:py-4 lg:px-6 xl:px-8">
				<div className="flex min-w-0 flex-1 items-center gap-3">
					<img src={HEADER_LOGO_SRC} alt="MultiChoice Africa" className="h-10 w-auto rounded-xl bg-slate-50 px-2 py-1 shadow-sm sm:h-12" />
					<div className="min-w-0">
						<p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-blue-700 sm:text-xs sm:tracking-[0.3em]">
						SCP Onboarding System
						</p>
						<h1 className="text-sm font-semibold text-slate-900 sm:text-lg">MultiChoice Partner Workflow</h1>
					</div>
				</div>
				<div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
					<div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-left sm:px-4 sm:text-right">
						<p className="text-xs uppercase tracking-[0.25em] text-slate-500">{role}</p>
						<p className="max-w-32 truncate text-sm font-medium text-slate-800 sm:max-w-56">{profile?.fullName || user?.email}</p>
						<p className="max-w-32 truncate text-xs text-slate-500 sm:max-w-56">{user?.email}</p>
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
