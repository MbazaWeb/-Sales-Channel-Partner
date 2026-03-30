import { requireSupabase } from './supabaseClient.js'

const applicationSelect = `
	id,
	user_id,
	applicant_email,
	status,
	tin_number,
	registration_identification_number,
	zone_name,
	region_name,
	district_name,
	location_summary,
	physical_address,
	postal_address,
	form_data,
	created_at,
	updated_at,
	documents:application_documents (
		id,
		document_key,
		file_name,
		file_path,
		mime_type,
		file_size,
		created_at
	)
`

function normalizeApplication(application) {
	return {
		...application,
		formData: application.form_data ?? {},
		tinNumber: application.tin_number,
		registrationIdentificationNumber: application.registration_identification_number,
		zoneName: application.zone_name,
		regionName: application.region_name,
		districtName: application.district_name,
		locationSummary: application.location_summary,
		physicalAddress: application.physical_address,
		postalAddress: application.postal_address,
	}
}

export async function createApplication({ userId, applicantEmail, formData }) {
	const client = requireSupabase()
	const payload = {
		user_id: userId,
		applicant_email: applicantEmail,
		tin_number: formData.tinNumber,
		registration_identification_number: formData.registrationIdentificationNumber,
		zone_name: formData.zoneName,
		region_name: formData.regionName,
		district_name: formData.districtName,
		location_summary: [formData.zoneName, formData.regionName, formData.districtName].filter(Boolean).join(' / '),
		physical_address: [formData.physicalAddressLine1, formData.physicalAddressLine2, formData.physicalAddressLine3]
			.filter(Boolean)
			.join(', '),
		postal_address: [formData.postalAddressLine1, formData.postalAddressLine2, formData.postalAddressLine3]
			.filter(Boolean)
			.join(', '),
		form_data: formData,
	}

	const { data, error } = await client
		.from('applications')
		.insert(payload)
		.select(applicationSelect)
		.single()

	if (error) {
		throw error
	}

	return normalizeApplication(data)
}

export async function getUserApplications(userId) {
	const client = requireSupabase()
	const { data, error } = await client
		.from('applications')
		.select(applicationSelect)
		.eq('user_id', userId)
		.order('created_at', { ascending: false })

	if (error) {
		throw error
	}

	return data.map(normalizeApplication)
}

export async function getAllApplications() {
	const client = requireSupabase()
	const { data, error } = await client
		.from('applications')
		.select(applicationSelect)
		.order('created_at', { ascending: false })

	if (error) {
		throw error
	}

	return data.map(normalizeApplication)
}

export async function updateStatus(applicationId, status) {
	const client = requireSupabase()
	const { data, error } = await client
		.from('applications')
		.update({ status })
		.eq('id', applicationId)
		.select(applicationSelect)
		.single()

	if (error) {
		throw error
	}

	return normalizeApplication(data)
}

export async function updateApplicationFormData(applicationId, formData) {
	const client = requireSupabase()
	const { data, error } = await client
		.from('applications')
		.update({ form_data: formData })
		.eq('id', applicationId)
		.select(applicationSelect)
		.single()

	if (error) {
		throw error
	}

	return normalizeApplication(data)
}

export async function deleteApplication(applicationId) {
	const client = requireSupabase()
	const { error } = await client.from('applications').delete().eq('id', applicationId)

	if (error) {
		throw error
	}
}
