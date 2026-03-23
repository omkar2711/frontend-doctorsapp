import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../api/auth'

const SignUp = () => {
  const navigate = useNavigate()
  const [role, setRole] = useState('doctor')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    contactNumber: '',
    address: '',
    specialization: '',
    experience: '',
    password: '',
    confirmPassword: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const roleConfig = {
    doctor: {
      title: 'Doctor Sign Up',
      subtitle: 'Create your doctor account to manage schedules and appointments.',
      action: 'Create Doctor Account',
    },
    patient: {
      title: 'Patient Sign Up',
      subtitle: 'Create your patient account to book and track appointments.',
      action: 'Create Patient Account',
    },
  }

  const selected = roleConfig[role]

  const handleRoleChange = (nextRole) => {
    setRole(nextRole)
    setError('')
    setSuccess('')
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    const requiredCommon = [
      formData.name,
      formData.email,
      formData.age,
      formData.contactNumber,
      formData.address,
      formData.password,
    ]

    if (requiredCommon.some((value) => !String(value).trim())) {
      setError('Please fill all required fields.')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Password and confirm password do not match.')
      return
    }

    const parsedAge = Number(formData.age)
    if (Number.isNaN(parsedAge) || parsedAge <= 0) {
      setError('Age must be a valid positive number.')
      return
    }

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      age: parsedAge,
      contactNumber: formData.contactNumber.trim(),
      password: formData.password,
      role,
      address: formData.address.trim(),
    }

    if (role === 'doctor') {
      if (!formData.specialization.trim() || !String(formData.experience).trim()) {
        setError('Specialization and experience are required for doctor signup.')
        return
      }

      const parsedExperience = Number(formData.experience)
      if (Number.isNaN(parsedExperience) || parsedExperience < 0) {
        setError('Experience must be a valid non-negative number.')
        return
      }

      payload.specialization = formData.specialization.trim()
      payload.experience = parsedExperience
    }

    try {
      setSubmitting(true)
      const response = await registerUser(payload)
      setSuccess(response?.message || 'Registration successful. Redirecting to login...')

      setTimeout(() => {
        navigate('/login')
      }, 1000)
    } catch (requestError) {
      const apiMessage = requestError?.response?.data?.message
      const fallbackMessage = requestError?.message || 'Signup failed. Please try again.'
      setError(apiMessage || fallbackMessage)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="min-h-dvh px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-5xl gap-4 lg:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl shadow-slate-900/10 backdrop-blur sm:p-8">
          <p className="mb-3 inline-flex rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-700">
            Doctor Appointment App
          </p>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Create account</h1>
          <p className="mt-4 text-slate-600">
            One signup flow for doctors and patients with role-specific details.
          </p>

          <ul className="mt-6 space-y-3 text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-teal-600" />
              Doctor and patient onboarding
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-teal-600" />
              Minimal and secure form design
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-teal-600" />
              Easy switch between account types
            </li>
          </ul>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/10 sm:p-8">
          <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => handleRoleChange('doctor')}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                role === 'doctor'
                  ? 'bg-white text-slate-900 shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Doctor Sign Up
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('patient')}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                role === 'patient'
                  ? 'bg-white text-slate-900 shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Patient Sign Up
            </button>
          </div>

          <h2 className="text-2xl font-bold text-slate-900">{selected.title}</h2>
          <p className="mt-1 text-sm text-slate-600">{selected.subtitle}</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none ring-teal-200 transition focus:border-teal-600 focus:ring-4"
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
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none ring-teal-200 transition focus:border-teal-600 focus:ring-4"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="age" className="mb-1 block text-sm font-medium text-slate-700">
                  Age
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  min="1"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none ring-teal-200 transition focus:border-teal-600 focus:ring-4"
                  required
                />
              </div>

              <div>
                <label htmlFor="contactNumber" className="mb-1 block text-sm font-medium text-slate-700">
                  Contact Number
                </label>
                <input
                  id="contactNumber"
                  name="contactNumber"
                  type="text"
                  placeholder="Enter contact number"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none ring-teal-200 transition focus:border-teal-600 focus:ring-4"
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
                type="text"
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none ring-teal-200 transition focus:border-teal-600 focus:ring-4"
                required
              />
            </div>

            {role === 'doctor' && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="specialization" className="mb-1 block text-sm font-medium text-slate-700">
                    Specialization
                  </label>
                  <input
                    id="specialization"
                    name="specialization"
                    type="text"
                    placeholder="e.g. Cardiologist"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none ring-teal-200 transition focus:border-teal-600 focus:ring-4"
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
                    placeholder="Enter years of experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none ring-teal-200 transition focus:border-teal-600 focus:ring-4"
                    required
                  />
                </div>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none ring-teal-200 transition focus:border-teal-600 focus:ring-4"
                  required
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-slate-700">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none ring-teal-200 transition focus:border-teal-600 focus:ring-4"
                  required
                />
              </div>
            </div>

            {error ? (
              <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </p>
            ) : null}

            {success ? (
              <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {success}
              </p>
            ) : null}

            <label className="inline-flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" className="h-4 w-4 accent-teal-600" required />
              I agree to terms and privacy policy
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 px-4 py-2.5 font-semibold text-white shadow-lg shadow-teal-700/25 transition hover:from-teal-700 hover:to-teal-800"
            >
              {submitting ? 'Creating account...' : selected.action}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-teal-700 hover:text-teal-800">
              Login here
            </Link>
          </p>
        </article>
      </div>
    </section>
  )
}

export default SignUp
