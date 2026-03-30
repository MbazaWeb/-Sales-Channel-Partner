import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import FileUpload from '../../components/form/FileUpload.jsx'
import Modal from '../../components/ui/Modal.jsx'
import Button from '../../components/ui/Button.jsx'
import Card from '../../components/ui/Card.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { useApplications } from '../../hooks/useApplications.js'
import { createApplication } from '../../services/applicationService.js'
import { uploadApplicationFile } from '../../services/fileService.js'
import { getLocationCatalog } from '../../services/locationService.js'
import {
	APPLICATION_STATUS,
	CHECKBOX_GROUPS,
	FIELD_MAP,
	REQUIRED_DOCUMENTS,
	createInitialFormData,
} from '../../utils/constants.js'
import { generateApplicationPdf } from '../../utils/pdfGenerator.js'
import { validateApplicationForm } from '../../utils/validators.js'

const DETAIL_SECTIONS = [
	{
		title: 'Business details',
		description: 'Capture the core registration and contact details for the business.',
		fields: [
			'tradingAs',
			'registrationIdentificationNumber',
			'citizenship',
			'contactName',
			'contactSurname',
			'dateOfBirth',
			'tinNumber',
		],
	},
	{
		title: 'Business representative',
		description: 'Use the same details that should appear on the signed application document.',
		fields: [
			'telephoneWork',
			'telephoneCell',
			'email',
			'email2',
			'physicalAddressLine1',
			'physicalAddressLine2',
			'physicalAddressLine3',
			'postalAddressLine1',
			'postalAddressLine2',
			'postalAddressLine3',
			'customerNumber',
			'authorityToTransact',
			'designationCapacity',
		],
	},
	{
		title: 'Signing details',
		description: 'These values are placed into the signature section of the application PDF.',
		fields: [
			'authorizedRepresentative',
			'authorizedCapacity',
			'signedAt',
			'signedDay',
			'signedMonth',
			'signedYear',
			'signature',
			'witness1',
			'witness2',
		],
	},
]

const SALES_CHANNEL_FIELDS = [
	'salesChannelAgency',
	'salesChannelRetailer',
	'salesChannelDealer',
	'salesChannelMegaDealer',
	'salesChannelMomsAndPops',
	'salesChannelDSF',
	'salesChannelOther',
	'salesChannelInstaller',
]

const RESPONSIBILITY_FIELDS = [
	'responsibilityCollectSubscription',
	'responsibilityUpgradesDowngrades',
	'responsibilityCreateUpdateRecords',
	'responsibilityActivateSubscribers',
	'responsibilitySaleOfEquipment',
	'responsibilityInstallations',
	'responsibilitySwappingRepair',
	'responsibilityMarketing',
]

const EXCLUSIVE_GROUPS = [
	{
		title: 'Gender',
		description: 'Choose one option.',
		groupName: 'gender',
		errorKey: 'genderFemale',
		optionIds: ['genderFemale', 'genderMale'],
	},
	{
		title: 'Credit check consent',
		description: 'Choose one option.',
		groupName: 'creditCheckConsent',
		errorKey: 'creditCheckConsentYes',
		optionIds: ['creditCheckConsentYes', 'creditCheckConsentNo'],
	},
	{
		title: 'Conflict declaration',
		description: 'Choose one option.',
		groupName: 'conflictDeclaration',
		errorKey: 'declarationNoConflict',
		optionIds: ['declarationNoConflict', 'declarationHasConflict'],
	},
]

