import { ROLES } from '../../config/roles.js'

export const navigationByRole = {
	[ROLES.USER]: [
		{ label: 'Dashboard', shortLabel: 'Home', to: '/dashboard' },
		{ label: 'My Applications', shortLabel: 'My Apps', to: '/my-applications' },
		{ label: 'Apply', shortLabel: 'Apply', to: '/apply' },
	],
	[ROLES.ADMIN]: [
		{ label: 'Admin Overview', shortLabel: 'Overview', to: '/admin' },
		{ label: 'Applications', shortLabel: 'Apps', to: '/admin/applications' },
		{ label: 'Locations', shortLabel: 'Locations', to: '/admin/locations' },
	],
}

export function getNavigationItems(role) {
	return navigationByRole[role] ?? []
}