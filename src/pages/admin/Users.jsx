import { useEffect, useMemo, useState } from 'react'
import Card from '../../components/ui/Card.jsx'
import { getAllProfiles } from '../../services/profileService.js'
import { useApplications } from '../../hooks/useApplications.js'

function formatDate(value) {
	if (!value) {
		return 'Not available'
	}

	return new Intl.DateTimeFormat('en-GB', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	}).format(new Date(value))
}

function Users() {
	const { applications } = useApplications()
	const [profiles, setProfiles] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [searchTerm, setSearchTerm] = useState('')

	useEffect(() => {
		async function loadProfiles() {
			setLoading(true)
			setError('')

			try {
				setProfiles(await getAllProfiles())
			} catch (loadError) {
				setError(loadError.message)
			} finally {
				setLoading(false)
			}
		}

		loadProfiles()
	}, [])

	const rows = useMemo(() => {
		const normalizedSearch = searchTerm.trim().toLowerCase()

		return profiles
			.map((profile) => {
				const userApplications = applications.filter((application) => application.user_id === profile.id)
				return {
					...profile,
					applicationCount: userApplications.length,
					lastSubmittedAt: userApplications[0]?.created_at ?? null,
				}
			})
			.filter((profile) =>
				normalizedSearch === '' ||
				[profile.fullName, profile.email, profile.region, profile.role]
					.some((value) => String(value ?? '').toLowerCase().includes(normalizedSearch)),
			)
	}, [applications, profiles, searchTerm])

	return (
		<div className="space-y-6">
			<Card className="p-5 sm:p-6">
				<p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-700">Users</p>
				<h2 className="mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">All registered users</h2>
				<p className="mt-3 text-sm text-slate-600">Review the user directory, their regions, and how many applications each account has submitted.</p>
				<input type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search name, email, region, role..." className="mt-5 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-700" />
			</Card>

			{loading ? <Card>Loading users...</Card> : null}
			{error ? <Card className="text-rose-700">{error}</Card> : null}

			{!loading && !error ? (
				<Card className="overflow-hidden p-0">
					<div className="overflow-x-auto">
						<table className="min-w-full text-left text-sm">
							<thead className="bg-slate-50 text-slate-500">
								<tr>
									<th className="px-6 py-4 font-medium">Name</th>
									<th className="px-6 py-4 font-medium">Email</th>
									<th className="px-6 py-4 font-medium">Region</th>
									<th className="px-6 py-4 font-medium">Role</th>
									<th className="px-6 py-4 font-medium">Applications</th>
									<th className="px-6 py-4 font-medium">Last Submitted</th>
									<th className="px-6 py-4 font-medium">Created</th>
								</tr>
							</thead>
							<tbody>
								{rows.map((profile) => (
									<tr key={profile.id} className="border-t border-slate-100 align-top">
										<td className="px-6 py-5 font-medium text-slate-900">{profile.fullName || 'No name set'}</td>
										<td className="px-6 py-5 text-slate-700">{profile.email}</td>
										<td className="px-6 py-5 text-slate-700">{profile.region || 'Not provided'}</td>
										<td className="px-6 py-5 text-slate-700">{profile.role}</td>
										<td className="px-6 py-5 text-slate-700">{profile.applicationCount}</td>
										<td className="px-6 py-5 text-slate-700">{formatDate(profile.lastSubmittedAt)}</td>
										<td className="px-6 py-5 text-slate-700">{formatDate(profile.created_at)}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</Card>
			) : null}
		</div>
	)
}

export default Users