import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button.jsx'
import Card from '../../components/ui/Card.jsx'
import { useApplications } from '../../hooks/useApplications.js'
import { getApplicationFilesWithUrls } from '../../services/fileService.js'
import { APPLICATION_STATUS, PREVIEW_FIELDS } from '../../utils/constants.js'
import { downloadApplicationPdf } from '../../utils/pdfGenerator.js'
import { getFieldDisplayLabel, getFieldDisplayValue } from '../../utils/pdfGenerator.js'

function Dashboard() {
	const { applications, loading, error } = useApplications()
	const latestApplication = applications[0]

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
					Track your latest submission, verify what was captured, and download the generated application PDF at any time.
				</p>
			</Card>

			{loading ? <Card>Loading applications...</Card> : null}
			{error ? <Card className="text-rose-700">{error}</Card> : null}
			{!loading && !error && !latestApplication ? (
				<Card>
					<h3 className="text-xl font-semibold text-slate-900">No applications submitted yet</h3>
					<p className="mt-2 text-sm text-slate-600">Complete the SCP form to start the onboarding review process.</p>
					<Link
						to="/apply"
						className="mt-5 inline-flex rounded-2xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
					>
						Start application
					</Link>
				</Card>
			) : null}

			{latestApplication ? (
				<div className="grid gap-6 xl:grid-cols-[0.72fr_1fr]">
					<Card className="p-5 sm:p-6">
						<p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Latest submission</p>
						<h3 className="mt-3 text-xl font-semibold text-slate-900 sm:text-2xl">{latestApplication.formData.tradingAs || 'Unnamed business'}</h3>
						<div className="mt-5 grid gap-4 sm:grid-cols-2">
							<div className="rounded-2xl bg-slate-100 p-4">
								<p className="text-xs uppercase tracking-[0.25em] text-slate-500">Status</p>
								<p className="mt-2 text-xl font-semibold text-slate-900">{latestApplication.status}</p>
							</div>
							<div className="rounded-2xl bg-slate-100 p-4">
								<p className="text-xs uppercase tracking-[0.25em] text-slate-500">Submitted</p>
								<p className="mt-2 text-xl font-semibold text-slate-900">
									{new Date(latestApplication.created_at).toLocaleDateString()}
								</p>
							</div>
						</div>
						<div className="mt-6 flex flex-wrap gap-3">
							<Link
								to="/apply"
								className="inline-flex rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
							>
								Submit another application
							</Link>
							<Button onClick={() => handleDownload(latestApplication)}>
								{latestApplication.status === APPLICATION_STATUS.APPROVED ? 'Download approved PDF' : 'Download application PDF'}
							</Button>
						</div>
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
			) : null}
		</div>
	)
}

export default Dashboard
