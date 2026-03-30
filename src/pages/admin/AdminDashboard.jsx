import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card.jsx'
import Skeleton from '../../components/ui/Skeleton.jsx'
import { useApplications } from '../../hooks/useApplications.js'
import { APPLICATION_STATUS } from '../../utils/constants.js'

function MetricCard({ label, value }) {
	return (
		<Card className="p-5 sm:p-6">
			<p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">{label}</p>
			<p className="mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">{value}</p>
		</Card>
	)
}

function DashboardSkeleton() {
	return (
		<div className="space-y-6">
			<Card className="p-5 sm:p-6">
				<Skeleton className="h-4 w-32" />
				<Skeleton className="mt-4 h-8 w-72 max-w-full" />
				<Skeleton className="mt-3 h-4 w-full max-w-2xl" />
			</Card>
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{Array.from({ length: 4 }).map((_, index) => (
					<Card key={index} className="p-5 sm:p-6">
						<Skeleton className="h-4 w-20" />
						<Skeleton className="mt-4 h-10 w-16" />
					</Card>
				))}
			</div>
			<div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
				<Card className="p-5 sm:p-6"><Skeleton className="h-72 w-full" /></Card>
				<Card className="p-5 sm:p-6"><Skeleton className="h-72 w-full" /></Card>
			</div>
		</div>
	)
}

function buildRecentTrend(applications, days = 7) {
	const today = new Date()
	const entries = Array.from({ length: days }, (_, index) => {
		const date = new Date(today)
		date.setDate(today.getDate() - (days - index - 1))
		const key = date.toISOString().slice(0, 10)
		return { key, label: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }), total: 0, approved: 0 }
	})

	applications.forEach((application) => {
		const key = new Date(application.created_at).toISOString().slice(0, 10)
		const bucket = entries.find((entry) => entry.key === key)

		if (!bucket) {
			return
		}

		bucket.total += 1
		if (application.status === APPLICATION_STATUS.APPROVED) {
			bucket.approved += 1
		}
	})

	return entries
}

