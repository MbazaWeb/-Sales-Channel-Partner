import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button.jsx'
import Card from '../../components/ui/Card.jsx'
import { useAuth } from '../../hooks/useAuth.js'

const HEADER_LOGO_SRC = '/Header.png'

function Login() {
	const navigate = useNavigate()
	const location = useLocation()
	const { login, user, role, authError, isConfigured } = useAuth()
	const [form, setForm] = useState({ email: '', password: '' })
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	useEffect(() => {
		if (!user) {
			return
		}

		navigate(role === 'ADMIN' ? '/admin' : '/dashboard', { replace: true })
	}, [navigate, role, user])

	async function handleSubmit(event) {
		event.preventDefault()
		setError('')
		setLoading(true)

		try {
			await login(form)
			const fallback = location.state?.from?.pathname ?? '/'
			navigate(fallback, { replace: true })
		} catch (submitError) {
			setError(submitError.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10 lg:px-8">
			<div className="grid w-full gap-8 lg:grid-cols-[1.15fr_0.85fr]">
				<div className="hidden rounded-[36px] bg-[linear-gradient(135deg,rgba(30,64,175,0.95),rgba(15,23,42,0.95))] p-10 text-white shadow-2xl shadow-blue-950/30 lg:block">
					<img src={HEADER_LOGO_SRC} alt="MultiChoice Africa" className="h-24 w-auto rounded-2xl bg-white/95 px-5 py-3 shadow-lg shadow-slate-950/20" />
					<p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-200">MultiChoice Africa</p>
					<h2 className="mt-8 max-w-xl text-5xl font-semibold leading-tight">
						Partner onboarding with PDF-accurate capture, review, and approval.
					</h2>
					<p className="mt-6 max-w-lg text-base text-blue-100/90">
						Secure authentication, structured application storage, controlled uploads, and role-based review are all wired into a single workflow.
					</p>
				</div>
				<Card className="mx-auto w-full max-w-xl p-8 lg:p-10">
					<img src={HEADER_LOGO_SRC} alt="MultiChoice Africa" className="h-20 w-auto rounded-2xl bg-slate-50 px-4 py-2 shadow-sm" />
					<p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-700">Sign in</p>
					<h2 className="mt-4 text-3xl font-semibold text-slate-900">Access the SCP portal</h2>
					<p className="mt-3 text-sm text-slate-600">
						Sign in to continue with partner onboarding, reviews, and approved application downloads.
					</p>
					{!isConfigured || authError ? (
						<div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
							{authError || 'Supabase is not configured.'}
						</div>
					) : null}
					{error ? (
						<div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
							{error}
						</div>
					) : null}
					<form className="mt-8 space-y-5" onSubmit={handleSubmit}>
						<label className="block">
							<span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
							<input
								type="email"
								value={form.email}
								onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
								className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
								placeholder="partner@company.com"
								required
							/>
						</label>
						<label className="block">
							<span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
							<input
								type="password"
								value={form.password}
								onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
								className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
								placeholder="Enter your password"
								required
							/>
						</label>
						<Button type="submit" className="w-full" disabled={loading || !isConfigured}>
							{loading ? 'Signing in...' : 'Sign in'}
						</Button>
					</form>
					<p className="mt-6 text-sm text-slate-600">
						Need an account?{' '}
						<Link className="font-semibold text-blue-700 hover:text-blue-800" to="/signup">
							Create one
						</Link>
					</p>
				</Card>
			</div>
		</div>
	)
}

export default Login
