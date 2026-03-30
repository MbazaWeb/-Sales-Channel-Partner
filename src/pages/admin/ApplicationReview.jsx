import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/ui/Button.jsx'
import Card from '../../components/ui/Card.jsx'
import { useApplications } from '../../hooks/useApplications.js'
import { getApplicationFilesWithUrls } from '../../services/fileService.js'
import {
	ADMIN_REVIEW_FIELDS,
	APPLICATION_STATUS,
	CHECKBOX_GROUPS,
	PREVIEW_FIELDS,
} from '../../utils/constants.js'
import { downloadApplicationPdf, getFieldDisplayLabel, getFieldDisplayValue } from '../../utils/pdfGenerator.js'
import { validateAdminReviewForm } from '../../utils/validators.js'

const CREDIT_LIMIT_OPTIONS = ADMIN_REVIEW_FIELDS.filter((field) => field.group === 'creditLimit')
const CONFLICT_ASSESSMENT_OPTIONS = ADMIN_REVIEW_FIELDS.filter((field) => field.group === 'adminConflictAssessment')

function AdminField({ label, error, children, fullWidth = false }) {
	return (
		<label className={fullWidth ? 'space-y-2 md:col-span-2' : 'space-y-2'}>
			<span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{label}</span>
			{children}
			{error ? <span className="block text-sm text-rose-700">{error}</span> : null}
		</label>
	)
}

function AdminChoiceGroup({ label, options, selectedValue, error, onSelect }) {
	return (
		<div className="space-y-3">
			<div className="flex flex-wrap items-center gap-3">
				<p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{label}</p>
				{error ? <span className="text-sm text-rose-700">{error}</span> : null}
			</div>
			<div className="flex flex-wrap gap-3">
				{options.map((option) => {
					const isSelected = selectedValue === option.id

					return (
						<button
							key={option.id}
							type="button"
							onClick={() => onSelect(option)}
							className={[
								'inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition',
								isSelected
									? 'border-blue-700 bg-blue-700 text-white'
									: 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50',
							].join(' ')}
						>
							<span
								className={[
									'inline-flex h-4 w-4 items-center justify-center rounded-full border text-[10px]',
									isSelected ? 'border-white bg-white text-blue-700' : 'border-slate-400 text-transparent',
								].join(' ')}
							>
								•
							</span>
							{option.label}
						</button>
					)
				})}
			</div>
		</div>
	)
}

