import { useEffect, useRef, useState } from 'react'
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist/build/pdf.mjs'
import { PDF_TEMPLATE_PATH } from '../../utils/constants.js'

GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

let pdfDocumentPromise

function loadPdfDocument() {
	if (!pdfDocumentPromise) {
		pdfDocumentPromise = getDocument(PDF_TEMPLATE_PATH).promise
	}

	return pdfDocumentPromise
}

function PDFBackground({ pageNumber }) {
	const canvasRef = useRef(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		let isMounted = true
		let renderTask = null

		async function renderPage() {
			try {
				setLoading(true)
				setError('')
				const pdf = await loadPdfDocument()
				const page = await pdf.getPage(pageNumber)
				const canvas = canvasRef.current

				if (!canvas || !isMounted) {
					return
				}

				const viewport = page.getViewport({ scale: 2 })
				const context = canvas.getContext('2d')

				canvas.width = viewport.width
				canvas.height = viewport.height

				renderTask = page.render({
					canvasContext: context,
					viewport,
				})

				await renderTask.promise

				if (isMounted) {
					setLoading(false)
				}
			} catch (renderError) {
				if (renderError?.name === 'RenderingCancelledException') {
					return
				}

				if (isMounted) {
					setError(renderError.message)
					setLoading(false)
				}
			}
		}

		renderPage()

		return () => {
			isMounted = false
			renderTask?.cancel()
		}
	}, [pageNumber])

	return (
		<>
			<canvas ref={canvasRef} className="pdf-page-canvas" />
			{loading ? <div className="pdf-page-loading">Rendering page {pageNumber}...</div> : null}
			{error ? <div className="pdf-page-loading">{error}</div> : null}
		</>
	)
}

export default PDFBackground
