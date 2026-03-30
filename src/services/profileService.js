import { resolveRole } from '../config/roles.js'
import { requireSupabase } from './supabaseClient.js'

function normalizeProfile(profile) {
	return {
		...profile,
		fullName: profile.full_name ?? '',
	}
}

export async function ensureProfileForUser(user) {
	if (!user) {
		return null
	}

	const client = requireSupabase()
	const payload = {
		id: user.id,
		email: user.email,
		full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? '',
		region: user.user_metadata?.region ?? '',
		role: resolveRole(user),
	}

	const { data, error } = await client
		.from('profiles')
		.upsert(payload, { onConflict: 'id' })
		.select('*')
		.single()

	if (error) {
		throw error
	}

	return normalizeProfile(data)
}

export async function updateProfileDetails({ userId, email, fullName, region, role }) {
	const client = requireSupabase()
	const { data, error } = await client
		.from('profiles')
		.update({
			email,
			full_name: fullName,
			region,
			role,
		})
		.eq('id', userId)
		.select('*')
		.single()

	if (error) {
		throw error
	}

	return normalizeProfile(data)
}

export async function getAllProfiles() {
	const client = requireSupabase()
	const { data, error } = await client.from('profiles').select('*').order('created_at', { ascending: false })

	if (error) {
		throw error
	}

	return data.map(normalizeProfile)
}