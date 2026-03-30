import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

const PUBLIC_ORIGIN = typeof window !== 'undefined' ? window.location.origin : ''
const HEADER_IMAGE_SRC = `${PUBLIC_ORIGIN}/Header.png`
const FOOTER_IMAGE_SRC = `${PUBLIC_ORIGIN}/footer.png`

const styles = StyleSheet.create({
	page: {
		paddingTop: 22,
		paddingHorizontal: 28,
		paddingBottom: 56,
		fontFamily: 'Helvetica',
		fontSize: 9,
		color: '#0f172a',
		backgroundColor: '#ffffff',
	},
	header: {
		marginBottom: 18,
		paddingBottom: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#cbd5e1',
		alignItems: 'center',
	},
	headerImage: {
		width: 180,
		height: 64,
		objectFit: 'contain',
		marginBottom: 10,
	},
	title: {
		fontSize: 15,
		fontFamily: 'Helvetica-Bold',
		marginBottom: 4,
		color: '#0b4ea2',
		textAlign: 'center',
	},
	subtitle: {
		fontSize: 10,
		fontFamily: 'Helvetica-Bold',
		color: '#111827',
		textAlign: 'center',
	},
	intro: {
		marginBottom: 14,
		paddingHorizontal: 6,
	},
	introText: {
		fontSize: 8.5,
		fontFamily: 'Helvetica-Bold',
		color: '#475569',
		marginBottom: 5,
		lineHeight: 1.4,
	},
	section: {
		marginBottom: 12,
		borderWidth: 1,
		borderColor: '#cbd5e1',
		borderRadius: 8,
		padding: 10,
	},
	sectionTitle: {
		fontSize: 10,
		fontFamily: 'Helvetica-Bold',
		marginBottom: 8,
		color: '#1e3a8a',
		textTransform: 'uppercase',
	},
	grid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		columnGap: 8,
		rowGap: 8,
	},
	fieldHalf: {
		width: '48.5%',
	},
	fieldFull: {
		width: '100%',
	},
	label: {
		fontSize: 8,
		fontFamily: 'Helvetica-Bold',
		marginBottom: 2,
		color: '#334155',
	},
	valueBox: {
		minHeight: 24,
		paddingHorizontal: 7,
		paddingVertical: 5,
		borderWidth: 1,
		borderColor: '#93c5fd',
		borderRadius: 5,
		backgroundColor: '#f8fafc',
		justifyContent: 'center',
	},
	valueText: {
		fontSize: 9,
		fontFamily: 'Helvetica-Bold',
	},
	valueMuted: {
		fontSize: 9,
		color: '#64748b',
	},
	choiceRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		rowGap: 6,
		columnGap: 10,
	},
	choiceItem: {
		flexDirection: 'row',
		alignItems: 'center',
		width: '48%',
	},
	choiceTick: {
		width: 12,
		height: 12,
		marginRight: 6,
		borderWidth: 1,
		borderColor: '#64748b',
		borderRadius: 2,
		textAlign: 'center',
		fontSize: 9,
		fontFamily: 'Helvetica-Bold',
		lineHeight: 1.1,
	},
	choiceLabel: {
		fontSize: 9,
	},
	footer: {
		position: 'absolute',
		bottom: 14,
		left: 28,
		right: 28,
		paddingTop: 6,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
	},
	footerImage: {
		width: '100%',
		height: 18,
		objectFit: 'contain',
	},
	footerMeta: {
		marginTop: 4,
		flexDirection: 'row',
		justifyContent: 'space-between',
		fontSize: 8,
		color: '#64748b',
	},
	signatureWrap: {
		marginTop: 8,
	},
	signatureBox: {
		width: 150,
		height: 54,
		borderWidth: 1,
		borderColor: '#93c5fd',
		borderRadius: 5,
		backgroundColor: '#ffffff',
		padding: 4,
		justifyContent: 'center',
	},
	signatureImage: {
		width: '100%',
		height: '100%',
		objectFit: 'contain',
	},
	bulletList: {
		rowGap: 4,
	},
	bulletItem: {
		fontSize: 9,
	},
	statusBanner: {
		marginBottom: 12,
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#bbf7d0',
		backgroundColor: '#f0fdf4',
	},
	statusBannerRejected: {
		borderColor: '#fecdd3',
		backgroundColor: '#fff1f2',
	},
	statusBannerTitle: {
		fontSize: 10,
		fontFamily: 'Helvetica-Bold',
		color: '#166534',
		marginBottom: 2,
	},
	statusBannerTitleRejected: {
		color: '#be123c',
	},
	statusBannerText: {
		fontSize: 8.5,
		color: '#166534',
	},
	statusBannerTextRejected: {
		color: '#9f1239',
	},
})