const COUNTRY_OPTIONS = [
	'Afghanistan',
	'Albania',
	'Algeria',
	'Andorra',
	'Angola',
	'Antigua and Barbuda',
	'Argentina',
	'Armenia',
	'Australia',
	'Austria',
	'Azerbaijan',
	'Bahamas',
	'Bahrain',
	'Bangladesh',
	'Barbados',
	'Belarus',
	'Belgium',
	'Belize',
	'Benin',
	'Bhutan',
	'Bolivia',
	'Bosnia and Herzegovina',
	'Botswana',
	'Brazil',
	'Brunei',
	'Bulgaria',
	'Burkina Faso',
	'Burundi',
	'Cabo Verde',
	'Cambodia',
	'Cameroon',
	'Canada',
	'Central African Republic',
	'Chad',
	'Chile',
	'China',
	'Colombia',
	'Comoros',
	'Congo',
	'Costa Rica',
	"Cote d'Ivoire",
	'Croatia',
	'Cuba',
	'Cyprus',
	'Czech Republic',
	'Democratic Republic of the Congo',
	'Denmark',
	'Djibouti',
	'Dominica',
	'Dominican Republic',
	'Ecuador',
	'Egypt',
	'El Salvador',
	'Equatorial Guinea',
	'Eritrea',
	'Estonia',
	'Eswatini',
	'Ethiopia',
	'Fiji',
	'Finland',
	'France',
	'Gabon',
	'Gambia',
	'Georgia',
	'Germany',
	'Ghana',
	'Greece',
	'Grenada',
	'Guatemala',
	'Guinea',
	'Guinea-Bissau',
	'Guyana',
	'Haiti',
	'Honduras',
	'Hungary',
	'Iceland',
	'India',
	'Indonesia',
	'Iran',
	'Iraq',
	'Ireland',
	'Israel',
	'Italy',
	'Jamaica',
	'Japan',
	'Jordan',
	'Kazakhstan',
	'Kenya',
	'Kiribati',
	'Kuwait',
	'Kyrgyzstan',
	'Laos',
	'Latvia',
	'Lebanon',
	'Lesotho',
	'Liberia',
	'Libya',
	'Liechtenstein',
	'Lithuania',
	'Luxembourg',
	'Madagascar',
	'Malawi',
	'Malaysia',
	'Maldives',
	'Mali',
	'Malta',
	'Marshall Islands',
	'Mauritania',
	'Mauritius',
	'Mexico',
	'Micronesia',
	'Moldova',
	'Monaco',
	'Mongolia',
	'Montenegro',
	'Morocco',
	'Mozambique',
	'Myanmar',
	'Namibia',
	'Nauru',
	'Nepal',
	'Netherlands',
	'New Zealand',
	'Nicaragua',
	'Niger',
	'Nigeria',
	'North Korea',
	'North Macedonia',
	'Norway',
	'Oman',
	'Pakistan',
	'Palau',
	'Panama',
	'Papua New Guinea',
	'Paraguay',
	'Peru',
	'Philippines',
	'Poland',
	'Portugal',
	'Qatar',
	'Romania',
	'Russia',
	'Rwanda',
	'Saint Kitts and Nevis',
	'Saint Lucia',
	'Saint Vincent and the Grenadines',
	'Samoa',
	'San Marino',
	'Sao Tome and Principe',
	'Saudi Arabia',
	'Senegal',
	'Serbia',
	'Seychelles',
	'Sierra Leone',
	'Singapore',
	'Slovakia',
	'Slovenia',
	'Solomon Islands',
	'Somalia',
	'South Africa',
	'South Korea',
	'South Sudan',
	'Spain',
	'Sri Lanka',
	'Sudan',
	'Suriname',
	'Sweden',
	'Switzerland',
	'Syria',
	'Taiwan',
	'Tajikistan',
	'Tanzania',
	'Thailand',
	'Timor-Leste',
	'Togo',
	'Tonga',
	'Trinidad and Tobago',
	'Tunisia',
	'Turkey',
	'Turkmenistan',
	'Tuvalu',
	'Uganda',
	'Ukraine',
	'United Arab Emirates',
	'United Kingdom',
	'United States',
	'Uruguay',
	'Uzbekistan',
	'Vanuatu',
	'Vatican City',
	'Venezuela',
	'Vietnam',
	'Yemen',
	'Zambia',
	'Zimbabwe',
]

const AUTHORITY_OPTIONS = [
	'Owner',
	'Director',
	'Partner',
	'Authorized Representative',
	'Power of Attorney',
	'Board Resolution',
]

const DESIGNATION_OPTIONS = [
	'Owner',
	'Managing Director',
	'Director',
	'General Manager',
	'Operations Manager',
	'Sales Manager',
	'Administrator',
	'Authorized Signatory',
]

const AUTHORIZED_CAPACITY_OPTIONS = [
	'Owner',
	'Director',
	'Managing Director',
	'General Manager',
	'Operations Manager',
	'Sales Manager',
	'Administrator',
	'Authorized Signatory',
	'Power of Attorney',
]

const MONTH_OPTIONS = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
]

const DAY_OPTIONS = Array.from({ length: 31 }, (_, index) => String(index + 1))
const YEAR_OPTIONS = Array.from({ length: 21 }, (_, index) => String(new Date().getFullYear() - 5 + index))
const FORM_ONLY_FIELDS = {
	signedYear: {
		id: 'signedYear',
		label: 'Signed year',
	},
}

const FORM_BOOK_STEPS = [
	{
		id: 'location',
		title: 'Operating location',
		description: 'Select zone, region, and district before continuing.',
		fieldIds: ['zoneName', 'regionName', 'districtName'],
		kind: 'location',
	},
	...DETAIL_SECTIONS.map((section, index) => ({
		id: `detail-${index}`,
		title: section.title,
		description: section.description,
		fieldIds: section.fields,
		kind: 'detail',
	})),
	{
		id: 'declarations',
		title: 'Declarations',
		description: 'Confirm the required declarations and consent options.',
		fieldIds: [
			'genderFemale',
			'genderMale',
			'creditCheckConsentYes',
			'creditCheckConsentNo',
			'declarationNoConflict',
			'declarationHasConflict',
			'natureOfInterest',
		],
		kind: 'declarations',
	},
	{
		id: 'sales-channels',
		title: 'Sales channels',
		description: 'Select every sales channel that applies to the business.',
		fieldIds: [...SALES_CHANNEL_FIELDS, 'salesChannelOtherText'],
		kind: 'salesChannels',
	},
	{
		id: 'responsibilities',
		title: 'Responsibilities',
		description: 'Select the responsibilities the applicant will handle.',
		fieldIds: RESPONSIBILITY_FIELDS,
		kind: 'responsibilities',
	},
	{
		id: 'documents',
		title: 'Required documents',
		description: 'Upload the support files and preview the final filled application.',
		fieldIds: REQUIRED_DOCUMENTS.map((document) => document.key),
		kind: 'documents',
	},
]

