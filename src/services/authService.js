import { requireSupabase } from './supabaseClient.js'
import { isReservedAdminEmail } from '../config/roles.js'

export async function login({ email, password }) {
	const client = requireSupabase()
	const { data, error } = await client.auth.signInWithPassword({ email, password })

	if (error) {
		throw error
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
		throw error
	}

	return data.user
}

export async function logout() {
	const client = requireSupabase()
	const { error } = await client.auth.signOut()

	if (error) {
		throw error
	}
}

export async function getCurrentUser() {
	const client = requireSupabase()
	const { data, error } = await client.auth.getUser()

	if (error) {
		throw error
	}

	return data.user
}
