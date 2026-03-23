import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAppointmentsByDoctorId } from '../../api/appointment'

const AppointmentDashbaord = () => {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const fetchDoctorAppointments = async () => {
      setLoading(true)
      setError('')

      try {
        const doctorId = localStorage.getItem('doctorId')
        const token = localStorage.getItem('doctorToken') || localStorage.getItem('token')

        if (!doctorId || !token) {
          throw new Error('Doctor session not found. Please login again.')
        }

        const response = await getAppointmentsByDoctorId(doctorId, token)
        const data = Array.isArray(response) ? response : []

        if (isMounted) {
          setAppointments(data)
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message || 'Failed to fetch doctor appointments.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchDoctorAppointments()

    return () => {
      isMounted = false
    }
  }, [])

  const formatDate = (value) => {
    if (!value) return 'N/A'

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return 'N/A'
    return date.toLocaleDateString('en-CA')
  }

  const normalizedAppointments = useMemo(
    () =>
      appointments.map((appointment) => ({
        id: appointment._id || appointment.id,
        patientName:
          appointment?.patientId?.name ||
          appointment?.patientName ||
          'Unknown Patient',
        age: appointment?.patientId?.age ?? 'N/A',
        date: formatDate(appointment.appointmentDate),
        slot: appointment.appointmentTime || 'N/A',
        reason: appointment.reason || 'General consultation',
        status: (appointment.status || 'scheduled').toLowerCase(),
      })),
    [appointments]
  )

  const filteredAppointments = normalizedAppointments.filter((appointment) => {
    const value = search.trim().toLowerCase()
    const searchMatch =
      !value ||
      appointment.patientName.toLowerCase().includes(value) ||
      String(appointment.id).toLowerCase().includes(value)

    const statusMatch = statusFilter === 'all' || appointment.status === statusFilter

    return searchMatch && statusMatch
  })

  const stats = {
    total: normalizedAppointments.length,
    scheduled: normalizedAppointments.filter((item) => item.status === 'scheduled').length,
    completed: normalizedAppointments.filter((item) => item.status === 'completed').length,
    cancelled: normalizedAppointments.filter((item) => item.status === 'cancelled').length,
  }

  const getStatusClass = (status) => {
    if (status === 'scheduled') return 'bg-emerald-100 text-emerald-700'
    if (status === 'completed') return 'bg-blue-100 text-blue-700'
    if (status === 'cancelled') return 'bg-rose-100 text-rose-700'
    return 'bg-slate-200 text-slate-700'
  }

  const getStatusLabel = (status) => {
    if (status === 'scheduled') return 'Scheduled'
    if (status === 'completed') return 'Completed'
    if (status === 'cancelled') return 'Cancelled'
    return 'Unknown'
  }

  return (
    <section className="min-h-dvh px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/10 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="mb-2 inline-flex rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-700">
                Doctor Panel
              </p>
              <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Appointment Dashboard</h1>
              <p className="mt-1 text-slate-600">
                View all appointments booked by patients and track their status.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/doctor/profile"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
              >
                My Profile
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
              >
                Logout
              </Link>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-600">Total Appointments</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{stats.total}</p>
            </article>
            <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm text-emerald-700">Scheduled</p>
              <p className="mt-1 text-2xl font-bold text-emerald-800">{stats.scheduled}</p>
            </article>
            <article className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm text-blue-700">Completed</p>
              <p className="mt-1 text-2xl font-bold text-blue-800">{stats.completed}</p>
            </article>
            <article className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
              <p className="text-sm text-rose-700">Cancelled</p>
              <p className="mt-1 text-2xl font-bold text-rose-800">{stats.cancelled}</p>
            </article>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by patient name or appointment id"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none ring-teal-200 transition focus:border-teal-600 focus:ring-4"
            />

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none ring-teal-200 transition focus:border-teal-600 focus:ring-4"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </header>

        <div className="mt-6 grid gap-4">
          {loading && (
            <p className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-600">
              Loading your appointments...
            </p>
          )}

          {!loading && error && (
            <p className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700">
              {error}
            </p>
          )}

          {!loading && !error && filteredAppointments.map((appointment) => (
            <article
              key={appointment.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-900/5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{appointment.patientName}</h2>
                  <p className="text-sm text-slate-600">Appointment ID: {appointment.id}</p>
                </div>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(appointment.status)}`}
                >
                  {getStatusLabel(appointment.status)}
                </span>
              </div>

              <div className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-2 lg:grid-cols-4">
                <p>
                  <span className="font-semibold">Age:</span> {appointment.age}
                </p>
                <p>
                  <span className="font-semibold">Date:</span> {appointment.date}
                </p>
                <p>
                  <span className="font-semibold">Time Slot:</span> {appointment.slot}
                </p>
                <p>
                  <span className="font-semibold">Reason:</span> {appointment.reason}
                </p>
              </div>
            </article>
          ))}

          {!loading && !error && filteredAppointments.length === 0 && (
            <p className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-slate-600">
              No appointments match your search or status filter.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

export default AppointmentDashbaord
