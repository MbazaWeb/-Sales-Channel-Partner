import { useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import Button from '../../components/ui/Button.jsx'
import Card from '../../components/ui/Card.jsx'
import { useApplications } from '../../hooks/useApplications.js'
import { APPLICATION_STATUS } from '../../utils/constants.js'
import { downloadApplicationPdf } from '../../utils/pdfGenerator.js'
import { deleteApplicationFiles, getApplicationFilesWithUrls } from '../../services/fileService.js'

function formatTimestamp(value) {
	if (!value) {
		return 'Not available'
	}

	return new Intl.DateTimeFormat('en-GB', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	}).format(new Date(value))
}

function StatusBadge({ status }) {
	const statusClassName = {
		[APPLICATION_STATUS.APPROVED]: 'bg-emerald-100 text-emerald-800',
		[APPLICATION_STATUS.REJECTED]: 'bg-rose-100 text-rose-800',
		[APPLICATION_STATUS.PENDING]: 'bg-amber-100 text-amber-800',
	}[status] ?? 'bg-slate-100 text-slate-700'

	return <span className={`rounded-full px-3 py-1 text-xs font-semibold tracking-[0.2em] ${statusClassName}`}>{status}</span>
}

function ReviewIcon(props) {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
			<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
			<circle cx="12" cy="12" r="3" />
		</svg>
	)
}

function DownloadIcon(props) {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
			<path d="M12 3v12" />
			<path d="m7 10 5 5 5-5" />
			<path d="M5 21h14" />
		</svg>
	)
}

function DeleteIcon(props) {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
			<path d="M3 6h18" />
			<path d="M8 6V4h8v2" />
			<path d="M19 6l-1 14H6L5 6" />
			<path d="M10 11v6" />
			<path d="M14 11v6" />
		</svg>
	)
}

function ActionIconButton({ label, title, variant = 'secondary', onClick, icon: Icon }) {
	return (
		<Button
			variant={variant}
			onClick={onClick}
			title={title}
			aria-label={label}
			className="h-11 w-11 rounded-2xl p-0"
		>
			<Icon className="h-4 w-4" />
			<span className="sr-only">{label}</span>
		</Button>
	)
}

