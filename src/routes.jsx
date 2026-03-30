import { createBrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import HomeRedirect from './components/layout/HomeRedirect.jsx'
import ProtectedRoute from './components/layout/ProtectedRoute.jsx'
import { ROLES } from './config/roles.js'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import ApplicationReview from './pages/admin/ApplicationReview.jsx'
import Applications from './pages/admin/Applications.jsx'
import Locations from './pages/admin/Locations.jsx'
import NotFound from './pages/NotFound.jsx'
import Login from './pages/auth/Login.jsx'
import Signup from './pages/auth/Signup.jsx'
import ApplicationForm from './pages/user/ApplicationForm.jsx'
import Dashboard from './pages/user/Dashboard.jsx'

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
						path: 'apply',
						element: <ApplicationForm />,
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
						path: 'admin/locations',
						element: <Locations />,
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
