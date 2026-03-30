import Card from '../../components/ui/Card.jsx'
import Settings from '../user/Settings.jsx'

function AdminSettings() {
	return (
		<div className="space-y-6">
			<Card className="p-5 sm:p-6">
				<p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-700">Admin settings</p>
				<h2 className="mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">Manage your admin account</h2>
				<p className="mt-3 text-sm text-slate-600">Update your profile, security settings, and theme. Admin tools remain available on the applications and users pages.</p>
			</Card>
			<Settings showHeader={false} />
		</div>
	)
}

export default AdminSettings