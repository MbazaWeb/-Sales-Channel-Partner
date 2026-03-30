export const PDF_BASE_WIDTH = 1190.64
export const PDF_BASE_HEIGHT = 1683.84
export const PDF_TEMPLATE_PATH = '/pdf/form.pdf'

export const STORAGE_BUCKET = 'application-documents'

export const APPLICATION_STATUS = Object.freeze({
	PENDING: 'PENDING',
	APPROVED: 'APPROVED',
	REJECTED: 'REJECTED',
})

export const REQUIRED_DOCUMENTS = [
	{
		key: 'outletPhoto',
		label: 'Outlet Photo',
		description: 'Front-facing outlet or trading location photo.',
		accept: '.jpg,.jpeg,.png,.pdf',
	},
	{
		key: 'idDocument',
		label: 'ID Document',
		description: 'Government-issued identity document or registration proof.',
		accept: '.jpg,.jpeg,.png,.pdf',
	},
]

export const LOCATION_FIELD_LABELS = Object.freeze({
	zoneName: 'Zone',
	regionName: 'Region',
	districtName: 'District',
})

export const PREVIEW_FIELD_LABELS = Object.freeze({
	...LOCATION_FIELD_LABELS,
	tradingAs: 'Trading as',
	registrationIdentificationNumber: 'Registration / Identification No',
	contactName: 'Contact name',
	contactSurname: 'Contact surname',
	tinNumber: 'TIN / VAT number',
	telephoneWork: 'Telephone number work',
	email: 'Email',
	authorityToTransact: 'Authority to transact',
	designationCapacity: 'Designation / capacity',
	signedAt: 'Signed at',
	signedYear: 'Signed year',
	stockHandlerName: 'Stockhandler name',
	stockHandlerId: 'Stockhandler ID',
	creditCheckInfo: 'Credit check info',
	applicationNumber: 'Application number',
	vendorRegistrationId: 'Vendor registration ID',
	conflictAssessmentNotes: 'Conflict assessment notes',
	processedOn: 'Processed on',
	salesRepresentativeName: 'Sales representative name',
})

export const ADMIN_REVIEW_FIELDS = [
	{ id: 'stockHandlerName', label: 'Stockhandler name', inputType: 'text', adminOnly: true },
	{ id: 'stockHandlerId', label: 'Stockhandler ID', inputType: 'text', adminOnly: true },
	{ id: 'creditLimit100', label: '<= $100', type: 'checkbox', group: 'creditLimit', adminOnly: true },
	{ id: 'creditLimit150', label: '<= $150', type: 'checkbox', group: 'creditLimit', adminOnly: true },
	{ id: 'creditLimit200', label: '<= $200', type: 'checkbox', group: 'creditLimit', adminOnly: true },
	{ id: 'creditCheckInfo', label: 'Credit check info', inputType: 'textarea', adminOnly: true },
	{ id: 'applicationNumber', label: 'Application number', inputType: 'text', adminOnly: true },
	{ id: 'vendorRegistrationId', label: 'Vendor registration ID', inputType: 'text', adminOnly: true },
	{ id: 'assessmentNoConflict', label: 'No conflict', type: 'checkbox', group: 'adminConflictAssessment', adminOnly: true },
	{ id: 'assessmentConflict', label: 'Conflict', type: 'checkbox', group: 'adminConflictAssessment', adminOnly: true },
	{ id: 'conflictAssessmentNotes', label: 'Conflict assessment notes', inputType: 'textarea', adminOnly: true },
	{ id: 'processedOn', label: 'Processed on', inputType: 'date', adminOnly: true },
	{ id: 'salesRepresentativeName', label: 'Sales representative name', inputType: 'text', adminOnly: true },
]

