export const ROLES = Object.freeze({
	USER: 'USER',
	ADMIN: 'ADMIN',
})

export const ADMIN_IDENTITIES = Object.freeze([
	Object.freeze({
		email: 'mbazzacodes@gmail.com',
		id: '32fbf24f-6a93-4a19-af06-eded5be88496',
	}),
	Object.freeze({
		email: 'jumad@dstv.com',
		id: 'f4e128d3-7869-4637-9da9-15e44acaa6a1',
	}),
	Object.freeze({
		email: 'mika@dstv.com',
		id: 'c7325cea-ad1b-441b-af59-2b741292af90',
	}),
])

export function isReservedAdminEmail(email) {
	const normalizedEmail = String(email ?? '').trim().toLowerCase()

	return ADMIN_IDENTITIES.some((identity) => identity.email.toLowerCase() === normalizedEmail)
}

export function resolveRole(user) {
	if (!user) {
		return null
	}

	return isReservedAdminEmail(user.email) || ADMIN_IDENTITIES.some((identity) => identity.id === user.id)
		? ROLES.ADMIN
		: ROLES.USER
}
