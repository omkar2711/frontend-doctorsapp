import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const Profile = () => {
  const initialProfile = useMemo(
    () => ({
      fullName: 'Aarav Verma',
      age: '29',
      gender: 'Male',
      bloodGroup: 'O+',
      phone: '+91 98765 43210',
      email: 'aarav.verma@email.com',
      address: '221 Green Park, New Delhi',
      emergencyContact: '+91 99887 77665',
      medicalNotes: 'Allergic to penicillin',
    }),
    []
  )

  const [formData, setFormData] = useState(initialProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
  }

  const handleSave = (event) => {
    event.preventDefault()
    setIsEditing(false)
    setStatusMessage('Profile updated successfully.')
  }

  const handleCancel = () => {
    setFormData(initialProfile)
    setIsEditing(false)
    setStatusMessage('Changes discarded.')
  }

  return (
    <section className="min-h-dvh px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/10 sm:p-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="mb-2 inline-flex rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-700">
              Patient Profile
            </p>
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">My Details</h1>
            <p className="mt-1 text-slate-600">View and edit your personal profile information.</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/patient/doctors"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            >
              Back to Doctors
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

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-slate-700">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none ring-teal-200 transition disabled:bg-slate-100 disabled:text-slate-500 focus:border-teal-600 focus:ring-4"
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
                min="0"
                value={formData.age}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none ring-teal-200 transition disabled:bg-slate-100 disabled:text-slate-500 focus:border-teal-600 focus:ring-4"
              />
            </div>

            <div>
              <label htmlFor="gender" className="mb-1 block text-sm font-medium text-slate-700">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none ring-teal-200 transition disabled:bg-slate-100 disabled:text-slate-500 focus:border-teal-600 focus:ring-4"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="bloodGroup" className="mb-1 block text-sm font-medium text-slate-700">
                Blood Group
              </label>
              <input
                id="bloodGroup"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none ring-teal-200 transition disabled:bg-slate-100 disabled:text-slate-500 focus:border-teal-600 focus:ring-4"
              />
            </div>

            <div>
              <label htmlFor="phone" className="mb-1 block text-sm font-medium text-slate-700">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none ring-teal-200 transition disabled:bg-slate-100 disabled:text-slate-500 focus:border-teal-600 focus:ring-4"
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
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="emergencyContact" className="mb-1 block text-sm font-medium text-slate-700">
                Emergency Contact
              </label>
              <input
                id="emergencyContact"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none ring-teal-200 transition disabled:bg-slate-100 disabled:text-slate-500 focus:border-teal-600 focus:ring-4"
              />
            </div>

            <div>
              <label htmlFor="medicalNotes" className="mb-1 block text-sm font-medium text-slate-700">
                Medical Notes
              </label>
              <input
                id="medicalNotes"
                name="medicalNotes"
                value={formData.medicalNotes}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none ring-teal-200 transition disabled:bg-slate-100 disabled:text-slate-500 focus:border-teal-600 focus:ring-4"
              />
            </div>
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
                className="rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 px-4 py-2 font-semibold text-white shadow-lg shadow-teal-700/25 transition hover:from-teal-700 hover:to-teal-800"
              >
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </section>
  )
}

export default Profile
