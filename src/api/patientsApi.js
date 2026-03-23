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

// GET /patients - Get all patients (admin only)
export const getAllPatients = (token) =>
	request('/patients', {
		token,
	})

// GET /patients/:id - Get a specific patient by ID
export const getPatientById = (id, token) =>
	request(`/patients/${id}`, {
		token,
	})

// POST /patients - Create a new patient
export const createPatient = (patientData, token) =>
	request('/patients', {
		method: 'POST',
		token,
		body: patientData,
	})

// PUT /patients/:id - Update a patient's information
export const updatePatient = (id, patientData, token) =>
	request(`/patients/${id}`, {
		method: 'PUT',
		token,
		body: patientData,
	})

// DELETE /patients/:id - Delete a patient (admin only)
export const deletePatient = (id, token) =>
	request(`/patients/${id}`, {
		method: 'DELETE',
		token,
	})

const patientsApi = {
	getAllPatients,
	getPatientById,
	createPatient,
	updatePatient,
	deletePatient,
}

export default patientsApi
