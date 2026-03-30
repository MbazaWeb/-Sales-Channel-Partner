import { useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button.jsx'
import Card from '../../components/ui/Card.jsx'
import { useApplications } from '../../hooks/useApplications.js'
import { getApplicationFilesWithUrls } from '../../services/fileService.js'
import { downloadApplicationPdf } from '../../utils/pdfGenerator.js'

function Applications() {
	const navigate = useNavigate()
	const { applications, loading, error } = useApplications()

	async function handleDownload(application) {
		const documents = await getApplicationFilesWithUrls(application.id)
		await downloadApplicationPdf(application, documents)
	}

	return (
		<div className="space-y-6">
			<Card className="p-5 sm:p-6">
				<p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-700">Applications</p>
				<h2 className="mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">Review and adjudicate submissions</h2>
				<p className="mt-3 text-sm text-slate-600">
					Open any submission to complete the internal review page, then approve or decline it from the dedicated review screen.
				</p>
			</Card>

			{loading ? <Card>Loading applications...</Card> : null}
			{error ? <Card className="text-rose-700">{error}</Card> : null}

			{!loading && !error ? (
				<>
					<div className="space-y-4 md:hidden">
						{applications.map((application) => (
							<Card key={application.id} className="space-y-4 p-5">
								<div className="flex items-start justify-between gap-3">
									<div className="min-w-0">
										<p className="truncate text-base font-semibold text-slate-900">{application.formData.tradingAs || 'Unnamed business'}</p>
										<p className="mt-1 truncate text-sm text-slate-600">{application.applicant_email}</p>
									</div>
									<span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-slate-700">
										{application.status}
									</span>
								</div>
								<div className="grid gap-3 text-sm text-slate-700">
									<p><span className="font-semibold text-slate-900">Location:</span> {application.locationSummary || 'Not provided'}</p>
									<p><span className="font-semibold text-slate-900">TIN:</span> {application.tinNumber || 'Not provided'}</p>
								</div>
								<div className="flex flex-col gap-3 sm:flex-row">
									<Button className="w-full sm:w-auto" onClick={() => navigate(`/admin/applications/${application.id}`)}>
										Open review
									</Button>
									<Button className="w-full sm:w-auto" variant="secondary" onClick={() => handleDownload(application)}>
										Download
									</Button>
								</div>
							</Card>
						))}
					</div>

					<Card className="hidden overflow-hidden p-0 md:block">
						<div className="overflow-x-auto">
							<table className="min-w-full text-left text-sm">
								<thead className="bg-slate-50 text-slate-500">
									<tr>
										<th className="px-6 py-4 font-medium">Applicant</th>
										<th className="px-6 py-4 font-medium">Business</th>
										<th className="px-6 py-4 font-medium">Location</th>
										<th className="px-6 py-4 font-medium">TIN</th>
										<th className="px-6 py-4 font-medium">Status</th>
										<th className="px-6 py-4 font-medium">Actions</th>
									</tr>
								</thead>
								<tbody>
									{applications.map((application) => (
										<tr key={application.id} className="border-t border-slate-100 align-top">
											<td className="px-6 py-5 text-slate-700">{application.applicant_email}</td>
											<td className="px-6 py-5 font-medium text-slate-900">{application.formData.tradingAs}</td>
											<td className="px-6 py-5 text-slate-700">{application.locationSummary || 'Not provided'}</td>
											<td className="px-6 py-5 text-slate-700">{application.tinNumber}</td>
											<td className="px-6 py-5 text-slate-700">{application.status}</td>
											<td className="px-6 py-5">
												<div className="flex flex-wrap gap-2">
													<Button variant="secondary" onClick={() => navigate(`/admin/applications/${application.id}`)}>
														Open review
													</Button>
													<Button variant="secondary" onClick={() => handleDownload(application)}>
														Download
													</Button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</Card>
				</>
			) : null}
		</div>
	)
}

export default Applications
