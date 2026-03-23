import axios from 'axios'

const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

const authClient = axios.create({
	baseURL: `${API_BASE_URL}/auth`,
	headers: {
		'Content-Type': 'application/json',
	},
})

export const loginUser = async ({ email, password, role }) => {
	const response = await authClient.post('/login', {
		email,
		password,
		role,
	})

	return response.data
}

export const registerUser = async (payload) => {
	const response = await authClient.post('/register', payload)
	return response.data
}

export const persistAuthSession = ({ token, role, email, userId, doctorId, patientId, adminId }) => {
	if (!token) return

	localStorage.setItem('token', token)
	localStorage.setItem(`${role}Token`, token)
	localStorage.setItem('userRole', role)
	localStorage.setItem('userEmail', email)

	if (userId) {
		localStorage.setItem('userId', userId)
	}

	if (doctorId) {
		localStorage.setItem('doctorId', doctorId)
	}

	if (patientId) {
		localStorage.setItem('patientId', patientId)
	}

	if (adminId) {
		localStorage.setItem('adminId', adminId)
	}
}

const authApi = {
	loginUser,
	registerUser,
	persistAuthSession,
}

export default authApi
