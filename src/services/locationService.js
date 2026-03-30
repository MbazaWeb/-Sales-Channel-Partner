import { requireSupabase } from './supabaseClient.js'

function sortByOrderThenName(left, right) {
	const leftOrder = left.sort_order ?? 0
	const rightOrder = right.sort_order ?? 0
	if (leftOrder !== rightOrder) {
		return leftOrder - rightOrder
	}

	return left.name.localeCompare(right.name)
}

function normalizeCatalog({ zones, regions, districts }) {
	const sortedZones = [...zones].sort(sortByOrderThenName)
	const sortedRegions = [...regions].sort(sortByOrderThenName)
	const sortedDistricts = [...districts].sort(sortByOrderThenName)

	return {
		zones: sortedZones,
		regions: sortedRegions,
		districts: sortedDistricts,
	}
}

export async function getLocationCatalog() {
	const client = requireSupabase()
	const [zonesResponse, regionsResponse, districtsResponse] = await Promise.all([
		client.from('location_zones').select('*').order('sort_order').order('name'),
		client.from('location_regions').select('*').order('sort_order').order('name'),
		client.from('location_districts').select('*').order('sort_order').order('name'),
	])

	if (zonesResponse.error) {
		throw zonesResponse.error
	}

	if (regionsResponse.error) {
		throw regionsResponse.error
	}

	if (districtsResponse.error) {
		throw districtsResponse.error
	}

	return normalizeCatalog({
		zones: zonesResponse.data,
		regions: regionsResponse.data,
		districts: districtsResponse.data,
	})
}

export async function createZone({ name, sortOrder = 0 }) {
	const client = requireSupabase()
	const { data, error } = await client
		.from('location_zones')
		.insert({ name, sort_order: sortOrder })
		.select('*')
		.single()

	if (error) {
		throw error
	}

	return data
}

export async function createRegion({ zoneId, name, sortOrder = 0 }) {
	const client = requireSupabase()
	const { data, error } = await client
		.from('location_regions')
		.insert({ zone_id: zoneId, name, sort_order: sortOrder })
		.select('*')
		.single()

	if (error) {
		throw error
	}

	return data
}

export async function createDistrict({ regionId, name, sortOrder = 0 }) {
	const client = requireSupabase()
	const { data, error } = await client
		.from('location_districts')
		.insert({ region_id: regionId, name, sort_order: sortOrder })
		.select('*')
		.single()

	if (error) {
		throw error
	}

	return data
}

export async function deleteZone(zoneId) {
	const client = requireSupabase()
	const { error } = await client.from('location_zones').delete().eq('id', zoneId)

	if (error) {
		throw error
	}
}

export async function deleteRegion(regionId) {
	const client = requireSupabase()
	const { error } = await client.from('location_regions').delete().eq('id', regionId)

	if (error) {
		throw error
	}
}

export async function deleteDistrict(districtId) {
	const client = requireSupabase()
	const { error } = await client.from('location_districts').delete().eq('id', districtId)

	if (error) {
		throw error
	}
}