function Applications() {
	const navigate = useNavigate()
	const { applications, loading, error, removeApplication } = useApplications()
	const [searchTerm, setSearchTerm] = useState('')
	const [selectedRegion, setSelectedRegion] = useState('')
	const [selectedDate, setSelectedDate] = useState('')
	const [actionError, setActionError] = useState('')

	const regions = useMemo(
		() => Array.from(new Set(applications.map((application) => application.regionName).filter(Boolean))).sort(),
		[applications],
	)

	const filteredApplications = useMemo(() => {
		const normalizedSearch = searchTerm.trim().toLowerCase()

		return applications.filter((application) => {
			const matchesSearch =
				normalizedSearch === '' ||
				[
					application.applicant_email,
					application.formData.tradingAs,
					application.zoneName,
					application.regionName,
					application.status,
				].some((value) => String(value ?? '').toLowerCase().includes(normalizedSearch))

			const matchesRegion = selectedRegion === '' || application.regionName === selectedRegion
			const matchesDate = selectedDate === '' || new Date(application.created_at).toISOString().slice(0, 10) === selectedDate

			return matchesSearch && matchesRegion && matchesDate
		})
	}, [applications, searchTerm, selectedRegion, selectedDate])

	async function handleDownload(application) {
		const documents = await getApplicationFilesWithUrls(application.id)
		await downloadApplicationPdf(application, documents)
	}

	async function handleDelete(application) {
		const confirmed = window.confirm(`Delete application for ${application.formData.tradingAs || application.applicant_email}?`)

		if (!confirmed) {
			return
		}

		setActionError('')

		try {
			await deleteApplicationFiles(application.id)
			await removeApplication(application.id)
		} catch (error) {
			setActionError(error.message)
		}
	}

	return (
		<div className="space-y-6">
			<Card className="p-5 sm:p-6">
				<p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-700">Applications</p>
				<h2 className="mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">Review and adjudicate submissions</h2>
				<p className="mt-3 text-sm text-slate-600">
					Search submissions, filter by submitted date or region, and open any record to complete the internal review page.
				</p>
				<div className="mt-5 grid gap-3 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
					<input
						type="search"
						value={searchTerm}
						onChange={(event) => setSearchTerm(event.target.value)}
						placeholder="Search application, business, applicant..."
						className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-700"
					/>
					<select
						value={selectedRegion}
						onChange={(event) => setSelectedRegion(event.target.value)}
						className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-700"
					>
						<option value="">All regions</option>
						{regions.map((region) => (
							<option key={region} value={region}>{region}</option>
						))}
					</select>
					<input
						type="date"
						value={selectedDate}
						onChange={(event) => setSelectedDate(event.target.value)}
						className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-700"
					/>
				</div>
			</Card>

			{loading ? <Card>Loading applications...</Card> : null}
			{error ? <Card className="text-rose-700">{error}</Card> : null}
			{actionError ? <Card className="text-rose-700">{actionError}</Card> : null}

			{!loading && !error ? (
				<>
					<div className="space-y-4 md:hidden">
						{filteredApplications.map((application) => (
							<Card key={application.id} className="space-y-4 p-5">
								<div className="flex items-start justify-between gap-3">
									<div className="min-w-0">
										<p className="truncate text-base font-semibold text-slate-900">{application.formData.tradingAs || 'Unnamed business'}</p>
										<p className="mt-1 truncate text-sm text-slate-600">{application.applicant_email}</p>
									</div>
									<StatusBadge status={application.status} />
								</div>
								<div className="grid gap-3 text-sm text-slate-700">
									<p><span className="font-semibold text-slate-900">Zone:</span> {application.zoneName || 'Not provided'}</p>
									<p><span className="font-semibold text-slate-900">Region:</span> {application.regionName || 'Not provided'}</p>
									<p><span className="font-semibold text-slate-900">Submitted:</span> {formatTimestamp(application.created_at)}</p>
									<p><span className="font-semibold text-slate-900">Approved:</span> {application.status === APPLICATION_STATUS.APPROVED ? formatTimestamp(application.updated_at) : 'Not approved yet'}</p>
								</div>
								<div className="flex flex-wrap gap-3">
									<ActionIconButton
										label="Open review"
										title="Open review"
										onClick={() => navigate(`/admin/applications/${application.id}`)}
										icon={ReviewIcon}
									/>
									<ActionIconButton
										label="Download application PDF"
										title="Download"
										onClick={() => handleDownload(application)}
										icon={DownloadIcon}
									/>
									<ActionIconButton
										label="Delete application"
										title="Delete"
										variant="danger"
										onClick={() => handleDelete(application)}
										icon={DeleteIcon}
									/>
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
										<th className="px-6 py-4 font-medium">Zone</th>
										<th className="px-6 py-4 font-medium">Region</th>
										<th className="px-6 py-4 font-medium">Status</th>
										<th className="px-6 py-4 font-medium">Submitted</th>
										<th className="px-6 py-4 font-medium">Approved</th>
										<th className="px-6 py-4 font-medium">Actions</th>
									</tr>
								</thead>
								<tbody>
									{filteredApplications.map((application) => (
										<tr key={application.id} className="border-t border-slate-100 align-top">
											<td className="px-6 py-5 text-slate-700">{application.applicant_email}</td>
											<td className="px-6 py-5 font-medium text-slate-900">{application.formData.tradingAs}</td>
											<td className="px-6 py-5 text-slate-700">{application.zoneName || 'Not provided'}</td>
											<td className="px-6 py-5 text-slate-700">{application.regionName || 'Not provided'}</td>
											<td className="px-6 py-5 text-slate-700"><StatusBadge status={application.status} /></td>
											<td className="px-6 py-5 text-slate-700">{formatTimestamp(application.created_at)}</td>
											<td className="px-6 py-5 text-slate-700">{application.status === APPLICATION_STATUS.APPROVED ? formatTimestamp(application.updated_at) : 'Not approved yet'}</td>
											<td className="px-6 py-5">
												<div className="flex flex-wrap gap-2">
													<ActionIconButton
														label="Open review"
														title="Open review"
														onClick={() => navigate(`/admin/applications/${application.id}`)}
														icon={ReviewIcon}
													/>
													<ActionIconButton
														label="Download application PDF"
														title="Download"
														onClick={() => handleDownload(application)}
														icon={DownloadIcon}
													/>
													<ActionIconButton
														label="Delete application"
														title="Delete"
														variant="danger"
														onClick={() => handleDelete(application)}
														icon={DeleteIcon}
													/>
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
