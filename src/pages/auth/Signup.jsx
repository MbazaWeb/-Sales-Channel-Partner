import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button.jsx'
import Card from '../../components/ui/Card.jsx'
import { useAuth } from '../../hooks/useAuth.js'

function Signup() {
	const navigate = useNavigate()
	const { signup, authError, isConfigured } = useAuth()
	const [form, setForm] = useState({ fullName: '', region: '', email: '', password: '', confirmPassword: '' })
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')

	async function handleSubmit(event) {
		event.preventDefault()
		setError('')
		setSuccess('')

		if (form.password !== form.confirmPassword) {
			setError('Passwords do not match.')
			return
		}

		setLoading(true)

		try {
			await signup({
				email: form.email,
				password: form.password,
				metadata: {
					full_name: form.fullName,
					region: form.region,
				},
			})
			setSuccess('Account created. Check your email to confirm your registration if confirmation is enabled.')
			navigate('/login', { replace: true })
		} catch (submitError) {
			setError(submitError.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 py-10 lg:px-8">
			<Card className="w-full max-w-2xl p-8 lg:p-10">
				<p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-700">Create account</p>
				<h2 className="mt-4 text-3xl font-semibold text-slate-900">Register for onboarding form</h2>
				<p className="mt-3 text-sm text-slate-600">
					Create your account and include your region so the onboarding team can identify your location quickly.
				</p>
				{!isConfigured && authError ? (
					<div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
						{authError}
					</div>
				) : null}
				{error ? (
					<div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
						{error}
					</div>
				) : null}
				{success ? (
					<div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
						{success}
					</div>
				) : null}
				<form className="mt-8 space-y-5" onSubmit={handleSubmit}>
					<label className="block">
						<span className="mb-2 block text-sm font-medium text-slate-700">Full name</span>
						<input
							value={form.fullName}
							onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
							className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
							required
						/>
					</label>
					<label className="block">
						<span className="mb-2 block text-sm font-medium text-slate-700">Region</span>
						<input
							value={form.region}
							onChange={(event) => setForm((current) => ({ ...current, region: event.target.value }))}
							className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
							placeholder="Enter your region"
							required
						/>
					</label>
					<label className="block">
						<span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
						<input
							type="email"
							value={form.email}
							onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
							className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
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
							required
						/>
					</label>
					<label className="block">
						<span className="mb-2 block text-sm font-medium text-slate-700">Confirm password</span>
						<input
							type="password"
							value={form.confirmPassword}
							onChange={(event) =>
								setForm((current) => ({ ...current, confirmPassword: event.target.value }))
							}
							className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
							required
						/>
					</label>
					<Button type="submit" className="w-full" disabled={loading || !isConfigured}>
						{loading ? 'Creating account...' : 'Create account'}
					</Button>
				</form>
				<p className="mt-6 text-sm text-slate-600">
					Already registered?{' '}
					<Link className="font-semibold text-blue-700 hover:text-blue-800" to="/login">
						Sign in
					</Link>
				</p>
			</Card>
		</div>
	)
}

export default Signup