function BookProgress({ steps, activeStepIndex, onSelect }) {
	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between gap-3">
				<p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-700">Step {activeStepIndex + 1} of {steps.length}</p>
				<p className="text-sm text-slate-500">{Math.round(((activeStepIndex + 1) / steps.length) * 100)}% complete</p>
			</div>
			<div className="h-2 overflow-hidden rounded-full bg-slate-200">
				<div
					className="h-full rounded-full bg-blue-700 transition-all duration-300"
					style={{ width: `${((activeStepIndex + 1) / steps.length) * 100}%` }}
				/>
			</div>
			<div className="flex gap-2 overflow-x-auto pb-1">
				{steps.map((step, index) => (
					<button
						key={step.id}
						type="button"
						onClick={() => onSelect(index)}
						className={[
							'shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition',
							index === activeStepIndex
								? 'border-blue-700 bg-blue-700 text-white'
								: index < activeStepIndex
									? 'border-blue-200 bg-blue-50 text-blue-800'
									: 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900',
						].join(' ')}
					>
						{step.title}
					</button>
				))}
			</div>
		</div>
	)
}

function SignaturePad({ value, error, onChange }) {
	const canvasRef = useRef(null)
	const isDrawingRef = useRef(false)
	const hasDrawnRef = useRef(Boolean(value))
	const [saveMessage, setSaveMessage] = useState(value ? 'Signature saved.' : '')
	const [isDirty, setIsDirty] = useState(false)

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) {
			return undefined
		}

		const context = canvas.getContext('2d')
		context.lineCap = 'round'
		context.lineJoin = 'round'
		context.strokeStyle = '#0f172a'
		context.lineWidth = 2.5
		context.clearRect(0, 0, canvas.width, canvas.height)

		if (!value) {
			hasDrawnRef.current = false
			setIsDirty(false)
			setSaveMessage('')
			return undefined
		}

		const image = new Image()
		image.onload = () => {
			context.clearRect(0, 0, canvas.width, canvas.height)
			context.drawImage(image, 0, 0, canvas.width, canvas.height)
			hasDrawnRef.current = true
			setIsDirty(false)
			setSaveMessage('Signature saved.')
		}
		image.src = value

		return () => {
			image.onload = null
		}
	}, [value])

	function getCoordinates(event) {
		const canvas = canvasRef.current
		const rect = canvas.getBoundingClientRect()
		return {
			x: ((event.clientX - rect.left) / rect.width) * canvas.width,
			y: ((event.clientY - rect.top) / rect.height) * canvas.height,
		}
	}

	function handlePointerDown(event) {
		event.preventDefault()
		const canvas = canvasRef.current
		const context = canvas.getContext('2d')
		const point = getCoordinates(event)
		isDrawingRef.current = true
		hasDrawnRef.current = true
		setSaveMessage('')
		context.beginPath()
		context.moveTo(point.x, point.y)
	}

	function handlePointerMove(event) {
		if (!isDrawingRef.current) {
			return
		}

		event.preventDefault()
		const canvas = canvasRef.current
		const context = canvas.getContext('2d')
		const point = getCoordinates(event)
		context.lineTo(point.x, point.y)
		context.stroke()
	}

	function handlePointerUp() {
		if (!isDrawingRef.current) {
			return
		}

		isDrawingRef.current = false
		setIsDirty(true)
	}

	function handleSave() {
		const canvas = canvasRef.current
		if (!canvas || !hasDrawnRef.current) {
			return
		}

		onChange(FIELD_MAP.signature, canvas.toDataURL('image/png'))
		setIsDirty(false)
		setSaveMessage('Signature saved.')
	}

	function handleClear() {
		const canvas = canvasRef.current
		const context = canvas.getContext('2d')
		context.clearRect(0, 0, canvas.width, canvas.height)
		isDrawingRef.current = false
		hasDrawnRef.current = false
		setIsDirty(false)
		setSaveMessage('')
		onChange(FIELD_MAP.signature, '')
	}

	return (
		<div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-5">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h3 className="text-lg font-semibold text-slate-900">Signature</h3>
					<p className="mt-1 text-sm text-slate-600">Sign directly on screen using your mouse, touch, or stylus, then save it.</p>
				</div>
				<div className="flex flex-wrap gap-2">
					<Button variant="secondary" onClick={handleClear}>
						Clear signature
					</Button>
					<Button onClick={handleSave} disabled={!hasDrawnRef.current || !isDirty}>
						Save signature
					</Button>
				</div>
			</div>
			<div className={[
				'overflow-hidden rounded-2xl border bg-white',
				error ? 'border-rose-300' : 'border-slate-300',
			].join(' ')}>
				<canvas
					ref={canvasRef}
					width={720}
					height={220}
					className="h-44 w-full touch-none bg-white"
					onPointerDown={handlePointerDown}
					onPointerMove={handlePointerMove}
					onPointerUp={handlePointerUp}
					onPointerLeave={handlePointerUp}
				/>
			</div>
			{saveMessage ? <p className="text-sm text-emerald-700">{saveMessage}</p> : null}
			{isDirty ? <p className="text-sm text-amber-700">Save the signature before previewing the final application.</p> : null}
			{error ? <p className="text-sm text-rose-700">{error}</p> : null}
		</div>
	)
}

