import { useEffect, useMemo, useState } from 'react'
import { getCurrentUser, login, logout, signup } from '../services/authService.js'
import { isSupabaseConfigured, supabase } from '../services/supabaseClient.js'
import { resolveRole } from '../config/roles.js'
import { AuthContext } from './auth-context.js'

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null)
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

		async function bootstrapAuth() {
			try {
				const currentUser = await getCurrentUser()

				if (!isMounted) {
					return
				}

				setUser(currentUser)
				setRole(resolveRole(currentUser))
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
			setUser(session?.user ?? null)
			setRole(resolveRole(session?.user ?? null))
			setLoading(false)
		})

		return () => {
			isMounted = false
			subscription.unsubscribe()
		}
	}, [])

	const value = useMemo(
		() => ({
			user,
			role,
			loading,
			authError,
			isConfigured: isSupabaseConfigured,
			login,
			signup,
			logout,
		}),
		[authError, loading, role, user],
	)

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
