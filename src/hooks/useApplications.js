import { useCallback, useEffect, useState } from 'react'
import {
	getAllApplications,
	getUserApplications,
	updateApplicationFormData,
	updateStatus,
} from '../services/applicationService.js'
import { useAuth } from './useAuth.js'

export function useApplications() {
	const { user, role, isConfigured } = useAuth()
	const [applications, setApplications] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	const refreshApplications = useCallback(async () => {
		if (!isConfigured || !user) {
			setApplications([])
			setLoading(false)
			return
		}

		setLoading(true)
		setError('')

		try {
			const nextApplications = role === 'ADMIN' ? await getAllApplications() : await getUserApplications(user.id)
			setApplications(nextApplications)
		} catch (refreshError) {
			setError(refreshError.message)
		} finally {
			setLoading(false)
		}
	}, [isConfigured, role, user])

	async function changeStatus(applicationId, status) {
		const updated = await updateStatus(applicationId, status)
		setApplications((currentApplications) =>
			currentApplications.map((application) =>
				application.id === applicationId ? updated : application,
			),
		)
		return updated
	}

	async function saveFormData(applicationId, formData) {
		const updated = await updateApplicationFormData(applicationId, formData)
		setApplications((currentApplications) =>
			currentApplications.map((application) =>
				application.id === applicationId ? updated : application,
			),
		)
		return updated
	}

	useEffect(() => {
		refreshApplications()
	}, [refreshApplications])

	return {
		applications,
		loading,
		error,
		refreshApplications,
		changeStatus,
		saveFormData,
	}
}
