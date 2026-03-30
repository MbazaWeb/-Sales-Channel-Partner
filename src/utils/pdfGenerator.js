import { createElement } from 'react'
import { pdf } from '@react-pdf/renderer'
import { PDFDocument } from 'pdf-lib'
import ApplicationPdfDocument from '../components/pdf/ApplicationPdfDocument.jsx'
import { FIELD_MAP, PREVIEW_FIELD_LABELS } from './constants.js'

async function getDocumentBytes(document) {
	if (typeof document?.arrayBuffer === 'function') {
		return document.arrayBuffer()
	}

	if (typeof document?.file?.arrayBuffer === 'function') {
		return document.file.arrayBuffer()
	}

	if (document?.signedUrl) {
		const response = await fetch(document.signedUrl)

		if (!response.ok) {
			throw new Error(`Failed to fetch ${document.signedUrl}`)
		}

		return response.arrayBuffer()
	}

	throw new Error('Unable to load document for PDF generation.')
}

async function appendDocumentPage(pdfDoc, document) {
	const fileBytes = await getDocumentBytes(document)
	const mimeType = document.mime_type ?? document.type ?? document.file?.type

	if (mimeType === 'application/pdf') {
		const sourcePdf = await PDFDocument.load(fileBytes)
		const pages = await pdfDoc.copyPages(sourcePdf, sourcePdf.getPageIndices())
		pages.forEach((page) => pdfDoc.addPage(page))
		return
	}

	const page = pdfDoc.addPage()
	const image = mimeType === 'image/png'
		? await pdfDoc.embedPng(fileBytes)
		: await pdfDoc.embedJpg(fileBytes)
	const { width, height } = image.scale(1)
	const pageWidth = page.getWidth()
	const pageHeight = page.getHeight()
	const scale = Math.min((pageWidth - 48) / width, (pageHeight - 48) / height)
	const scaledWidth = width * scale
	const scaledHeight = height * scale

	page.drawImage(image, {
		x: (pageWidth - scaledWidth) / 2,
		y: (pageHeight - scaledHeight) / 2,
		width: scaledWidth,
		height: scaledHeight,
	})
}

export async function generateApplicationPdf(application, documents = []) {
	const baseBlob = await pdf(createElement(ApplicationPdfDocument, { application })).toBlob()

	if (!documents.length) {
		return baseBlob
	}

	const pdfDoc = await PDFDocument.load(await baseBlob.arrayBuffer())

	for (const document of documents) {
		await appendDocumentPage(pdfDoc, document)
	}

	const pdfBytes = await pdfDoc.save()
	return new Blob([pdfBytes], { type: 'application/pdf' })
}

export async function downloadApplicationPdf(application, documents = []) {
	const blob = await generateApplicationPdf(application, documents)
	const objectUrl = URL.createObjectURL(blob)
	const anchor = document.createElement('a')
	anchor.href = objectUrl
	anchor.download = `scp-application-${application.id}.pdf`
	anchor.click()
	URL.revokeObjectURL(objectUrl)
}

export function getFieldDisplayValue(formData, fieldId) {
	const field = FIELD_MAP[fieldId]
	const value = formData?.[fieldId]

	if (!field) {
		return String(value ?? '').trim() || 'Not provided'
	}

	if (field.type === 'checkbox') {
		return value ? 'Selected' : 'Not selected'
	}

	return String(value ?? '').trim() || 'Not provided'
}

export function getFieldDisplayLabel(fieldId) {
	return PREVIEW_FIELD_LABELS[fieldId] ?? fieldId
}
