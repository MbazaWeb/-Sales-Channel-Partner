import { Link } from 'react-router-dom'
import Card from '../components/ui/Card.jsx'

function NotFound() {
	return (
		<div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 py-12">
			<Card className="w-full text-center">
				<p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-700">404</p>
				<h2 className="mt-4 text-3xl font-semibold text-slate-900">Page not found</h2>
				<p className="mt-3 text-slate-600">
					The onboarding route you requested does not exist.
				</p>
				<Link
					to="/"
					className="mt-6 inline-flex rounded-2xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
				>
					Return home
				</Link>
			</Card>
		</div>
	)
}

export default NotFound
