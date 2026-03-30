import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import { getNavigationItems } from './navigation.js'

function Sidebar() {
	const { role } = useAuth()
	const items = getNavigationItems(role)

	return (
		<aside className="hidden w-72 shrink-0 lg:block">
			<div className="sticky top-24 rounded-[28px] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/70">
				<p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
					Navigation
				</p>
				<nav className="space-y-2">
					{items.map((item) => (
						<NavLink
							key={item.to}
							to={item.to}
							className={({ isActive }) =>
								[
									'block rounded-2xl px-4 py-3 text-sm font-medium transition',
									isActive
										? 'bg-blue-700 text-white shadow-lg shadow-blue-700/20'
										: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
								].join(' ')
							}
						>
							{item.label}
						</NavLink>
					))}
				</nav>
			</div>
		</aside>
	)
}

export default Sidebar
