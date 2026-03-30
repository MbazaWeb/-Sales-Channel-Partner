import { useEffect, useMemo, useState } from 'react'
import {
	changeAccountPassword,
	getCurrentUser,
	login,
	logout,
	signup,
	updateAccountMetadata,
} from '../services/authService.js'
import { ensureProfileForUser, updateProfileDetails } from '../services/profileService.js'
import { isSupabaseConfigured, supabase } from '../services/supabaseClient.js'
import { resolveRole } from '../config/roles.js'
import { AuthContext } from './auth-context.js'

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null)
	const [profile, setProfile] = useState(null)
	const [role, setRole] = useState(null)
	const [loading, setLoading] = useState(true)
	const [authError, setAuthError] = useState('')

	useEffect(() => {
		if (!isSupabaseConfigured) {
			setLoading(false)
			setAuthError('Supabase environment variables are missing.')
			return undefined
		}

		let isMounted = true

		async function syncUser(nextUser) {
			if (!isMounted) {
				return
			}

			setUser(nextUser)
			setRole(resolveRole(nextUser))

			if (!nextUser) {
				setProfile(null)
				return
			}

			try {
				const nextProfile = await ensureProfileForUser(nextUser)

				if (isMounted) {
					setProfile(nextProfile)
				}
			} catch (error) {
				if (isMounted) {
					setAuthError(error.message)
				}
			}
		}

		async function bootstrapAuth() {
			try {
				const currentUser = await getCurrentUser()
				await syncUser(currentUser)
			} catch (error) {
				if (isMounted) {
					setAuthError(error.message)
				}
			} finally {
				if (isMounted) {
					setLoading(false)
				}
			}
		}

		bootstrapAuth()

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			syncUser(session?.user ?? null)
			if (isMounted) {
				setLoading(false)
			}
		})

		return () => {
			isMounted = false
			subscription.unsubscribe()
		}
	}, [])

	async function saveAccountProfile({ fullName, region }) {
		if (!user) {
			throw new Error('You must be signed in to update your profile.')
		}

		const nextMetadata = {
			...(user.user_metadata ?? {}),
			full_name: fullName,
			region,
		}

		const updatedUser = await updateAccountMetadata(nextMetadata)
		const updatedProfile = await updateProfileDetails({
			userId: user.id,
			email: updatedUser.email ?? user.email,
			fullName,
			region,
			role: resolveRole(updatedUser),
		})

		setUser(updatedUser)
		setRole(resolveRole(updatedUser))
		setProfile(updatedProfile)

		return updatedProfile
	}

	async function updatePassword(password) {
		const updatedUser = await changeAccountPassword(password)
		setUser(updatedUser)
		return updatedUser
	}

	const value = useMemo(
		() => ({
			user,
			profile,
			role,
			loading,
			authError,
			isConfigured: isSupabaseConfigured,
			login,
			signup,
			logout,
			saveAccountProfile,
			updatePassword,
		}),
		[authError, loading, profile, role, user],
	)

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
