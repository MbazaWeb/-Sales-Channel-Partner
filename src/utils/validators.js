import { FIELD_MAP, REQUIRED_DOCUMENTS } from './constants.js'

export const TIN_PATTERN = /^\d{9,12}$/
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const REQUIRED_FIELDS = [
	'zoneName',
	'regionName',
	'districtName',
	'tradingAs',
	'registrationIdentificationNumber',
	'citizenship',
	'contactName',
	'contactSurname',
	'dateOfBirth',
	'tinNumber',
	'telephoneWork',
	'telephoneCell',
	'email',
	'email2',
	'physicalAddressLine1',
	'postalAddressLine1',
	'customerNumber',
	'authorityToTransact',
	'designationCapacity',
	'authorizedRepresentative',
	'authorizedCapacity',
	'signedAt',
	'signedDay',
	'signedMonth',
	'signedYear',
	'signature',
	'witness1',
	'witness2',
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

const ADMIN_REQUIRED_FIELDS = [
	'stockHandlerName',
	'stockHandlerId',
	'creditCheckInfo',
	'applicationNumber',
	'vendorRegistrationId',
	'processedOn',
	'salesRepresentativeName',
]

const ADMIN_CREDIT_LIMIT_FIELDS = ['creditLimit100', 'creditLimit150', 'creditLimit200']
const ADMIN_CONFLICT_FIELDS = ['assessmentNoConflict', 'assessmentConflict']

export function validateTinNumber(value) {
	return TIN_PATTERN.test(String(value ?? '').trim())
}

function validateEmail(value) {
	return EMAIL_PATTERN.test(String(value ?? '').trim())
}

export function validateApplicationForm(formData, files) {
	const errors = {}

	REQUIRED_FIELDS.forEach((fieldId) => {
		if (!String(formData[fieldId] ?? '').trim()) {
			const label = FIELD_MAP[fieldId]?.label ?? {
				zoneName: 'Zone',
				regionName: 'Region',
				districtName: 'District',
				signedYear: 'Signed year',
			}[fieldId]
			errors[fieldId] = `${label} is required.`
		}
	})

	if (!validateTinNumber(formData.tinNumber)) {
		errors.tinNumber = 'TIN must be between 9 and 12 digits.'
	}

	if (formData.email && !validateEmail(formData.email)) {
		errors.email = 'Enter a valid email address.'
	}

	if (formData.email2 && !validateEmail(formData.email2)) {
		errors.email2 = 'Enter a valid secondary email address.'
	}

	if (!formData.genderFemale && !formData.genderMale) {
		errors.genderFemale = 'Select a gender option.'
	}

	if (!formData.creditCheckConsentYes && !formData.creditCheckConsentNo) {
		errors.creditCheckConsentYes = 'Select a credit check consent option.'
	}

	if (!formData.declarationNoConflict && !formData.declarationHasConflict) {
		errors.declarationNoConflict = 'Select a declaration of interest option.'
	}

	if (formData.declarationHasConflict && !String(formData.natureOfInterest ?? '').trim()) {
		errors.natureOfInterest = 'Provide the nature of the interest.'
	}

	if (!SALES_CHANNEL_FIELDS.some((fieldId) => Boolean(formData[fieldId]))) {
		errors.salesChannelAgency = 'Select at least one sales channel.'
	}

	if (formData.salesChannelOther && !String(formData.salesChannelOtherText ?? '').trim()) {
		errors.salesChannelOtherText = 'Provide the other sales channel detail.'
	}

	if (!RESPONSIBILITY_FIELDS.some((fieldId) => Boolean(formData[fieldId]))) {
		errors.responsibilityCollectSubscription = 'Select at least one sales channel responsibility.'
	}

	REQUIRED_DOCUMENTS.forEach((document) => {
		if (!files[document.key]) {
			errors[document.key] = `${document.label} is required.`
		}
	})

	return errors
}

export function formatPreviewValue(value) {
	if (typeof value === 'boolean') {
		return value ? 'Yes' : 'No'
	}

	return String(value ?? '').trim() || 'Not provided'
}

export function validateAdminReviewForm(formData) {
	const errors = {}

	ADMIN_REQUIRED_FIELDS.forEach((fieldId) => {
		if (!String(formData[fieldId] ?? '').trim()) {
			const label = FIELD_MAP[fieldId]?.label ?? fieldId
			errors[fieldId] = `${label} is required.`
		}
	})

	if (!ADMIN_CREDIT_LIMIT_FIELDS.some((fieldId) => Boolean(formData[fieldId]))) {
		errors.creditLimit100 = 'Select the credit information value.'
	}

	if (!ADMIN_CONFLICT_FIELDS.some((fieldId) => Boolean(formData[fieldId]))) {
		errors.assessmentNoConflict = 'Select the conflict assessment result.'
	}

	if (formData.assessmentConflict && !String(formData.conflictAssessmentNotes ?? '').trim()) {
		errors.conflictAssessmentNotes = 'Provide the reasons and steps taken for the conflict.'
	}

	return errors
}