function fieldInputType(fieldId) {
	if (fieldId === 'dateOfBirth') {
		return 'date'
	}

	if (fieldId === 'email' || fieldId === 'email2') {
		return 'email'
	}

	return 'text'
}

function StandardTextField({ fieldId, value, error, onChange, signingLocationOptions }) {
	const field = FIELD_MAP[fieldId] ?? FORM_ONLY_FIELDS[fieldId]

	if (fieldId === 'citizenship' || fieldId === 'authorityToTransact' || fieldId === 'designationCapacity' || fieldId === 'authorizedCapacity' || fieldId === 'signedAt' || fieldId === 'signedDay' || fieldId === 'signedMonth' || fieldId === 'signedYear') {
		const optionsByFieldId = {
			citizenship: COUNTRY_OPTIONS,
			authorityToTransact: AUTHORITY_OPTIONS,
			designationCapacity: DESIGNATION_OPTIONS,
			authorizedCapacity: AUTHORIZED_CAPACITY_OPTIONS,
			signedAt: signingLocationOptions,
			signedDay: DAY_OPTIONS,
			signedMonth: MONTH_OPTIONS,
			signedYear: YEAR_OPTIONS,
		}

		return (
			<label className="block">
				<span className="mb-2 block text-sm font-medium text-slate-700">{field.label}</span>
				<select
					value={value}
					onChange={(event) => onChange(field, event.target.value)}
					className={[
						'w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100',
						error ? 'border-rose-300 bg-rose-50' : 'border-slate-300 bg-white',
					].join(' ')}
				>
					<option value="">Select option</option>
					{optionsByFieldId[fieldId].map((option) => (
						<option key={option} value={option}>
							{option}
						</option>
					))}
				</select>
				{error ? <p className="mt-2 text-sm text-rose-700">{error}</p> : null}
			</label>
		)
	}

	return (
		<label className="block">
			<span className="mb-2 block text-sm font-medium text-slate-700">{field.label}</span>
			<input
				type={fieldInputType(fieldId)}
				value={value}
				onChange={(event) => onChange(field, event.target.value)}
				className={[
					'w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100',
					error ? 'border-rose-300 bg-rose-50' : 'border-slate-300 bg-white',
				].join(' ')}
			/>
			{error ? <p className="mt-2 text-sm text-rose-700">{error}</p> : null}
		</label>
	)
}

function StandardCheckboxList({ title, description, fieldIds, values, onChange }) {
	return (
		<div className="space-y-3">
			<div>
				<h3 className="text-xl font-semibold text-slate-900">{title}</h3>
				<p className="mt-2 text-sm text-slate-600">{description}</p>
			</div>
			<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
				{fieldIds.map((fieldId) => {
					const field = FIELD_MAP[fieldId]

					return (
						<label
							key={field.id}
							className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
						>
							<input
								type="checkbox"
								checked={Boolean(values[field.id])}
								onChange={(event) => onChange(field, event.target.checked)}
								className="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-500"
							/>
							<span>{field.label}</span>
						</label>
					)
				})}
			</div>
		</div>
	)
}

function ExclusiveChoiceGroup({ title, description, groupName, optionIds, values, errorKey, onChange, error }) {
	return (
		<div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-5">
			<div>
				<h3 className="text-lg font-semibold text-slate-900">{title}</h3>
				<p className="mt-1 text-sm text-slate-600">{description}</p>
			</div>
			<div className="grid gap-3 md:grid-cols-2">
				{optionIds.map((fieldId) => {
					const field = FIELD_MAP[fieldId]

					return (
						<label
							key={field.id}
							className={[
								'flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition',
								values[field.id]
									? 'border-blue-300 bg-blue-50 text-blue-900'
									: 'border-slate-200 bg-white text-slate-700 hover:border-slate-300',
							].join(' ')}
						>
							<input
								type="radio"
								name={groupName}
								checked={Boolean(values[field.id])}
								onChange={() => onChange(field, true)}
								className="h-4 w-4 border-slate-300 text-blue-700 focus:ring-blue-500"
							/>
							<span>{field.label}</span>
						</label>
					)
				})}
			</div>
			{error ? <p className="text-sm text-rose-700">{error}</p> : null}
		</div>
	)
}

