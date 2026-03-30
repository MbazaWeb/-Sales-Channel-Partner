import { STORAGE_BUCKET } from '../utils/constants.js'
import { requireSupabase } from './supabaseClient.js'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf']

function sanitizeFileName(fileName) {
	return fileName.toLowerCase().replace(/[^a-z0-9.\-_]+/g, '-')
}

export function validateFile(file) {
	if (!file) {
		throw new Error('No file selected.')
	}

	if (file.size > MAX_FILE_SIZE) {
		throw new Error('Files must be 5MB or smaller.')
	}

	if (!ALLOWED_MIME_TYPES.includes(file.type)) {
		throw new Error('Only JPG, PNG, and PDF files are allowed.')
	}
}

export async function uploadApplicationFile(applicationId, file, documentKey) {
	validateFile(file)

	const client = requireSupabase()
	const filePath = `applications/${applicationId}/${documentKey}-${Date.now()}-${sanitizeFileName(file.name)}`

	const { error: uploadError } = await client.storage.from(STORAGE_BUCKET).upload(filePath, file, {
		cacheControl: '3600',
		upsert: false,
	})

	if (uploadError) {
		throw uploadError
	}

	const { data, error } = await client
		.from('application_documents')
		.insert({
			application_id: applicationId,
			document_key: documentKey,
			file_name: file.name,
			file_path: filePath,
			mime_type: file.type,
			file_size: file.size,
		})
		.select('*')
		.single()

	if (error) {
		throw error
	}

	return data
}

export async function getApplicationFiles(applicationId) {
	const client = requireSupabase()
	const { data, error } = await client
		.from('application_documents')
		.select('*')
		.eq('application_id', applicationId)
		.order('created_at', { ascending: true })

	if (error) {
		throw error
	}

	return data
}

export async function getSignedFileUrl(filePath, expiresIn = 3600) {
	const client = requireSupabase()
	const { data, error } = await client.storage.from(STORAGE_BUCKET).createSignedUrl(filePath, expiresIn)

	if (error) {
		throw error
	}

	return data.signedUrl
}

export async function getApplicationFilesWithUrls(applicationId) {
	const documents = await getApplicationFiles(applicationId)

	return Promise.all(
		documents.map(async (document) => ({
			...document,
			signedUrl: await getSignedFileUrl(document.file_path),
		})),
	)
}
