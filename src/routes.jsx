import { createBrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import HomeRedirect from './components/layout/HomeRedirect.jsx'
import ProtectedRoute from './components/layout/ProtectedRoute.jsx'
import { ROLES } from './config/roles.js'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import ApplicationReview from './pages/admin/ApplicationReview.jsx'
import Applications from './pages/admin/Applications.jsx'
import Locations from './pages/admin/Locations.jsx'
import AdminSettings from './pages/admin/AdminSettings.jsx'
import Users from './pages/admin/Users.jsx'
import NotFound from './pages/NotFound.jsx'
import Login from './pages/auth/Login.jsx'
import Signup from './pages/auth/Signup.jsx'
import ApplicationForm from './pages/user/ApplicationForm.jsx'
import Dashboard from './pages/user/Dashboard.jsx'
import MyApplications from './pages/user/MyApplications.jsx'
import Settings from './pages/user/Settings.jsx'

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{
				index: true,
				element: <HomeRedirect />,
			},
			{
				path: 'login',
				element: <Login />,
			},
			{
				path: 'signup',
				element: <Signup />,
			},
			{
				element: <ProtectedRoute allowedRoles={[ROLES.USER]} />,
				children: [
					{
						path: 'dashboard',
						element: <Dashboard />,
					},
					{
						path: 'my-applications',
						element: <MyApplications />,
					},
					{
						path: 'apply',
						element: <ApplicationForm />,
					},
					{
						path: 'apply/:applicationId',
						element: <ApplicationForm />,
					},
					{
						path: 'settings',
						element: <Settings />,
					},
				],
			},
			{
				element: <ProtectedRoute allowedRoles={[ROLES.ADMIN]} />,
				children: [
					{
						path: 'admin',
						element: <AdminDashboard />,
					},
					{
						path: 'admin/applications',
						element: <Applications />,
					},
					{
						path: 'admin/applications/:applicationId',
						element: <ApplicationReview />,
					},
					{
						path: 'admin/users',
						element: <Users />,
					},
					{
						path: 'admin/locations',
						element: <Locations />,
					},
					{
						path: 'admin/settings',
						element: <AdminSettings />,
					},
				],
			},
			{
				path: '*',
				element: <NotFound />,
			},
		],
	},
])

export default router
