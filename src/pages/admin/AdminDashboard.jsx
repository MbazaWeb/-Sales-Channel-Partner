import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card.jsx'
import { useApplications } from '../../hooks/useApplications.js'
import { APPLICATION_STATUS } from '../../utils/constants.js'

function MetricCard({ label, value }) {
	return (
		<Card className="p-5">
			<p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">{label}</p>
			<p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
		</Card>
	)
}

function AdminDashboard() {
	const { applications, loading, error } = useApplications()

	const total = applications.length
	const pending = applications.filter((application) => application.status === APPLICATION_STATUS.PENDING).length
	const approved = applications.filter((application) => application.status === APPLICATION_STATUS.APPROVED).length
	const rejected = applications.filter((application) => application.status === APPLICATION_STATUS.REJECTED).length
	const recentApplications = applications.slice(0, 5)

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
			{loading ? <Card>Loading applications...</Card> : null}

			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				<MetricCard label="Total" value={total} />
				<MetricCard label="Pending" value={pending} />
				<MetricCard label="Approved" value={approved} />
				<MetricCard label="Rejected" value={rejected} />
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
