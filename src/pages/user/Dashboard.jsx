import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button.jsx'
import Card from '../../components/ui/Card.jsx'
import { useApplications } from '../../hooks/useApplications.js'
import { getApplicationFilesWithUrls } from '../../services/fileService.js'
import { APPLICATION_STATUS, PREVIEW_FIELDS } from '../../utils/constants.js'
import { downloadApplicationPdf } from '../../utils/pdfGenerator.js'
import { getFieldDisplayLabel, getFieldDisplayValue } from '../../utils/pdfGenerator.js'

function StatusBadge({ status }) {
	const statusClassName = {
		[APPLICATION_STATUS.INCOMPLETE]: 'bg-sky-100 text-sky-800',
		[APPLICATION_STATUS.APPROVED]: 'bg-emerald-100 text-emerald-800',
		[APPLICATION_STATUS.REJECTED]: 'bg-rose-100 text-rose-800',
		[APPLICATION_STATUS.PENDING]: 'bg-amber-100 text-amber-800',
	}[status] ?? 'bg-slate-100 text-slate-700'

	return (
		<span className={`rounded-full px-3 py-1 text-xs font-semibold tracking-[0.2em] ${statusClassName}`}>
			{status}
		</span>
	)
}

function Dashboard() {
	const { applications, loading, error } = useApplications()
	const latestApplication = applications[0]
	const latestIncompleteApplication = applications.find((application) => application.status === APPLICATION_STATUS.INCOMPLETE)
	const total = applications.length
	const incomplete = applications.filter((application) => application.status === APPLICATION_STATUS.INCOMPLETE).length
	const pending = applications.filter((application) => application.status === APPLICATION_STATUS.PENDING).length
	const approved = applications.filter((application) => application.status === APPLICATION_STATUS.APPROVED).length
	const rejected = applications.filter((application) => application.status === APPLICATION_STATUS.REJECTED).length

	async function handleDownload(application) {
		const documents = await getApplicationFilesWithUrls(application.id)
		await downloadApplicationPdf(application, documents)
	}

	return (
		<div className="space-y-6">
			<Card className="p-5 sm:p-6">
				<p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-700">User dashboard</p>
				<h2 className="mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">Application status overview</h2>
				<p className="mt-3 text-sm text-slate-600">
					Track every application you submitted, verify what was captured, and download the full approved document once admin review is complete.
				</p>
			</Card>

			{loading ? <Card>Loading applications...</Card> : null}
			{error ? <Card className="text-rose-700">{error}</Card> : null}
			{!loading && !error && !latestApplication ? (
				<Card>
					<h3 className="text-xl font-semibold text-slate-900">No applications submitted yet</h3>
					<p className="mt-2 text-sm text-slate-600">Complete the SCP form to start the onboarding review process.</p>
					<Link
						to={latestIncompleteApplication ? `/apply/${latestIncompleteApplication.id}` : '/apply'}
						className="mt-5 inline-flex rounded-2xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
					>
						{latestIncompleteApplication ? 'Complete application' : 'Start application'}
					</Link>
				</Card>
			) : null}

			{latestApplication ? (
				<div className="space-y-6">
					<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
						<Card className="p-5"><p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Total</p><p className="mt-3 text-3xl font-semibold text-slate-900">{total}</p></Card>
						<Card className="p-5"><p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Incomplete</p><p className="mt-3 text-3xl font-semibold text-slate-900">{incomplete}</p></Card>
						<Card className="p-5"><p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Pending</p><p className="mt-3 text-3xl font-semibold text-slate-900">{pending}</p></Card>
						<Card className="p-5"><p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Approved</p><p className="mt-3 text-3xl font-semibold text-slate-900">{approved}</p></Card>
						<Card className="p-5"><p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Rejected</p><p className="mt-3 text-3xl font-semibold text-slate-900">{rejected}</p></Card>
					</div>
					<div className="grid gap-6 xl:grid-cols-[0.72fr_1fr]">
					<Card className="p-5 sm:p-6">
						<p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Latest submission</p>
						<h3 className="mt-3 text-xl font-semibold text-slate-900 sm:text-2xl">{latestApplication.formData.tradingAs || 'Unnamed business'}</h3>
						<div className="mt-5 grid gap-4 sm:grid-cols-2">
							<div className="rounded-2xl bg-slate-100 p-4">
								<p className="text-xs uppercase tracking-[0.25em] text-slate-500">Status</p>
								<div className="mt-2"><StatusBadge status={latestApplication.status} /></div>
							</div>
							<div className="rounded-2xl bg-slate-100 p-4">
								<p className="text-xs uppercase tracking-[0.25em] text-slate-500">Submitted</p>
								<p className="mt-2 text-xl font-semibold text-slate-900">
									{new Date(latestApplication.created_at).toLocaleDateString()}
								</p>
							</div>
						</div>
						<div className="mt-6 flex flex-wrap gap-3">
							{latestApplication.status === APPLICATION_STATUS.INCOMPLETE ? (
								<Link
									to={`/apply/${latestApplication.id}`}
									className="inline-flex rounded-2xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
								>
									Complete application
								</Link>
							) : (
								<Link
									to={latestIncompleteApplication ? `/apply/${latestIncompleteApplication.id}` : '/apply'}
									className="inline-flex rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
								>
									{latestIncompleteApplication ? 'Complete saved draft' : 'Submit another application'}
								</Link>
							)}
							{latestApplication.status === APPLICATION_STATUS.APPROVED ? (
								<Button onClick={() => handleDownload(latestApplication)}>Download approved PDF</Button>
							) : null}
						</div>
						{latestApplication.status === APPLICATION_STATUS.INCOMPLETE ? (
							<div className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
								This application is saved as incomplete. Use Complete application to continue from the saved draft.
							</div>
						) : null}
						{latestApplication.status !== APPLICATION_STATUS.APPROVED ? (
							<div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
								{latestApplication.status === APPLICATION_STATUS.INCOMPLETE
									? 'Finish and submit the draft before it enters admin review.'
									: 'The full clean document becomes available after admin approval.'}
							</div>
						) : null}
					</Card>

					<Card className="p-5 sm:p-6">
						<h3 className="text-xl font-semibold text-slate-900">Submitted data preview</h3>
						<div className="mt-5 grid gap-4 md:grid-cols-2">
							{PREVIEW_FIELDS.map((fieldId) => (
								<div key={fieldId} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
									<p className="text-xs uppercase tracking-[0.25em] text-slate-500">{getFieldDisplayLabel(fieldId)}</p>
									<p className="mt-2 text-sm font-medium text-slate-900">
										{getFieldDisplayValue(latestApplication.formData, fieldId)}
									</p>
								</div>
							))}
						</div>
					</Card>
					</div>

					<Card className="p-5 sm:p-6">
						<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
							<div>
								<h3 className="text-xl font-semibold text-slate-900">All applications</h3>
								<p className="mt-2 text-sm text-slate-600">Every form you have submitted is listed here with its latest review status.</p>
							</div>
							<p className="text-sm font-medium text-slate-500">{applications.length} total</p>
						</div>

						<div className="mt-5 space-y-4 md:hidden">
							{applications.map((application) => (
								<div key={application.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
									<div className="flex items-start justify-between gap-3">
										<div className="min-w-0">
											<p className="truncate text-base font-semibold text-slate-900">{application.formData.tradingAs || 'Unnamed business'}</p>
											<p className="mt-1 text-sm text-slate-600">{application.locationSummary || 'Location not provided'}</p>
										</div>
										<StatusBadge status={application.status} />
									</div>
									<div className="mt-4 grid gap-2 text-sm text-slate-600">
										<p><span className="font-semibold text-slate-900">Submitted:</span> {new Date(application.created_at).toLocaleDateString()}</p>
										<p><span className="font-semibold text-slate-900">TIN:</span> {application.tinNumber || 'Not provided'}</p>
									</div>
									{application.status === APPLICATION_STATUS.INCOMPLETE ? (
										<Link to={`/apply/${application.id}`} className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 sm:w-auto">
											Complete application
										</Link>
									) : null}
									{application.status === APPLICATION_STATUS.APPROVED ? (
										<Button className="mt-4 w-full sm:w-auto" onClick={() => handleDownload(application)}>
											Download approved PDF
										</Button>
									) : null}
								</div>
							))}
						</div>

						<div className="mt-5 hidden overflow-x-auto md:block">
							<table className="min-w-full text-left text-sm">
								<thead>
									<tr className="border-b border-slate-200 text-slate-500">
										<th className="pb-3 pr-4 font-medium">Business</th>
										<th className="pb-3 pr-4 font-medium">Zone / Region</th>
										<th className="pb-3 pr-4 font-medium">Submitted</th>
										<th className="pb-3 pr-4 font-medium">Status</th>
										<th className="pb-3 font-medium">Document</th>
									</tr>
								</thead>
								<tbody>
									{applications.map((application) => (
										<tr key={application.id} className="border-b border-slate-100 align-top">
											<td className="py-4 pr-4 font-medium text-slate-900">{application.formData.tradingAs || 'Unnamed business'}</td>
											<td className="py-4 pr-4 text-slate-700">{[application.zoneName, application.regionName].filter(Boolean).join(' / ') || 'Not provided'}</td>
											<td className="py-4 pr-4 text-slate-700">{new Date(application.created_at).toLocaleDateString()}</td>
											<td className="py-4 pr-4"><StatusBadge status={application.status} /></td>
											<td className="py-4">
												{application.status === APPLICATION_STATUS.INCOMPLETE ? (
													<Link to={`/apply/${application.id}`} className="inline-flex rounded-2xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800">
														Complete application
													</Link>
												) : application.status === APPLICATION_STATUS.APPROVED ? (
													<Button onClick={() => handleDownload(application)}>Download approved PDF</Button>
												) : (
													<span className="text-sm text-slate-500">Available after approval</span>
												)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</Card>
				</div>
			) : null}
		</div>
	)
}

export default Dashboard