export const FORM_FIELDS = [
	{ id: 'tradingAs', page: 1, type: 'text', label: 'Trading as', top: 586, left: 282, width: 343, height: 31, fontSize: 13 },
	{ id: 'registrationIdentificationNumber', page: 1, type: 'text', label: 'Registration / Identification No', top: 586, left: 818, width: 255, height: 31, fontSize: 13 },
	{ id: 'citizenship', page: 1, type: 'text', label: 'Citizenship', top: 623, left: 818, width: 255, height: 31, fontSize: 13 },
	{ id: 'contactName', page: 1, type: 'text', label: 'Contact name', top: 629, left: 344, width: 281, height: 31, fontSize: 13 },
	{ id: 'tinNumber', page: 1, type: 'text', label: 'TIN / VAT number', top: 657, left: 818, width: 255, height: 31, fontSize: 13 },
	{ id: 'contactSurname', page: 1, type: 'text', label: 'Contact surname', top: 667, left: 344, width: 281, height: 31, fontSize: 13 },
	{ id: 'dateOfBirth', page: 1, type: 'text', label: 'Date of birth', top: 705, left: 344, width: 281, height: 31, fontSize: 13 },
	{ id: 'genderFemale', page: 1, type: 'checkbox', label: 'Female', top: 667, left: 878, width: 25, height: 30, group: 'gender' },
	{ id: 'genderMale', page: 1, type: 'checkbox', label: 'Male', top: 667, left: 996, width: 25, height: 30, group: 'gender' },
	{ id: 'creditCheckConsentYes', page: 1, type: 'checkbox', label: 'Credit check yes', top: 704, left: 878, width: 25, height: 30, group: 'creditCheckConsent' },
	{ id: 'creditCheckConsentNo', page: 1, type: 'checkbox', label: 'Credit check no', top: 704, left: 996, width: 25, height: 30, group: 'creditCheckConsent' },
	{ id: 'telephoneWork', page: 1, type: 'text', label: 'Telephone number work', top: 810, left: 329, width: 278, height: 31, fontSize: 13 },
	{ id: 'email', page: 1, type: 'text', label: 'Email', top: 810, left: 790, width: 281, height: 31, fontSize: 13 },
	{ id: 'telephoneCell', page: 1, type: 'text', label: 'Telephone number cell', top: 847, left: 329, width: 278, height: 31, fontSize: 13 },
	{ id: 'email2', page: 1, type: 'text', label: 'Email 2', top: 847, left: 790, width: 281, height: 31, fontSize: 13 },
	{ id: 'physicalAddressLine1', page: 1, type: 'text', label: 'Physical address line 1', top: 885, left: 191, width: 417, height: 31, fontSize: 13 },
	{ id: 'postalAddressLine1', page: 1, type: 'text', label: 'Postal address line 1', top: 885, left: 657, width: 414, height: 31, fontSize: 13 },
	{ id: 'physicalAddressLine2', page: 1, type: 'text', label: 'Physical address line 2', top: 922, left: 191, width: 417, height: 31, fontSize: 13 },
	{ id: 'postalAddressLine2', page: 1, type: 'text', label: 'Postal address line 2', top: 922, left: 657, width: 414, height: 31, fontSize: 13 },
	{ id: 'physicalAddressLine3', page: 1, type: 'text', label: 'Physical address line 3', top: 959, left: 191, width: 417, height: 31, fontSize: 13 },
	{ id: 'postalAddressLine3', page: 1, type: 'text', label: 'Postal address line 3', top: 959, left: 657, width: 414, height: 31, fontSize: 13 },
	{ id: 'customerNumber', page: 1, type: 'text', label: 'Customer number', top: 1011, left: 329, width: 278, height: 31, fontSize: 13 },
	{ id: 'authorityToTransact', page: 1, type: 'text', label: 'Authority to transact', top: 1011, left: 793, width: 278, height: 31, fontSize: 13 },
	{ id: 'designationCapacity', page: 1, type: 'text', label: 'Designation / capacity', top: 1048, left: 793, width: 278, height: 31, fontSize: 13 },
	{ id: 'salesChannelAgency', page: 1, type: 'checkbox', label: 'Agency', top: 1117, left: 191, width: 26, height: 31 },
	{ id: 'salesChannelRetailer', page: 1, type: 'checkbox', label: 'Retailer', top: 1114, left: 409, width: 26, height: 31 },
	{ id: 'salesChannelDealer', page: 1, type: 'checkbox', label: 'Dealer', top: 1150, left: 409, width: 26, height: 31 },
	{ id: 'salesChannelMegaDealer', page: 1, type: 'checkbox', label: 'Mega dealer', top: 1186, left: 409, width: 26, height: 31 },
	{ id: 'salesChannelMomsAndPops', page: 1, type: 'checkbox', label: 'Moms and Pops', top: 1114, left: 648, width: 26, height: 31 },
	{ id: 'salesChannelDSF', page: 1, type: 'checkbox', label: 'DSF', top: 1150, left: 648, width: 26, height: 31 },
	{ id: 'salesChannelOther', page: 1, type: 'checkbox', label: 'Other', top: 1186, left: 648, width: 26, height: 31 },
	{ id: 'salesChannelOtherText', page: 1, type: 'text', label: 'Other sales channel', top: 1187, left: 734, width: 193, height: 25, fontSize: 12 },
	{ id: 'salesChannelInstaller', page: 1, type: 'checkbox', label: 'Installer', top: 1114, left: 879, width: 26, height: 31 },
	{ id: 'responsibilityCollectSubscription', page: 1, type: 'checkbox', label: 'Collect subscription', top: 1276, left: 191, width: 26, height: 31 },
	{ id: 'responsibilityUpgradesDowngrades', page: 1, type: 'checkbox', label: 'Upgrades / downgrades', top: 1312, left: 191, width: 26, height: 31 },
	{ id: 'responsibilityCreateUpdateRecords', page: 1, type: 'checkbox', label: 'Create / update records', top: 1276, left: 417, width: 26, height: 31 },
	{ id: 'responsibilityActivateSubscribers', page: 1, type: 'checkbox', label: 'Activate subscribers', top: 1312, left: 417, width: 26, height: 31 },
	{ id: 'responsibilitySaleOfEquipment', page: 1, type: 'checkbox', label: 'Sale of equipment', top: 1276, left: 656, width: 26, height: 31 },
	{ id: 'responsibilityInstallations', page: 1, type: 'checkbox', label: 'Installations', top: 1312, left: 656, width: 26, height: 31 },
	{ id: 'responsibilitySwappingRepair', page: 1, type: 'checkbox', label: 'Swapping / repair', top: 1276, left: 892, width: 26, height: 31 },
	{ id: 'responsibilityMarketing', page: 1, type: 'checkbox', label: 'Marketing', top: 1312, left: 892, width: 26, height: 31 },
	{ id: 'declarationNoConflict', page: 1, type: 'checkbox', label: 'No conflict declared', top: 1417, left: 193, width: 26, height: 31, group: 'conflictDeclaration' },
	{ id: 'declarationHasConflict', page: 1, type: 'checkbox', label: 'Conflict declared', top: 1483, left: 193, width: 26, height: 31, group: 'conflictDeclaration' },
	{ id: 'natureOfInterest', page: 1, type: 'text', label: 'Nature of interest', top: 1507, left: 423, width: 604, height: 24, fontSize: 12 },
	{ id: 'authorizedRepresentative', page: 1, type: 'text', label: 'Authorized representative', top: 1569, left: 213, width: 196, height: 31, fontSize: 13 },
	{ id: 'authorizedCapacity', page: 1, type: 'text', label: 'Authorized capacity', top: 1569, left: 418, width: 197, height: 31, fontSize: 13 },
	{ id: 'signedAt', page: 1, type: 'text', label: 'Signed at', top: 1623, left: 261, width: 196, height: 31, fontSize: 13 },
	{ id: 'signedDay', page: 1, type: 'text', label: 'Signed day', top: 1623, left: 523, width: 161, height: 31, fontSize: 13 },
	{ id: 'signedMonth', page: 1, type: 'text', label: 'Signed month', top: 1623, left: 723, width: 344, height: 31, fontSize: 13 },
	{ id: 'signature', page: 1, type: 'text', label: 'Signature', top: 1665, left: 262, width: 208, height: 40, fontSize: 13 },
	{ id: 'witness1', page: 1, type: 'text', label: 'Witness 1', top: 1665, left: 553, width: 202, height: 40, fontSize: 13 },
	{ id: 'witness2', page: 1, type: 'text', label: 'Witness 2', top: 1665, left: 816, width: 238, height: 40, fontSize: 13 },
	{ id: 'processedOn', page: 2, type: 'text', label: 'Processed on', top: 287, left: 267, width: 221, height: 31, fontSize: 13, adminOnly: true },
	{ id: 'salesRepresentativeName', page: 2, type: 'text', label: 'Sales representative name', top: 287, left: 695, width: 332, height: 31, fontSize: 13, adminOnly: true },
]