function SubmissionTrendChart({ applications }) {
	const trend = buildRecentTrend(applications)
	const maxValue = Math.max(...trend.map((entry) => entry.total), 1)
	const points = trend
		.map((entry, index) => {
			const x = (index / Math.max(trend.length - 1, 1)) * 100
			const y = 100 - (entry.total / maxValue) * 100
			return `${x},${y}`
		})
		.join(' ')

	return (
		<div className="space-y-5">
			<div>
				<h3 className="text-xl font-semibold text-slate-900">Submission trend</h3>
				<p className="mt-2 text-sm text-slate-600">Applications created over the last seven days.</p>
			</div>
			<div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
				<svg viewBox="0 0 100 100" className="h-56 w-full overflow-visible">
					{[0, 25, 50, 75, 100].map((line) => (
						<line key={line} x1="0" y1={line} x2="100" y2={line} stroke="rgba(148,163,184,0.35)" strokeWidth="0.8" />
					))}
					<polyline fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={points} />
					{trend.map((entry, index) => {
						const x = (index / Math.max(trend.length - 1, 1)) * 100
						const y = 100 - (entry.total / maxValue) * 100
						return <circle key={entry.key} cx={x} cy={y} r="2.8" fill="#1d4ed8" />
					})}
				</svg>
				<div className="mt-3 grid grid-cols-7 gap-2 text-center text-[11px] font-medium text-slate-500 sm:text-xs">
					{trend.map((entry) => (
						<div key={entry.key} className="min-w-0">
							<p className="truncate">{entry.label}</p>
							<p className="mt-1 text-slate-900">{entry.total}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

function StatusDistribution({ applications, total, approved, pending, rejected }) {
	const stats = [
		{ label: 'Approved', value: approved, color: 'bg-emerald-500' },
		{ label: 'Pending', value: pending, color: 'bg-amber-500' },
		{ label: 'Rejected', value: rejected, color: 'bg-rose-500' },
	]

	const weeklyTrend = buildRecentTrend(applications, 14)
	const firstHalf = weeklyTrend.slice(0, 7).reduce((sum, item) => sum + item.total, 0)
	const secondHalf = weeklyTrend.slice(7).reduce((sum, item) => sum + item.total, 0)
	const trendDelta = secondHalf - firstHalf

	return (
		<div className="space-y-5">
			<div>
				<h3 className="text-xl font-semibold text-slate-900">Approval mix</h3>
				<p className="mt-2 text-sm text-slate-600">Portfolio composition and short-term submission momentum.</p>
			</div>
			<div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
				<div className="flex h-4 overflow-hidden rounded-full bg-slate-200">
					{stats.map((stat) => (
						<div
							key={stat.label}
							className={stat.color}
							style={{ width: `${total === 0 ? 0 : (stat.value / total) * 100}%` }}
						/>
					))}
				</div>
				<div className="mt-5 grid gap-3 sm:grid-cols-3">
					{stats.map((stat) => (
						<div key={stat.label} className="rounded-2xl bg-white p-4 shadow-sm shadow-slate-200/80">
							<div className="flex items-center gap-2">
								<span className={["h-3 w-3 rounded-full", stat.color].join(' ')} />
								<p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{stat.label}</p>
							</div>
							<p className="mt-3 text-2xl font-semibold text-slate-900">{stat.value}</p>
						</div>
					))}
				</div>
				<div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
					<p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Two-week trend</p>
					<p className="mt-2 text-2xl font-semibold text-slate-900">{trendDelta >= 0 ? '+' : ''}{trendDelta}</p>
					<p className="mt-2 text-sm text-slate-600">
						{trendDelta >= 0 ? 'More' : 'Fewer'} submissions in the last 7 days compared with the previous 7.
					</p>
				</div>
			</div>
		</div>
	)
}

function AdminDashboard() {
	const { applications, loading, error } = useApplications()

	const total = applications.length
	const pending = applications.filter((application) => application.status === APPLICATION_STATUS.PENDING).length
	const approved = applications.filter((application) => application.status === APPLICATION_STATUS.APPROVED).length
	const rejected = applications.filter((application) => application.status === APPLICATION_STATUS.REJECTED).length
	const recentApplications = applications.slice(0, 5)

	if (loading) {
		return <DashboardSkeleton />
	}

	return (
		<div className="space-y-6">
			<Card className="p-5 sm:p-6">
				<p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-700">Admin dashboard</p>
				<h2 className="mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">Portfolio-level onboarding visibility</h2>
				<p className="mt-3 text-sm text-slate-600">
					Review inbound applications, track approval throughput, and move applicants through the onboarding pipeline.
				</p>
			</Card>

			{error ? <Card className="text-rose-700">{error}</Card> : null}

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<MetricCard label="Total" value={total} />
				<MetricCard label="Pending" value={pending} />
				<MetricCard label="Approved" value={approved} />
				<MetricCard label="Rejected" value={rejected} />
			</div>

			<div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
				<Card className="p-5 sm:p-6">
					<SubmissionTrendChart applications={applications} />
				</Card>
				<Card className="p-5 sm:p-6">
					<StatusDistribution applications={applications} total={total} approved={approved} pending={pending} rejected={rejected} />
				</Card>
			</div>

			<Card className="p-5 sm:p-6">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h3 className="text-xl font-semibold text-slate-900">Recent applications</h3>
						<p className="mt-2 text-sm text-slate-600">The latest submissions entering the review queue.</p>
					</div>
					<Link
						to="/admin/applications"
						className="inline-flex rounded-2xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
					>
						Manage all applications
					</Link>
				</div>
				<div className="mt-5 space-y-4 md:hidden">
					{recentApplications.map((application) => (
						<div key={application.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
							<p className="truncate text-sm font-semibold text-slate-900">{application.formData.tradingAs || 'Unnamed business'}</p>
							<p className="mt-1 truncate text-sm text-slate-600">{application.applicant_email}</p>
							<p className="mt-2 text-sm text-slate-600">
								{[application.zoneName, application.regionName].filter(Boolean).join(' / ') || 'Location not provided'}
							</p>
							<div className="mt-3 flex items-center justify-between gap-3 text-sm text-slate-600">
								<span>{application.status}</span>
								<span>{new Date(application.created_at).toLocaleDateString()}</span>
							</div>
							<Link to={`/admin/applications/${application.id}`} className="mt-4 inline-flex text-sm font-semibold text-blue-700">
								Open review
							</Link>
						</div>
					))}
				</div>
				{!recentApplications.length ? <p className="mt-5 text-sm text-slate-500">No applications have been submitted yet.</p> : null}
				<div className="mt-5 hidden overflow-x-auto md:block">
					<table className="min-w-full text-left text-sm">
						<thead>
							<tr className="border-b border-slate-200 text-slate-500">
								<th className="pb-3 pr-4 font-medium">Applicant</th>
								<th className="pb-3 pr-4 font-medium">Business</th>
								<th className="pb-3 pr-4 font-medium">Zone</th>
								<th className="pb-3 pr-4 font-medium">Region</th>
								<th className="pb-3 pr-4 font-medium">Status</th>
								<th className="pb-3 font-medium">Submitted</th>
							</tr>
						</thead>
						<tbody>
							{recentApplications.map((application) => (
								<tr key={application.id} className="border-b border-slate-100">
									<td className="py-4 pr-4 text-slate-700">{application.applicant_email}</td>
									<td className="py-4 pr-4 font-medium text-slate-900">{application.formData.tradingAs}</td>
									<td className="py-4 pr-4 text-slate-700">{application.zoneName || 'Not provided'}</td>
									<td className="py-4 pr-4 text-slate-700">{application.regionName || 'Not provided'}</td>
									<td className="py-4 pr-4">{application.status}</td>
									<td className="py-4">{new Date(application.created_at).toLocaleDateString()}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Card>
		</div>
	)
}

export default AdminDashboard