function valueOrFallback(value) {
	const text = String(value ?? '').trim()
	return text || 'Not provided'
}

function combineAddress(values) {
	return values.filter(Boolean).join(', ')
}

function getGender(formData) {
	if (formData.genderFemale) {
		return 'Female'
	}

	if (formData.genderMale) {
		return 'Male'
	}

	return ''
}

function getCreditConsent(formData) {
	if (formData.creditCheckConsentYes) {
		return 'Yes'
	}

	if (formData.creditCheckConsentNo) {
		return 'No'
	}

	return ''
}

function getConflictDeclaration(formData) {
	if (formData.declarationNoConflict) {
		return 'No conflict declared'
	}

	if (formData.declarationHasConflict) {
		return 'Conflict declared'
	}

	return ''
}

function getAdminCreditLimit(formData) {
	if (formData.creditLimit100) {
		return '<= $100'
	}

	if (formData.creditLimit150) {
		return '<= $150'
	}

	if (formData.creditLimit200) {
		return '<= $200'
	}

	return ''
}

function getAdminConflictAssessment(formData) {
	if (formData.assessmentNoConflict) {
		return 'No conflict'
	}

	if (formData.assessmentConflict) {
		return 'Conflict identified'
	}

	return ''
}

function getStatusSummary(application, formData) {
	if (application.status === 'APPROVED') {
		return {
			title: 'Admin approval recorded',
			text: `Approved on ${valueOrFallback(formData.processedOn)} by ${valueOrFallback(formData.salesRepresentativeName)}.`,
			rejected: false,
		}
	}

	if (application.status === 'REJECTED') {
		return {
			title: 'Admin decision recorded',
			text: `Declined on ${valueOrFallback(formData.processedOn)} by ${valueOrFallback(formData.salesRepresentativeName)}.`,
			rejected: true,
		}
	}

	return {
		title: 'Awaiting admin decision',
		text: 'This application has been submitted and is pending internal review.',
		rejected: false,
	}
}

function selectedItems(formData, options) {
	return options.filter((option) => Boolean(formData[option.id])).map((option) => option.label)
}

function Field({ label, value, fullWidth = false }) {
	const text = valueOrFallback(value)
	const isEmpty = text === 'Not provided'

	return (
		<View style={fullWidth ? styles.fieldFull : styles.fieldHalf}>
			<Text style={styles.label}>{label}</Text>
			<View style={styles.valueBox}>
				<Text style={isEmpty ? styles.valueMuted : styles.valueText}>{text}</Text>
			</View>
		</View>
	)
}

function ChoiceGroup({ title, selected }) {
	return (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>{title}</Text>
			{selected.length ? (
				<View style={styles.choiceRow}>
					{selected.map((item) => (
						<View key={item} style={styles.choiceItem}>
							<Text style={styles.choiceTick}>X</Text>
							<Text style={styles.choiceLabel}>{item}</Text>
						</View>
					))}
				</View>
			) : (
				<Text style={styles.valueMuted}>No option selected</Text>
			)}
		</View>
	)
}

function SignatureSection({ formData }) {
	return (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>Signing details</Text>
			<View style={styles.grid}>
				<Field label="Authority to transact" value={formData.authorityToTransact} />
				<Field label="Designation / capacity" value={formData.designationCapacity} />
				<Field label="Authorized representative" value={formData.authorizedRepresentative} />
				<Field label="Authorized capacity" value={formData.authorizedCapacity} />
				<Field label="Signed at" value={formData.signedAt} />
				<Field label="Signed on" value={[formData.signedDay, formData.signedMonth, formData.signedYear].filter(Boolean).join(' ')} />
				<Field label="Witness 1" value={formData.witness1} />
				<Field label="Witness 2" value={formData.witness2} />
			</View>
			<View style={styles.signatureWrap}>
				<Text style={styles.label}>Signature</Text>
				<View style={styles.signatureBox}>
					{String(formData.signature ?? '').startsWith('data:image/') ? (
						<Image src={formData.signature} style={styles.signatureImage} />
					) : (
						<Text style={styles.valueMuted}>No signature captured</Text>
					)}
				</View>
			</View>
		</View>
	)
}

