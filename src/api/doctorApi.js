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

// GET /doctors - Get all doctors (admin only)
export const getAllDoctors = (token) =>
	request('/doctors', {
		token,
	})

// GET /doctors/:id - Get a specific doctor by ID
export const getDoctorById = (id, token) =>
	request(`/doctors/${id}`, {
		token,
	})

// POST /doctors - Create a new doctor
export const createDoctor = (doctorData, token) =>
	request('/doctors', {
		method: 'POST',
		token,
		body: doctorData,
	})

// PUT /doctors/:id - Update a doctor's information
export const updateDoctor = (id, doctorData, token) =>
	request(`/doctors/${id}`, {
		method: 'PUT',
		token,
		body: doctorData,
	})

// DELETE /doctors/:id - Delete a doctor (admin only)
export const deleteDoctor = (id, token) =>
	request(`/doctors/${id}`, {
		method: 'DELETE',
		token,
	})

const doctorApi = {
	getAllDoctors,
	getDoctorById,
	createDoctor,
	updateDoctor,
	deleteDoctor,
}

export default doctorApi
