export const ROLES = Object.freeze({
	USER: 'USER',
	ADMIN: 'ADMIN',
})

export const ADMIN_IDENTITY = Object.freeze({
	email: 'mbazzacodes@gmail.com',
	id: '32fbf24f-6a93-4a19-af06-eded5be88496',
})

export function isReservedAdminEmail(email) {
	return String(email ?? '').trim().toLowerCase() === ADMIN_IDENTITY.email.toLowerCase()
}

export function resolveRole(user) {
	if (!user) {
		return null
	}

	return isReservedAdminEmail(user.email) || user.id === ADMIN_IDENTITY.id
		? ROLES.ADMIN
		: ROLES.USER
}
