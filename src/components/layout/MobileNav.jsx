import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import { getNavigationItems } from './navigation.js'

function MobileNav() {
	const { role } = useAuth()
	const items = getNavigationItems(role)

	if (!items.length) {
		return null
	}

	return (
		<nav className="fixed inset-x-3 bottom-3 z-40 rounded-[24px] border border-slate-200 bg-white/95 p-2 shadow-2xl shadow-slate-950/15 backdrop-blur lg:hidden">
			<div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
				{items.map((item) => (
					<NavLink
						key={item.to}
						to={item.to}
						className={({ isActive }) =>
							[
								'flex min-h-14 items-center justify-center rounded-2xl px-2 text-center text-[11px] font-semibold leading-tight transition',
								isActive
									? 'bg-blue-700 text-white shadow-lg shadow-blue-700/25'
									: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
							].join(' ')
						}
					>
						{item.shortLabel ?? item.label}
					</NavLink>
				))}
			</div>
		</nav>
	)
}

export default MobileNav