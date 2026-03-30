import { useEffect, useState } from 'react'
import Button from '../../components/ui/Button.jsx'
import Card from '../../components/ui/Card.jsx'
import { USER_PROFILE_REGIONS } from '../../utils/constants.js'
import { useAuth } from '../../hooks/useAuth.js'
import { useTheme } from '../../hooks/useTheme.js'

function Settings({ showHeader = true }) {
	const { user, profile, saveAccountProfile, updatePassword } = useAuth()
	const { theme, setTheme } = useTheme()
	const [profileForm, setProfileForm] = useState({
		fullName: profile?.fullName ?? user?.user_metadata?.full_name ?? '',
		region: profile?.region ?? user?.user_metadata?.region ?? '',
	})
	const [passwordForm, setPasswordForm] = useState({ password: '', confirmPassword: '' })
	const [message, setMessage] = useState('')
	const [error, setError] = useState('')

	useEffect(() => {
		setProfileForm({
			fullName: profile?.fullName ?? user?.user_metadata?.full_name ?? '',
			region: profile?.region ?? user?.user_metadata?.region ?? '',
		})
	}, [profile?.fullName, profile?.region, user?.user_metadata?.full_name, user?.user_metadata?.region])

	async function handleProfileSubmit(event) {
		event.preventDefault()
		setMessage('')
		setError('')

		try {
			await saveAccountProfile(profileForm)
			setMessage('Profile updated successfully.')
		} catch (submitError) {
			setError(submitError.message)
		}
	}

	async function handlePasswordSubmit(event) {
		event.preventDefault()
		setMessage('')
		setError('')

		if (passwordForm.password !== passwordForm.confirmPassword) {
			setError('Passwords do not match.')
			return
		}

		try {
			await updatePassword(passwordForm.password)
			setPasswordForm({ password: '', confirmPassword: '' })
			setMessage('Password updated successfully.')
		} catch (submitError) {
			setError(submitError.message)
		}
	}

	return (
		<div className="space-y-6">
			{showHeader ? (
				<Card className="p-5 sm:p-6">
					<p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-700">Settings</p>
					<h2 className="mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">Manage your account</h2>
					<p className="mt-3 text-sm text-slate-600">Update your name, region, theme preference, and password.</p>
				</Card>
			) : null}

			{error ? <Card className="text-rose-700">{error}</Card> : null}
			{message ? <Card className="text-emerald-700">{message}</Card> : null}

			<Card className="p-5 sm:p-6">
				<h3 className="text-xl font-semibold text-slate-900">Profile</h3>
				<form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={handleProfileSubmit}>
					<label className="space-y-2 md:col-span-2">
						<span className="text-sm font-medium text-slate-700">Full name</span>
						<input value={profileForm.fullName} onChange={(event) => setProfileForm((current) => ({ ...current, fullName: event.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-700" required />
					</label>
					<label className="space-y-2">
						<span className="text-sm font-medium text-slate-700">Region</span>
						<select value={profileForm.region} onChange={(event) => setProfileForm((current) => ({ ...current, region: event.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-700" required>
							<option value="">Select region</option>
							{USER_PROFILE_REGIONS.map((region) => <option key={region} value={region}>{region}</option>)}
						</select>
					</label>
					<label className="space-y-2">
						<span className="text-sm font-medium text-slate-700">Email</span>
						<input value={user?.email ?? ''} className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500" disabled />
					</label>
					<div className="md:col-span-2">
						<Button type="submit">Save profile</Button>
					</div>
				</form>
			</Card>

			<Card className="p-5 sm:p-6">
				<h3 className="text-xl font-semibold text-slate-900">Theme</h3>
				<div className="mt-5 flex flex-wrap gap-3">
					<Button variant={theme === 'light' ? 'primary' : 'secondary'} onClick={() => setTheme('light')}>White theme</Button>
					<Button variant={theme === 'dark' ? 'primary' : 'secondary'} onClick={() => setTheme('dark')}>Dark theme</Button>
				</div>
			</Card>

			<Card className="p-5 sm:p-6">
				<h3 className="text-xl font-semibold text-slate-900">Change password</h3>
				<form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={handlePasswordSubmit}>
					<label className="space-y-2">
						<span className="text-sm font-medium text-slate-700">New password</span>
						<input type="password" value={passwordForm.password} onChange={(event) => setPasswordForm((current) => ({ ...current, password: event.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-700" minLength={6} required />
					</label>
					<label className="space-y-2">
						<span className="text-sm font-medium text-slate-700">Confirm password</span>
						<input type="password" value={passwordForm.confirmPassword} onChange={(event) => setPasswordForm((current) => ({ ...current, confirmPassword: event.target.value }))} className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-700" minLength={6} required />
					</label>
					<div className="md:col-span-2">
						<Button type="submit">Update password</Button>
					</div>
				</form>
			</Card>
		</div>
	)
}

export default Settings