function ApplicationPdfDocument({ application }) {
	const formData = application.formData ?? {}
	const statusSummary = getStatusSummary(application, formData)
	const salesChannels = selectedItems(formData, [
		{ id: 'salesChannelAgency', label: 'Agency' },
		{ id: 'salesChannelRetailer', label: 'Retailer' },
		{ id: 'salesChannelDealer', label: 'Dealer' },
		{ id: 'salesChannelMegaDealer', label: 'Mega Dealer' },
		{ id: 'salesChannelMomsAndPops', label: 'Moms & Pops' },
		{ id: 'salesChannelDSF', label: 'DSF' },
		{ id: 'salesChannelInstaller', label: 'Installer' },
		{ id: 'salesChannelOther', label: formData.salesChannelOtherText ? `Other: ${formData.salesChannelOtherText}` : 'Other' },
	])
	const responsibilities = selectedItems(formData, [
		{ id: 'responsibilityCollectSubscription', label: 'Collect Subscription' },
		{ id: 'responsibilityUpgradesDowngrades', label: 'Upgrades / Downgrades' },
		{ id: 'responsibilityCreateUpdateRecords', label: 'Create / Update Records' },
		{ id: 'responsibilityActivateSubscribers', label: 'Activate Subscribers' },
		{ id: 'responsibilitySaleOfEquipment', label: 'Sale of Equipment' },
		{ id: 'responsibilityInstallations', label: 'Installations' },
		{ id: 'responsibilitySwappingRepair', label: 'Swapping / Repair' },
		{ id: 'responsibilityMarketing', label: 'Marketing' },
	])

	return (
		<Document>
			<Page size="A4" style={styles.page}>
				<View style={styles.header}>
					<Image src={HEADER_IMAGE_SRC} style={styles.headerImage} />
					<Text style={styles.title}>Annexure A: MultiChoice SCP Application Form</Text>
					<Text style={styles.subtitle}>(RoA-GRP-SAL-TMP-001)</Text>
				</View>

				<View style={[styles.statusBanner, statusSummary.rejected ? styles.statusBannerRejected : null]}>
					<Text style={[styles.statusBannerTitle, statusSummary.rejected ? styles.statusBannerTitleRejected : null]}>
						{statusSummary.title}
					</Text>
					<Text style={[styles.statusBannerText, statusSummary.rejected ? styles.statusBannerTextRejected : null]}>
						{statusSummary.text}
					</Text>
				</View>

				<View style={styles.intro}>
					<Text style={styles.introText}>
						This is an application form reflecting your interest to act as a sales channel partner for MultiChoice. By completing this form you confirm that you understand the nature of a sales channel partner and that you have provided the information required for MultiChoice to validate and process your application.
					</Text>
					<Text style={styles.introText}>
						For the avoidance of doubt, this form is an application only and remains subject to approval by MultiChoice. You may not act as a sales channel partner without written confirmation from MultiChoice.
					</Text>
					<Text style={styles.introText}>
						If your application is approved your relationship with MultiChoice will be governed by the terms and conditions issued by MultiChoice from time to time.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Business details</Text>
					<View style={styles.grid}>
						<Field label="Trading as" value={formData.tradingAs} />
						<Field label="Registration / Identification No" value={formData.registrationIdentificationNumber} />
						<Field label="Citizenship" value={formData.citizenship} />
						<Field label="TIN / VAT No" value={formData.tinNumber} />
						<Field label="Contact name" value={formData.contactName} />
						<Field label="Contact surname" value={formData.contactSurname} />
						<Field label="Date of birth" value={formData.dateOfBirth} />
						<Field label="Gender" value={getGender(formData)} />
						<Field label="Credit check consent" value={getCreditConsent(formData)} />
						<Field label="Customer No" value={formData.customerNumber} />
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Business representative and location</Text>
					<View style={styles.grid}>
						<Field label="Telephone (work)" value={formData.telephoneWork} />
						<Field label="Telephone (cell)" value={formData.telephoneCell} />
						<Field label="Email" value={formData.email} />
						<Field label="Email 2" value={formData.email2} />
						<Field label="Zone" value={formData.zoneName} />
						<Field label="Region" value={formData.regionName} />
						<Field label="District" value={formData.districtName} />
						<Field label="Location summary" value={application.locationSummary} />
						<Field
							label="Physical address"
							value={combineAddress([formData.physicalAddressLine1, formData.physicalAddressLine2, formData.physicalAddressLine3])}
							fullWidth
						/>
						<Field
							label="Postal address"
							value={combineAddress([formData.postalAddressLine1, formData.postalAddressLine2, formData.postalAddressLine3])}
							fullWidth
						/>
					</View>
				</View>

				<ChoiceGroup title="Sales channels" selected={salesChannels} />
				<ChoiceGroup title="Sales channel responsibilities" selected={responsibilities} />

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Declaration</Text>
					<View style={styles.grid}>
						<Field label="Declaration status" value={getConflictDeclaration(formData)} />
						<Field label="Nature of interest" value={formData.natureOfInterest} fullWidth />
					</View>
				</View>

				<SignatureSection formData={formData} />

				<View style={styles.footer} fixed>
					<View style={{ width: '100%' }}>
						<Image src={FOOTER_IMAGE_SRC} style={styles.footerImage} />
						<View style={styles.footerMeta}>
							<Text>{application.applicant_email || 'Application'}</Text>
							<Text render={({ pageNumber }) => `Page ${pageNumber}`} />
						</View>
					</View>
				</View>
			</Page>

			<Page size="A4" style={styles.page}>
				<View style={styles.header}>
					<Image src={HEADER_IMAGE_SRC} style={styles.headerImage} />
					<Text style={styles.title}>Internal Review Page</Text>
					<Text style={styles.subtitle}>Admin review and processing details</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Stockhandler information</Text>
					<View style={styles.grid}>
						<Field label="Stockhandler name" value={formData.stockHandlerName} />
						<Field label="Stockhandler ID" value={formData.stockHandlerId} />
						<Field label="Application number" value={formData.applicationNumber} />
						<Field label="Vendor registration ID" value={formData.vendorRegistrationId} />
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Credit information</Text>
					<View style={styles.grid}>
						<Field label="Credit limit" value={getAdminCreditLimit(formData)} />
						<Field label="Credit check info" value={formData.creditCheckInfo} fullWidth />
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Application status</Text>
					<View style={styles.grid}>
						<Field label="Approval outcome" value={application.status} />
						<Field label="Applicant email" value={application.applicant_email} />
						<Field label="Submitted on" value={application.created_at ? new Date(application.created_at).toLocaleDateString() : ''} />
						<Field label="Processed on" value={formData.processedOn} />
						<Field label="Sales representative name" value={formData.salesRepresentativeName} fullWidth />
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Assessment of potential conflict of interest</Text>
					<View style={styles.grid}>
						<Field label="Assessment result" value={getAdminConflictAssessment(formData)} />
						<Field label="Reasons and steps taken" value={formData.conflictAssessmentNotes} fullWidth />
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Review summary</Text>
					<View style={styles.bulletList}>
						<Text style={styles.bulletItem}>Applicant: {valueOrFallback(formData.contactName)} {valueOrFallback(formData.contactSurname)}</Text>
						<Text style={styles.bulletItem}>Business: {valueOrFallback(formData.tradingAs)}</Text>
						<Text style={styles.bulletItem}>Location: {valueOrFallback(application.locationSummary)}</Text>
						<Text style={styles.bulletItem}>Required documents are appended after this form when available.</Text>
					</View>
				</View>

				<View style={styles.footer} fixed>
					<View style={{ width: '100%' }}>
						<Image src={FOOTER_IMAGE_SRC} style={styles.footerImage} />
						<View style={styles.footerMeta}>
							<Text>Internal use</Text>
							<Text render={({ pageNumber }) => `Page ${pageNumber}`} />
						</View>
					</View>
				</View>
			</Page>
		</Document>
	)
}

export default ApplicationPdfDocument