const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

const buildHeaders = (token, hasBody = false) => {
	const headers = {}

	if (hasBody) {
		headers['Content-Type'] = 'application/json'
	}

	if (token) {
		headers.Authorization = `Bearer ${token}`
	}

	return headers
}

const request = async (endpoint, { method = 'GET', token, body } = {}) => {
	const response = await fetch(`${API_BASE_URL}${endpoint}`, {
		method,
		headers: buildHeaders(token, body !== undefined),
		body: body !== undefined ? JSON.stringify(body) : undefined,
	})

	const payload = await response.json().catch(() => ({}))

	if (!response.ok) {
		const message = payload.message || `Request failed with status ${response.status}`
		const error = new Error(message)
		error.status = response.status
		error.payload = payload
		throw error
	}

	return payload
}

// GET /appointments - Get all appointments (admin only)
export const getAllAppointments = (token) =>
	request('/appointments', {
		token,
	})

// GET /appointments/doctor/:doctorId - Get appointments for a specific doctor
export const getAppointmentsByDoctorId = (doctorId, token) =>
	request(`/appointments/doctor/${doctorId}`, {
		token,
	})

// GET /appointments/:id - Get a specific appointment by ID
export const getAppointmentById = (id, token) =>
	request(`/appointments/${id}`, {
		token,
	})

// POST /appointments - Create a new appointment
export const createAppointment = (appointmentData, token) =>
	request('/appointments', {
		method: 'POST',
		token,
		body: appointmentData,
	})

// PUT /appointments/:id - Update an appointment's information
export const updateAppointment = (id, appointmentData, token) =>
	request(`/appointments/${id}`, {
		method: 'PUT',
		token,
		body: appointmentData,
	})

// DELETE /appointments/:id - Delete an appointment (admin only)
export const deleteAppointment = (id, token) =>
	request(`/appointments/${id}`, {
		method: 'DELETE',
		token,
	})

const appointmentApi = {
	getAllAppointments,
	getAppointmentsByDoctorId,
	getAppointmentById,
	createAppointment,
	updateAppointment,
	deleteAppointment,
}

export default appointmentApi
