import { requireSupabase } from './supabaseClient.js'
import { isReservedAdminEmail } from '../config/roles.js'

function normalizeAuthError(error) {
	if (!error) {
		return null
	}

	if (error.message === 'Auth session missing!') {
		return new Error('Your session expired. Sign in again to continue.')
	}

	return error
}

export async function login({ email, password }) {
	const client = requireSupabase()
	const { data, error } = await client.auth.signInWithPassword({ email, password })

	if (error) {
		throw normalizeAuthError(error)
	}

	return data.user
}

export async function signup({ email, password, metadata = {} }) {
	if (isReservedAdminEmail(email)) {
		throw new Error('The admin account is provisioned separately and cannot be registered from the public signup page.')
	}

	const client = requireSupabase()
	const { data, error } = await client.auth.signUp({
		email,
		password,
		options: {
			data: metadata,
		},
	})

	if (error) {
		throw normalizeAuthError(error)
	}

	return data.user
}

export async function logout() {
	const client = requireSupabase()
	const { error } = await client.auth.signOut()

	if (error) {
		throw normalizeAuthError(error)
	}
}

export async function getCurrentUser() {
	const client = requireSupabase()
	const { data, error } = await client.auth.getUser()

	if (error) {
		throw normalizeAuthError(error)
	}

	return data.user
}

export async function updateAccountMetadata(metadata) {
	const client = requireSupabase()
	const { data, error } = await client.auth.updateUser({ data: metadata })

	if (error) {
		throw normalizeAuthError(error)
	}

	return data.user
}

export async function changeAccountPassword(password) {
	const client = requireSupabase()
	const { data, error } = await client.auth.updateUser({ password })

	if (error) {
		throw normalizeAuthError(error)
	}

	return data.user
}