function ApplicationForm() {
	const navigate = useNavigate()
	const { applicationId } = useParams()
	const { user, role } = useAuth()
	const { applications, loading: loadingApplications, refreshApplications } = useApplications()
	const [formData, setFormData] = useState(createInitialFormData)
	const [documents, setDocuments] = useState({ outletPhoto: null, idDocument: null })
	const [activeStepIndex, setActiveStepIndex] = useState(0)
	const [currentDraftId, setCurrentDraftId] = useState(applicationId ?? null)
	const [draftMessage, setDraftMessage] = useState('')
	const [errors, setErrors] = useState({})
	const [catalog, setCatalog] = useState({ zones: [], regions: [], districts: [] })
	const [loadingLocations, setLoadingLocations] = useState(true)
	const [previewUrl, setPreviewUrl] = useState('')
	const [previewOpen, setPreviewOpen] = useState(false)
	const [previewLoading, setPreviewLoading] = useState(false)
	const [submitting, setSubmitting] = useState(false)
	const [submissionMessage, setSubmissionMessage] = useState('')
	const [submissionError, setSubmissionError] = useState('')

	const regions = useMemo(
		() => catalog.regions.filter((region) => region.zone_id === formData.zoneId),
		[catalog.regions, formData.zoneId],
	)

	const districts = useMemo(
		() => catalog.districts.filter((district) => district.region_id === formData.regionId),
		[catalog.districts, formData.regionId],
	)

	const signingLocationOptions = useMemo(
		() => [...new Set(catalog.districts.map((district) => district.name).filter(Boolean))].sort((left, right) => left.localeCompare(right)),
		[catalog.districts],
	)
	const activeStep = FORM_BOOK_STEPS[activeStepIndex]
	const incompleteApplications = useMemo(
		() => applications.filter((application) => application.status === APPLICATION_STATUS.INCOMPLETE),
		[applications],
	)
	const resumeApplication = useMemo(() => {
		if (applicationId) {
			return incompleteApplications.find((application) => application.id === applicationId) ?? null
		}

		return incompleteApplications[0] ?? null
	}, [applicationId, incompleteApplications])
	const hydratedDraftRef = useRef('')

	useEffect(() => {
		return () => {
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl)
			}
		}
	}, [previewUrl])

	useEffect(() => {
		let isMounted = true

		async function loadLocations() {
			try {
				const nextCatalog = await getLocationCatalog()
				if (isMounted) {
					setCatalog(nextCatalog)
				}
			} catch (loadError) {
				if (isMounted) {
					setSubmissionError(loadError.message)
				}
			} finally {
				if (isMounted) {
					setLoadingLocations(false)
				}
			}
		}

		loadLocations()

		return () => {
			isMounted = false
		}
	}, [])

	useEffect(() => {
		if (loadingApplications) {
			return
		}

		if (!resumeApplication) {
			if (applicationId && hydratedDraftRef.current !== `missing:${applicationId}`) {
				hydratedDraftRef.current = `missing:${applicationId}`
				setSubmissionError('Incomplete application not found. Start a new application or continue another saved draft.')
			}
			return
		}

		if (hydratedDraftRef.current === resumeApplication.id) {
			return
		}

		hydratedDraftRef.current = resumeApplication.id
		setCurrentDraftId(resumeApplication.id)
		setFormData({
			...createInitialFormData(),
			...resumeApplication.formData,
		})
		setSubmissionError('')
		setDraftMessage('Incomplete application loaded. Continue from where you stopped.')
	}, [applicationId, loadingApplications, resumeApplication])

	function hasDraftContent() {
		return Object.entries(formData).some(([, value]) =>
			typeof value === 'boolean' ? value : String(value ?? '').trim() !== '',
		)
	}

	function handleFieldChange(field, value) {
		setErrors((currentErrors) => {
			const nextErrors = { ...currentErrors, [field.id]: undefined }

			if (field.group) {
				CHECKBOX_GROUPS[field.group].forEach((fieldId) => {
					nextErrors[fieldId] = undefined
				})
			}

			return nextErrors
		})
		setSubmissionError('')
		setSubmissionMessage('')
		setFormData((currentData) => {
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

	function handleZoneChange(event) {
		const zoneId = event.target.value
		const zone = catalog.zones.find((entry) => entry.id === zoneId)
		setErrors((currentErrors) => ({
			...currentErrors,
			zoneName: undefined,
			regionName: undefined,
			districtName: undefined,
		}))
		setFormData((currentData) => ({
			...currentData,
			zoneId,
			zoneName: zone?.name ?? '',
			regionId: '',
			regionName: '',
			districtId: '',
			districtName: '',
		}))
	}

	function handleRegionChange(event) {
		const regionId = event.target.value
		const region = catalog.regions.find((entry) => entry.id === regionId)
		setErrors((currentErrors) => ({ ...currentErrors, regionName: undefined, districtName: undefined }))
		setFormData((currentData) => ({
			...currentData,
			regionId,
			regionName: region?.name ?? '',
			districtId: '',
			districtName: '',
		}))
	}

	function handleDistrictChange(event) {
		const districtId = event.target.value
		const district = catalog.districts.find((entry) => entry.id === districtId)
		setErrors((currentErrors) => ({ ...currentErrors, districtName: undefined }))
		setFormData((currentData) => ({
			...currentData,
			districtId,
			districtName: district?.name ?? '',
		}))
	}

	function handleDocumentChange(documentKey, file) {
		setDocuments((current) => ({ ...current, [documentKey]: file }))
		setErrors((currentErrors) => ({ ...currentErrors, [documentKey]: undefined }))
		setSubmissionError('')
		setSubmissionMessage('')
	}

	async function saveIncompleteApplication({ silent = false } = {}) {
		if (!user || !hasDraftContent()) {
			return null
		}

		setSubmissionError('')

		try {
			const savedApplication = await createApplication({
				applicationId: currentDraftId,
				userId: user.id,
				applicantEmail: user.email,
				formData: {
					...formData,
					status: APPLICATION_STATUS.INCOMPLETE,
				},
				status: APPLICATION_STATUS.INCOMPLETE,
			})

			setCurrentDraftId(savedApplication.id)
			setDraftMessage('Incomplete application saved. You can continue it later from My Applications.')
			if (!silent) {
				setSubmissionMessage('Incomplete application saved successfully.')
			}
			await refreshApplications()
			return savedApplication
		} catch (saveError) {
			setSubmissionError(saveError.message)
			return null
		}
	}

	function jumpToStep(nextIndex) {
		setActiveStepIndex(Math.max(0, Math.min(FORM_BOOK_STEPS.length - 1, nextIndex)))
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	async function persistAndJumpToStep(nextIndex) {
		const saved = await saveIncompleteApplication({ silent: true })

		if (hasDraftContent() && !saved && !currentDraftId) {
			return
		}

		jumpToStep(nextIndex)
	}

	async function handlePreview(event) {
		event.preventDefault()
		setSubmissionMessage('')
		setSubmissionError('')

		const nextErrors = validateApplicationForm(formData, documents)
		setErrors(nextErrors)

		if (Object.keys(nextErrors).length > 0) {
			const firstErrorStepIndex = FORM_BOOK_STEPS.findIndex((step) =>
				step.fieldIds.some((fieldId) => nextErrors[fieldId]),
			)

			if (firstErrorStepIndex >= 0) {
				jumpToStep(firstErrorStepIndex)
			}

			setSubmissionError('Resolve the highlighted fields and required uploads before previewing the final application.')
			return
		}

		setPreviewLoading(true)

		try {
			const previewDocuments = REQUIRED_DOCUMENTS
				.map((document) => documents[document.key])
				.filter(Boolean)
			const previewBlob = await generateApplicationPdf(
				{
					formData: {
						...formData,
						status: APPLICATION_STATUS.PENDING,
					},
				},
				previewDocuments,
			)
			const objectUrl = URL.createObjectURL(previewBlob)

			if (previewUrl) {
				URL.revokeObjectURL(previewUrl)
			}

			setPreviewUrl(objectUrl)
			setPreviewOpen(true)
		} catch (previewError) {
			setSubmissionError(previewError.message)
		} finally {
			setPreviewLoading(false)
		}
	}

	async function handleFinalSubmit() {
		setSubmitting(true)

		try {
			const application = await createApplication({
				applicationId: currentDraftId,
				userId: user.id,
				applicantEmail: user.email,
				formData: {
					...formData,
					status: APPLICATION_STATUS.PENDING,
				},
				status: APPLICATION_STATUS.PENDING,
			})

			for (const document of REQUIRED_DOCUMENTS) {
				await uploadApplicationFile(application.id, documents[document.key], document.key)
			}

			setPreviewOpen(false)
			setCurrentDraftId(null)
			setDraftMessage('')
			setSubmissionMessage('Application submitted successfully. Your status is now pending review.')
			await refreshApplications()
			navigate('/dashboard', { replace: true })
		} catch (error) {
			setSubmissionError(error.message)
		} finally {
			setSubmitting(false)
		}
	}

	function handleDownloadPreview() {
		if (!previewUrl) {
			return
		}

		const anchor = document.createElement('a')
		anchor.href = previewUrl
		anchor.download = 'scp-application-preview.pdf'
		anchor.click()
	}

	function renderStepCardActions() {
		if (activeStep.kind === 'documents') {
			return (
				<div className="mt-6 flex flex-wrap items-center justify-between gap-3">
					<div className="flex flex-wrap gap-3">
						{activeStepIndex > 0 ? (
							<Button variant="secondary" onClick={() => void persistAndJumpToStep(activeStepIndex - 1)}>
								Previous page
							</Button>
						) : null}
						<Button variant="secondary" onClick={() => void saveIncompleteApplication()}>
							Save and finish later
						</Button>
						<Button variant="secondary" onClick={() => navigate('/dashboard')}>
							Cancel
						</Button>
					</div>
					<Button type="submit" disabled={previewLoading || submitting}>
						{previewLoading ? 'Preparing preview...' : 'Preview filled application'}
					</Button>
				</div>
			)
		}

		return (
			<div className="mt-6 flex flex-wrap items-center justify-between gap-3">
				<div>
					{activeStepIndex > 0 ? (
						<Button variant="secondary" onClick={() => void persistAndJumpToStep(activeStepIndex - 1)}>
							Previous page
						</Button>
					) : null}
				</div>
				<div className="flex flex-wrap gap-3">
					<Button variant="secondary" onClick={() => void saveIncompleteApplication()}>
						Save and finish later
					</Button>
					<Button onClick={() => void persistAndJumpToStep(activeStepIndex + 1)}>
						Next page
					</Button>
				</div>
			</div>
		)
	}

	function renderActiveStep() {
		if (activeStep.kind === 'location') {
			return (
				<Card>
					<div className="flex flex-col gap-2">
						<h3 className="text-xl font-semibold text-slate-900">{activeStep.title}</h3>
						<p className="text-sm text-slate-600">Select Zone, then Region, then District. District selection is enabled only after a region is chosen.</p>
					</div>
					{loadingLocations ? <p className="mt-4 text-sm text-slate-500">Loading locations...</p> : null}
					<div className="mt-6 grid gap-4 md:grid-cols-3">
						<label className="block">
							<span className="mb-2 block text-sm font-medium text-slate-700">Zone</span>
							<select value={formData.zoneId} onChange={handleZoneChange} className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900" disabled={loadingLocations}>
								<option value="">Select zone</option>
								{catalog.zones.map((zone) => (
									<option key={zone.id} value={zone.id}>{zone.name}</option>
								))}
							</select>
							{errors.zoneName ? <p className="mt-2 text-sm text-rose-700">{errors.zoneName}</p> : null}
						</label>
						<label className="block">
							<span className="mb-2 block text-sm font-medium text-slate-700">Region</span>
							<select value={formData.regionId} onChange={handleRegionChange} className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900" disabled={loadingLocations || !formData.zoneId}>
								<option value="">{formData.zoneId ? 'Select region' : 'Select zone first'}</option>
								{regions.map((region) => (
									<option key={region.id} value={region.id}>{region.name}</option>
								))}
							</select>
							{errors.regionName ? <p className="mt-2 text-sm text-rose-700">{errors.regionName}</p> : null}
						</label>
						<label className="block">
							<span className="mb-2 block text-sm font-medium text-slate-700">District</span>
							<select value={formData.districtId} onChange={handleDistrictChange} className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900" disabled={loadingLocations || !formData.regionId}>
								<option value="">{formData.regionId ? 'Select district' : 'Select region first'}</option>
								{districts.map((district) => (
									<option key={district.id} value={district.id}>{district.name}</option>
								))}
							</select>
							{errors.districtName ? <p className="mt-2 text-sm text-rose-700">{errors.districtName}</p> : null}
						</label>
					</div>
					{renderStepCardActions()}
				</Card>
			)
		}

		if (activeStep.kind === 'detail') {
			return (
				<Card>
					<div className="flex flex-col gap-2">
						<h3 className="text-xl font-semibold text-slate-900">{activeStep.title}</h3>
						<p className="text-sm text-slate-600">{activeStep.description}</p>
					</div>
					<div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
						{activeStep.fieldIds.map((fieldId) => (
							<div key={fieldId} className={fieldId === 'signature' ? 'md:col-span-2 xl:col-span-3' : ''}>
								{fieldId === 'signature' ? (
									<SignaturePad value={formData.signature ?? ''} error={errors.signature} onChange={handleFieldChange} />
								) : (
									<StandardTextField fieldId={fieldId} value={formData[fieldId] ?? ''} error={errors[fieldId]} onChange={handleFieldChange} signingLocationOptions={signingLocationOptions} />
								)}
							</div>
						))}
					</div>
					{renderStepCardActions()}
				</Card>
			)
		}

		if (activeStep.kind === 'declarations') {
			return (
				<Card>
					<div className="grid gap-5 xl:grid-cols-3">
						{EXCLUSIVE_GROUPS.map((group) => (
							<ExclusiveChoiceGroup key={group.groupName} title={group.title} description={group.description} groupName={group.groupName} optionIds={group.optionIds} values={formData} errorKey={group.errorKey} onChange={handleFieldChange} error={errors[group.errorKey]} />
						))}
					</div>
					{formData.declarationHasConflict ? (
						<div className="mt-6">
							<StandardTextField fieldId="natureOfInterest" value={formData.natureOfInterest ?? ''} error={errors.natureOfInterest} onChange={handleFieldChange} signingLocationOptions={signingLocationOptions} />
						</div>
					) : null}
					{renderStepCardActions()}
				</Card>
			)
		}

		if (activeStep.kind === 'salesChannels') {
			return (
				<Card>
					<StandardCheckboxList title="Sales channels" description="Select every channel that applies to the application." fieldIds={SALES_CHANNEL_FIELDS} values={formData} onChange={handleFieldChange} />
					{formData.salesChannelOther ? (
						<div className="mt-6 max-w-md">
							<StandardTextField fieldId="salesChannelOtherText" value={formData.salesChannelOtherText ?? ''} error={errors.salesChannelOtherText} onChange={handleFieldChange} />
						</div>
					) : null}
					{errors.salesChannelAgency ? <p className="mt-4 text-sm text-rose-700">{errors.salesChannelAgency}</p> : null}
					{renderStepCardActions()}
				</Card>
			)
		}

		if (activeStep.kind === 'responsibilities') {
			return (
				<Card>
					<StandardCheckboxList title="Responsibilities" description="Select the responsibilities the applicant will handle." fieldIds={RESPONSIBILITY_FIELDS} values={formData} onChange={handleFieldChange} />
					{errors.responsibilityCollectSubscription ? <p className="mt-4 text-sm text-rose-700">{errors.responsibilityCollectSubscription}</p> : null}
					{renderStepCardActions()}
				</Card>
			)
		}

		return (
			<Card>
				<div className="flex flex-col gap-2">
					<h3 className="text-xl font-semibold text-slate-900">Required documents</h3>
					<p className="text-sm text-slate-600">Upload the mandatory support files. Only JPG, PNG, and PDF files up to 5MB are accepted.</p>
				</div>
				<div className="mt-6 grid gap-4 lg:grid-cols-2">
					{REQUIRED_DOCUMENTS.map((document) => (
						<FileUpload key={document.key} label={document.label} description={document.description} accept={document.accept} file={documents[document.key]} error={errors[document.key]} onChange={(file) => handleDocumentChange(document.key, file)} />
					))}
				</div>
				<div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
					<h4 className="text-lg font-semibold text-slate-900">Ready to preview?</h4>
					<p className="mt-2 text-sm text-slate-600">This final page works like the end of the book. Use preview to review the generated application pack before the final submit step.</p>
				</div>
				{renderStepCardActions()}
			</Card>
		)
	}

	return (
		<div className="space-y-6">
			<Card>
				<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
					<div>
						<p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-700">Application form</p>
						<h2 className="mt-3 text-3xl font-semibold text-slate-900">Complete the onboarding details</h2>
						<p className="mt-3 max-w-3xl text-sm text-slate-600">
							Enter the details in a normal form, preview the generated MultiChoice document with your values applied, and only then submit the final application.
						</p>
					</div>
					<div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
						Signed in as <span className="font-semibold text-slate-900">{role}</span>
					</div>
				</div>
			</Card>

			{draftMessage ? (
				<Card className="border-blue-200 bg-blue-50 text-blue-800">
					{draftMessage}
				</Card>
			) : null}

			<Card>
				<BookProgress steps={FORM_BOOK_STEPS} activeStepIndex={activeStepIndex} onSelect={(index) => void persistAndJumpToStep(index)} />
			</Card>

			{submissionError ? (
				<Card className="border-rose-200 bg-rose-50 text-rose-700">
					{submissionError}
				</Card>
			) : null}
			{submissionMessage ? (
				<Card className="border-emerald-200 bg-emerald-50 text-emerald-700">
					{submissionMessage}
				</Card>
			) : null}

			<form className="space-y-6" onSubmit={handlePreview}>
				{renderActiveStep()}
			</form>

			<Modal
				title="Final application preview"
				description="Review the generated document and attached files before submitting the final application."
				isOpen={previewOpen}
				onClose={() => setPreviewOpen(false)}
				actions={
					<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
						<Button variant="secondary" onClick={() => setPreviewOpen(false)}>
							Back to edit
						</Button>
						<Button variant="secondary" onClick={handleDownloadPreview} disabled={!previewUrl}>
							Download preview PDF
						</Button>
						<Button onClick={handleFinalSubmit} disabled={submitting || previewLoading}>
							{submitting ? 'Submitting...' : 'Submit final application'}
						</Button>
					</div>
				}
			>
				<div className="space-y-5">
					<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
						The preview below is generated from your entered details and the selected support files. If something is wrong, go back and edit before submitting.
					</div>
					<div className="rounded-3xl border border-slate-200 bg-slate-50 p-3">
						{previewUrl ? (
							<iframe
								src={previewUrl}
								title="Application PDF preview"
								className="h-[48vh] w-full rounded-2xl border border-slate-200 bg-white sm:h-[70vh]"
							/>
						) : (
							<div className="flex h-[50vh] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-sm text-slate-500">
								Preview is not available.
							</div>
						)}
					</div>
					<div className="rounded-3xl border border-slate-200 bg-white p-4">
						<h3 className="text-lg font-semibold text-slate-900">Included support files</h3>
						<div className="mt-4 grid gap-3 md:grid-cols-2">
							{REQUIRED_DOCUMENTS.map((document) => (
								<div key={document.key} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
									<p className="text-sm font-medium text-slate-900">{document.label}</p>
									<p className="mt-1 text-sm text-slate-600">
										{documents[document.key]?.name ?? 'Not selected'}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</Modal>
		</div>
	)
}

export default ApplicationForm
