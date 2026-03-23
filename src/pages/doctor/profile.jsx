import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDoctorById, updateDoctor } from '../../api/doctorApi'

const DoctorProfile = () => {
	const emptyProfile = {
		name: '',
		email: '',
		age: '',
		contactNumber: '',
		specialization: '',
		experience: '',
		address: '',
	}

	const [formData, setFormData] = useState(emptyProfile)
	const [initialProfile, setInitialProfile] = useState(emptyProfile)
	const [isEditing, setIsEditing] = useState(false)
	const [statusMessage, setStatusMessage] = useState('')
	const [error, setError] = useState('')
	const [isLoading, setIsLoading] = useState(true)
	const [isSaving, setIsSaving] = useState(false)

	const mapDoctorToForm = (doctor) => ({
		name: doctor?.name || '',
		email: doctor?.email || '',
		age: doctor?.age !== undefined && doctor?.age !== null ? String(doctor.age) : '',
		contactNumber: doctor?.contactNumber || '',
		specialization: doctor?.specialization || '',
		experience:
			doctor?.experience !== undefined && doctor?.experience !== null
				? String(doctor.experience)
				: '',
		address: doctor?.address || '',
	})

	const getSession = () => {
		const doctorId = localStorage.getItem('doctorId') || localStorage.getItem('userId')
		const token = localStorage.getItem('doctorToken') || localStorage.getItem('token')

		return { doctorId, token }
	}

	useEffect(() => {
		let isMounted = true

		const fetchDoctorProfile = async () => {
			setIsLoading(true)
			setError('')

			try {
				const { doctorId, token } = getSession()

				if (!doctorId || !token) {
					throw new Error('Doctor session not found. Please login again.')
				}

				const doctor = await getDoctorById(doctorId, token)
				const mappedProfile = mapDoctorToForm(doctor)

				if (isMounted) {
					setFormData(mappedProfile)
					setInitialProfile(mappedProfile)
				}
			} catch (requestError) {
				if (isMounted) {
					setError(requestError.message || 'Failed to load doctor profile.')
				}
			} finally {
				if (isMounted) {
					setIsLoading(false)
				}
			}
		}

		fetchDoctorProfile()

		return () => {
			isMounted = false
		}
	}, [])

	const handleChange = (event) => {
		const { name, value } = event.target
		setFormData((previous) => ({ ...previous, [name]: value }))
	}

	const handleSave = async (event) => {
		event.preventDefault()
		setStatusMessage('')
		setError('')

		if (
			!formData.name.trim() ||
			!formData.email.trim() ||
			!formData.contactNumber.trim() ||
			!formData.specialization.trim() ||
			!formData.address.trim()
		) {
			setError('Name, email, contact number, specialization, and address are required.')
			return
		}

		const ageValue = Number(formData.age)
		const experienceValue = Number(formData.experience)

		if (Number.isNaN(ageValue) || ageValue <= 0) {
			setError('Age must be a positive number.')
			return
		}

		if (Number.isNaN(experienceValue) || experienceValue < 0) {
			setError('Experience must be a non-negative number.')
			return
		}

		try {
			setIsSaving(true)
			const { doctorId, token } = getSession()

			if (!doctorId || !token) {
				throw new Error('Doctor session not found. Please login again.')
			}

			const payload = {
				name: formData.name.trim(),
				email: formData.email.trim(),
				age: ageValue,
				contactNumber: formData.contactNumber.trim(),
				specialization: formData.specialization.trim(),
				experience: experienceValue,
				address: formData.address.trim(),
			}

			const response = await updateDoctor(doctorId, payload, token)
			const updatedDoctor = response?.doctor || payload
			const mappedProfile = mapDoctorToForm(updatedDoctor)

			setFormData(mappedProfile)
			setInitialProfile(mappedProfile)
			setIsEditing(false)
			setStatusMessage(response?.message || 'Profile updated successfully.')
		} catch (requestError) {
			setError(requestError.message || 'Failed to update profile.')
		} finally {
			setIsSaving(false)
		}
	}

	const handleCancel = () => {
		setFormData(initialProfile)
		setIsEditing(false)
		setError('')
		setStatusMessage('Changes discarded.')
	}

	return (
		<section className="min-h-dvh px-4 py-8 sm:px-6 lg:px-8">
			<div className="mx-auto w-full max-w-5xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/10 sm:p-8">
				<header className="mb-6 flex flex-wrap items-center justify-between gap-3">
					<div>
						<p className="mb-2 inline-flex rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-700">
							Doctor Profile
						</p>
						<h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">My Details</h1>
						<p className="mt-1 text-slate-600">View and update your professional details.</p>
					</div>

					<div className="flex items-center gap-2">
						<Link
							to="/doctor/appointments"
							className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
						>
							Back to Dashboard
						</Link>

						{!isEditing && (
							<button
								type="button"
								onClick={() => {
									setIsEditing(true)
									setStatusMessage('')
								}}
								className="rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 px-4 py-2 font-semibold text-white shadow-lg shadow-teal-700/25 transition hover:from-teal-700 hover:to-teal-800"
							>
								Edit Profile
							</button>
						)}
					</div>
				</header>

				{statusMessage && (
					<div className="mb-4 rounded-xl border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-800">
						{statusMessage}
					</div>
				)}

				{error && (
					<div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-800">
						{error}
					</div>
				)}

				{isLoading ? (
					<div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-slate-600">
						Loading doctor profile...
					</div>
				) : (

				<form onSubmit={handleSave} className="space-y-5">
					<div className="grid gap-4 sm:grid-cols-2">
						<div>
							<label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
								Full Name
							</label>
							<input
								id="name"
								name="name"
								value={formData.name}
								onChange={handleChange}
								disabled={!isEditing}
								className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none ring-teal-200 transition disabled:bg-slate-100 disabled:text-slate-500 focus:border-teal-600 focus:ring-4"
								required
							/>
						</div>

						<div>
							<label htmlFor="age" className="mb-1 block text-sm font-medium text-slate-700">
								Age
							</label>
							<input
								id="age"
								name="age"
								type="number"
								min="1"
								value={formData.age}
								onChange={handleChange}
								disabled={!isEditing}
								className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none ring-teal-200 transition disabled:bg-slate-100 disabled:text-slate-500 focus:border-teal-600 focus:ring-4"
								required
							/>
						</div>

						<div>
							<label htmlFor="specialization" className="mb-1 block text-sm font-medium text-slate-700">
								Specialization
							</label>
							<input
								id="specialization"
								name="specialization"
								value={formData.specialization}
								onChange={handleChange}
								disabled={!isEditing}
								className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none ring-teal-200 transition disabled:bg-slate-100 disabled:text-slate-500 focus:border-teal-600 focus:ring-4"
								required
							/>
						</div>

						<div>
							<label htmlFor="experience" className="mb-1 block text-sm font-medium text-slate-700">
								Experience (years)
							</label>
							<input
								id="experience"
								name="experience"
								type="number"
								min="0"
								value={formData.experience}
								onChange={handleChange}
								disabled={!isEditing}
								className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none ring-teal-200 transition disabled:bg-slate-100 disabled:text-slate-500 focus:border-teal-600 focus:ring-4"
								required
							/>
						</div>

						<div>
							<label htmlFor="contactNumber" className="mb-1 block text-sm font-medium text-slate-700">
								Phone Number
							</label>
							<input
								id="contactNumber"
								name="contactNumber"
								value={formData.contactNumber}
								onChange={handleChange}
								disabled={!isEditing}
								className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none ring-teal-200 transition disabled:bg-slate-100 disabled:text-slate-500 focus:border-teal-600 focus:ring-4"
								required
							/>
						</div>

						<div>
							<label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
								Email Address
							</label>
							<input
								id="email"
								name="email"
								type="email"
								value={formData.email}
								onChange={handleChange}
								disabled={!isEditing}
								className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none ring-teal-200 transition disabled:bg-slate-100 disabled:text-slate-500 focus:border-teal-600 focus:ring-4"
								required
							/>
						</div>
					</div>

					<div>
						<label htmlFor="address" className="mb-1 block text-sm font-medium text-slate-700">
							Address
						</label>
						<input
							id="address"
							name="address"
							value={formData.address}
							onChange={handleChange}
							disabled={!isEditing}
							className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none ring-teal-200 transition disabled:bg-slate-100 disabled:text-slate-500 focus:border-teal-600 focus:ring-4"
							required
						/>
					</div>

					{isEditing && (
						<div className="flex flex-wrap justify-end gap-2">
							<button
								type="button"
								onClick={handleCancel}
								className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={isSaving}
								className="rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 px-4 py-2 font-semibold text-white shadow-lg shadow-teal-700/25 transition hover:from-teal-700 hover:to-teal-800"
							>
								{isSaving ? 'Saving...' : 'Save Changes'}
							</button>
						</div>
					)}
				</form>
				)}
			</div>
		</section>
	)
}

export default DoctorProfile