const ALL_FIELD_DEFINITIONS = [...FORM_FIELDS, ...ADMIN_REVIEW_FIELDS]

export const FIELD_MAP = Object.fromEntries(ALL_FIELD_DEFINITIONS.map((field) => [field.id, field]))

export const CHECKBOX_GROUPS = ALL_FIELD_DEFINITIONS.reduce((groups, field) => {
	if (!field.group) {
		return groups
	}

	groups[field.group] = [...(groups[field.group] ?? []), field.id]
	return groups
}, {})

export const FORM_FIELDS_BY_PAGE = FORM_FIELDS.reduce((pages, field) => {
	pages[field.page] = [...(pages[field.page] ?? []), field]
	return pages
}, {})

export const PREVIEW_FIELDS = [
	'zoneName',
	'regionName',
	'districtName',
	'tradingAs',
	'registrationIdentificationNumber',
	'contactName',
	'contactSurname',
	'tinNumber',
	'telephoneWork',
	'email',
	'authorityToTransact',
	'designationCapacity',
	'signedAt',
]

export function createInitialFormData() {
	const initialData = ALL_FIELD_DEFINITIONS.reduce((accumulator, field) => {
		accumulator[field.id] = field.type === 'checkbox' ? false : ''
		return accumulator
	}, {})

	return {
		...initialData,
		signedYear: '',
		zoneId: '',
		zoneName: '',
		regionId: '',
		regionName: '',
		districtId: '',
		districtName: '',
	}
}
