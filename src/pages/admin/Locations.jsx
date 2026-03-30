import { useEffect, useState } from 'react'
import Button from '../../components/ui/Button.jsx'
import Card from '../../components/ui/Card.jsx'
import {
	createDistrict,
	createRegion,
	createZone,
	deleteDistrict,
	deleteRegion,
	deleteZone,
	getLocationCatalog,
} from '../../services/locationService.js'

function Locations() {
	const [catalog, setCatalog] = useState({ zones: [], regions: [], districts: [] })
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [zoneForm, setZoneForm] = useState({ name: '' })
	const [regionForm, setRegionForm] = useState({ zoneId: '', name: '' })
	const [districtForm, setDistrictForm] = useState({ regionId: '', name: '' })
	const [workingKey, setWorkingKey] = useState('')

	async function loadCatalog() {
		setLoading(true)
		setError('')
		try {
			setCatalog(await getLocationCatalog())
		} catch (loadError) {
			setError(loadError.message)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadCatalog()
	}, [])

	async function handleAction(key, action) {
		setWorkingKey(key)
		setError('')
		try {
			await action()
			await loadCatalog()
		} catch (actionError) {
			setError(actionError.message)
		} finally {
			setWorkingKey('')
		}
	}

	const regionsByZone = catalog.regions.reduce((accumulator, region) => {
		accumulator[region.zone_id] = [...(accumulator[region.zone_id] ?? []), region]
		return accumulator
	}, {})

	const districtsByRegion = catalog.districts.reduce((accumulator, district) => {
		accumulator[district.region_id] = [...(accumulator[district.region_id] ?? []), district]
		return accumulator
	}, {})

	return (
		<div className="space-y-6">
			<Card>
				<p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-700">Location management</p>
				<h2 className="mt-3 text-3xl font-semibold text-slate-900">Manage zones, regions, and districts</h2>
				<p className="mt-3 text-sm text-slate-600">
					Applicants must pick Zone, then Region, then District. Use this page to maintain the location catalog used by the onboarding form.
				</p>
			</Card>

			{error ? <Card className="text-rose-700">{error}</Card> : null}
			{loading ? <Card>Loading location catalog...</Card> : null}

			<div className="grid gap-6 xl:grid-cols-3">
				<Card>
					<h3 className="text-lg font-semibold text-slate-900">Add zone</h3>
					<form
						className="mt-4 space-y-4"
						onSubmit={(event) => {
							event.preventDefault()
							handleAction('create-zone', async () => {
								await createZone({ name: zoneForm.name.trim() })
								setZoneForm({ name: '' })
							})
						}}
					>
						<input
							value={zoneForm.name}
							onChange={(event) => setZoneForm({ name: event.target.value })}
							placeholder="Zone name"
							className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
							required
						/>
						<Button type="submit" className="w-full" disabled={workingKey === 'create-zone'}>
							Add zone
						</Button>
					</form>
				</Card>

				<Card>
					<h3 className="text-lg font-semibold text-slate-900">Add region</h3>
					<form
						className="mt-4 space-y-4"
						onSubmit={(event) => {
							event.preventDefault()
							handleAction('create-region', async () => {
								await createRegion({ zoneId: regionForm.zoneId, name: regionForm.name.trim() })
								setRegionForm({ zoneId: '', name: '' })
							})
						}}
					>
						<select
							value={regionForm.zoneId}
							onChange={(event) => setRegionForm((current) => ({ ...current, zoneId: event.target.value }))}
							className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
							required
						>
							<option value="">Select zone</option>
							{catalog.zones.map((zone) => (
								<option key={zone.id} value={zone.id}>
									{zone.name}
								</option>
							))}
						</select>
						<input
							value={regionForm.name}
							onChange={(event) => setRegionForm((current) => ({ ...current, name: event.target.value }))}
							placeholder="Region name"
							className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
							required
						/>
						<Button type="submit" className="w-full" disabled={workingKey === 'create-region'}>
							Add region
						</Button>
					</form>
				</Card>

				<Card>
					<h3 className="text-lg font-semibold text-slate-900">Add district</h3>
					<form
						className="mt-4 space-y-4"
						onSubmit={(event) => {
							event.preventDefault()
							handleAction('create-district', async () => {
								await createDistrict({ regionId: districtForm.regionId, name: districtForm.name.trim() })
								setDistrictForm({ regionId: '', name: '' })
							})
						}}
					>
						<select
							value={districtForm.regionId}
							onChange={(event) => setDistrictForm((current) => ({ ...current, regionId: event.target.value }))}
							className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
							required
						>
							<option value="">Select region</option>
							{catalog.regions.map((region) => (
								<option key={region.id} value={region.id}>
									{region.name}
								</option>
							))}
						</select>
						<input
							value={districtForm.name}
							onChange={(event) => setDistrictForm((current) => ({ ...current, name: event.target.value }))}
							placeholder="District name"
							className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
							required
						/>
						<Button type="submit" className="w-full" disabled={workingKey === 'create-district'}>
							Add district
						</Button>
					</form>
				</Card>
			</div>

			<div className="space-y-4">
				{catalog.zones.map((zone) => (
					<Card key={zone.id}>
						<div className="flex flex-wrap items-start justify-between gap-4">
							<div>
								<h3 className="text-xl font-semibold text-slate-900">{zone.name}</h3>
								<p className="mt-1 text-sm text-slate-500">
									{(regionsByZone[zone.id] ?? []).length} regions configured
								</p>
							</div>
							<Button variant="danger" onClick={() => handleAction(`delete-zone-${zone.id}`, () => deleteZone(zone.id))}>
								Delete zone
							</Button>
						</div>
						<div className="mt-5 grid gap-4 lg:grid-cols-2">
							{(regionsByZone[zone.id] ?? []).map((region) => (
								<div key={region.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
									<div className="flex items-start justify-between gap-3">
										<div>
											<h4 className="text-base font-semibold text-slate-900">{region.name}</h4>
											<p className="mt-1 text-sm text-slate-500">
												{(districtsByRegion[region.id] ?? []).length} districts
											</p>
										</div>
										<Button
											variant="secondary"
											onClick={() => handleAction(`delete-region-${region.id}`, () => deleteRegion(region.id))}
										>
											Delete region
										</Button>
									</div>
									<div className="mt-4 flex flex-wrap gap-2">
										{(districtsByRegion[region.id] ?? []).map((district) => (
											<span key={district.id} className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm text-slate-700">
												{district.name}
												<button
													type="button"
													onClick={() => handleAction(`delete-district-${district.id}`, () => deleteDistrict(district.id))}
													className="text-rose-700"
												>
													Remove
												</button>
											</span>
										))}
									</div>
								</div>
							))}
						</div>
					</Card>
				))}
			</div>
		</div>
	)
}

export default Locations