function ApplicationReview() {
	const navigate = useNavigate()
	const { applicationId } = useParams()
	const { applications, loading, error, changeStatus, saveFormData } = useApplications()
	const application = applications.find((entry) => entry.id === applicationId)
	const [reviewFormData, setReviewFormData] = useState({})
	const [reviewErrors, setReviewErrors] = useState({})
	const [reviewAction, setReviewAction] = useState('')
	const [reviewError, setReviewError] = useState('')
	const [reviewMessage, setReviewMessage] = useState('')

	useEffect(() => {
		if (!application) {
			return
		}

		setReviewFormData({
			...(application.formData ?? {}),
			processedOn: application.formData?.processedOn || new Date().toISOString().slice(0, 10),
		})
		setReviewErrors({})
		setReviewError('')
		setReviewMessage('')
	}, [application?.id])

	function handleFieldChange(field, value) {
		setReviewMessage('')
		setReviewError('')
		setReviewErrors((currentErrors) => {
			const nextErrors = { ...currentErrors }
			delete nextErrors[field.id]
			if (field.group === 'creditLimit') {
				delete nextErrors.creditLimit100
			}
			if (field.group === 'adminConflictAssessment') {
				delete nextErrors.assessmentNoConflict
				delete nextErrors.conflictAssessmentNotes
			}
			return nextErrors
		})

		setReviewFormData((currentData) => {
			if (field.group) {
				const nextData = { ...currentData }
				CHECKBOX_GROUPS[field.group].forEach((fieldId) => {
					nextData[fieldId] = false
				})
				nextData[field.id] = value
				return nextData
			}

			return {
				...currentData,
				[field.id]: value,
			}
		})
	}

	async function handleDownload() {
		if (!application) {
			return
		}

		const documents = await getApplicationFilesWithUrls(application.id)
		await downloadApplicationPdf(application, documents)
	}

	async function handleSaveReview() {
		if (!application) {
			return
		}

		setReviewAction('save')
		setReviewError('')
		setReviewMessage('')

		try {
			await saveFormData(application.id, reviewFormData)
			setReviewErrors({})
			setReviewMessage('Internal review details saved.')
		} catch (saveError) {
			setReviewError(saveError.message)
		} finally {
			setReviewAction('')
		}
	}

	async function handleReviewDecision(status) {
		if (!application) {
			return
		}

		const errors = validateAdminReviewForm(reviewFormData)
		setReviewErrors(errors)

		if (Object.keys(errors).length > 0) {
			setReviewError('Complete the internal review fields before approving or declining this application.')
			return
		}

		setReviewAction(status)
		setReviewError('')
		setReviewMessage('')

		try {
			await saveFormData(application.id, reviewFormData)
			await changeStatus(application.id, status)
			setReviewErrors({})
			setReviewMessage(
				status === APPLICATION_STATUS.APPROVED
					? 'Application approved after internal review.'
					: 'Application declined after internal review.',
			)
		} catch (statusError) {
			setReviewError(statusError.message)
		} finally {
			setReviewAction('')
		}
	}

	function getSelectedOptionId(options) {
		return options.find((option) => Boolean(reviewFormData[option.id]))?.id ?? ''
	}

	if (loading) {
		return <Card>Loading application review...</Card>
	}

	if (error) {
		return <Card className="text-rose-700">{error}</Card>
	}

	if (!application) {
		return (
			<Card className="space-y-4">
				<h2 className="text-2xl font-semibold text-slate-900">Application not found</h2>
				<p className="text-sm text-slate-600">The requested application could not be loaded for review.</p>
				<Button variant="secondary" onClick={() => navigate('/admin/applications')}>
					Back to applications
				</Button>
			</Card>
		)
	}

	return (
		<div className="space-y-6">
			<Card className="p-5 sm:p-6">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
					<div className="min-w-0">
						<p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-700">Admin review</p>
						<h2 className="mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">
							{application.formData.tradingAs || 'Unnamed business'}
						</h2>
						<p className="mt-2 break-all text-sm text-slate-600">{application.applicant_email}</p>
						<p className="mt-3 text-sm text-slate-600">
							Complete the internal review fields, save them, and then approve or decline the application.
						</p>
					</div>
					<div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
						<Button variant="secondary" className="w-full sm:w-auto" onClick={() => navigate('/admin/applications')}>
							Back to list
						</Button>
						<Button variant="secondary" className="w-full sm:w-auto" onClick={handleDownload}>
							Download PDF
						</Button>
					</div>
				</div>
			</Card>

			<div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
				<Card className="p-5 sm:p-6">
					<p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">User submission</p>
					<div className="mt-4 grid gap-4 md:grid-cols-2">
						{PREVIEW_FIELDS.map((fieldId) => (
							<div key={fieldId} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
								<p className="text-xs uppercase tracking-[0.25em] text-slate-500">{getFieldDisplayLabel(fieldId)}</p>
								<p className="mt-2 text-sm font-medium text-slate-900 wrap-break-word">
									{getFieldDisplayValue(application.formData, fieldId)}
								</p>
							</div>
						))}
					</div>
				</Card>

				<div className="space-y-6">
					<Card className="space-y-4 p-5 sm:p-6">
						<div className="flex flex-wrap items-center gap-3">
							<p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">Review actions</p>
							<span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-slate-700">
								{application.status}
							</span>
						</div>
						{reviewError ? <p className="text-sm text-rose-700">{reviewError}</p> : null}
						{reviewMessage ? <p className="text-sm text-emerald-700">{reviewMessage}</p> : null}
						<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
							<Button variant="secondary" className="w-full sm:w-auto" onClick={handleSaveReview} disabled={reviewAction !== ''}>
								{reviewAction === 'save' ? 'Saving...' : 'Save review'}
							</Button>
							<Button
								variant="danger"
								className="w-full sm:w-auto"
								onClick={() => handleReviewDecision(APPLICATION_STATUS.REJECTED)}
								disabled={reviewAction !== ''}
							>
								{reviewAction === APPLICATION_STATUS.REJECTED ? 'Declining...' : 'Decline'}
							</Button>
							<Button
								className="w-full sm:w-auto"
								onClick={() => handleReviewDecision(APPLICATION_STATUS.APPROVED)}
								disabled={reviewAction !== ''}
							>
								{reviewAction === APPLICATION_STATUS.APPROVED ? 'Approving...' : 'Approve'}
							</Button>
						</div>
					</Card>

					<Card className="space-y-5 p-5 sm:p-6">
						<div>
							<p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-700">Stockhandler information</p>
							<div className="mt-4 grid gap-4 md:grid-cols-2">
								<AdminField label="Stockhandler name" error={reviewErrors.stockHandlerName}>
									<input
										className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-700"
										value={reviewFormData.stockHandlerName ?? ''}
										onChange={(event) => handleFieldChange({ id: 'stockHandlerName' }, event.target.value)}
									/>
								</AdminField>
								<AdminField label="Stockhandler ID" error={reviewErrors.stockHandlerId}>
									<input
										className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-700"
										value={reviewFormData.stockHandlerId ?? ''}
										onChange={(event) => handleFieldChange({ id: 'stockHandlerId' }, event.target.value)}
									/>
								</AdminField>
							</div>
						</div>

						<div>
							<p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-700">Credit information</p>
							<div className="mt-4 space-y-4">
								<AdminChoiceGroup
									label="Credit limit"
									options={CREDIT_LIMIT_OPTIONS}
									selectedValue={getSelectedOptionId(CREDIT_LIMIT_OPTIONS)}
									error={reviewErrors.creditLimit100}
									onSelect={(field) => handleFieldChange(field, true)}
								/>
								<div className="grid gap-4 md:grid-cols-2">
									<AdminField label="Credit check info" error={reviewErrors.creditCheckInfo} fullWidth>
										<textarea
											className="min-h-28 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-700"
											value={reviewFormData.creditCheckInfo ?? ''}
											onChange={(event) => handleFieldChange({ id: 'creditCheckInfo' }, event.target.value)}
										/>
									</AdminField>
									<AdminField label="Application number" error={reviewErrors.applicationNumber}>
										<input
											className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-700"
											value={reviewFormData.applicationNumber ?? ''}
											onChange={(event) => handleFieldChange({ id: 'applicationNumber' }, event.target.value)}
										/>
									</AdminField>
									<AdminField label="Vendor registration ID" error={reviewErrors.vendorRegistrationId}>
										<input
											className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-700"
											value={reviewFormData.vendorRegistrationId ?? ''}
											onChange={(event) => handleFieldChange({ id: 'vendorRegistrationId' }, event.target.value)}
										/>
									</AdminField>
								</div>
							</div>
						</div>

						<div>
							<p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-700">Assessment of potential conflict of interest</p>
							<div className="mt-4 space-y-4">
								<AdminChoiceGroup
									label="Assessment"
									options={CONFLICT_ASSESSMENT_OPTIONS}
									selectedValue={getSelectedOptionId(CONFLICT_ASSESSMENT_OPTIONS)}
									error={reviewErrors.assessmentNoConflict}
									onSelect={(field) => handleFieldChange(field, true)}
								/>
								<AdminField label="Reasons and steps taken" error={reviewErrors.conflictAssessmentNotes} fullWidth>
									<textarea
										className="min-h-32 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-700"
										value={reviewFormData.conflictAssessmentNotes ?? ''}
										onChange={(event) => handleFieldChange({ id: 'conflictAssessmentNotes' }, event.target.value)}
										placeholder="Document the reasons and any mitigation steps when a conflict exists."
									/>
								</AdminField>
							</div>
						</div>

						<div>
							<p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-700">Processing details</p>
							<div className="mt-4 grid gap-4 md:grid-cols-2">
								<AdminField label="Processed on" error={reviewErrors.processedOn}>
									<input
										type="date"
										className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-700"
										value={reviewFormData.processedOn ?? ''}
										onChange={(event) => handleFieldChange({ id: 'processedOn' }, event.target.value)}
									/>
								</AdminField>
								<AdminField label="Sales representative name" error={reviewErrors.salesRepresentativeName}>
									<input
										className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-700"
										value={reviewFormData.salesRepresentativeName ?? ''}
										onChange={(event) => handleFieldChange({ id: 'salesRepresentativeName' }, event.target.value)}
									/>
								</AdminField>
							</div>
							<div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
								Status changes are only available after the internal review fields are completed.
							</div>
						</div>
					</Card>
				</div>
			</div>
		</div>
	)
}

export default ApplicationReview