import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAllDoctors } from '../../api/doctorApi'

const DoctorListing = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const fetchDoctors = async () => {
      setLoading(true)
      setError('')

      try {
        const tokenCandidates = [
          localStorage.getItem('adminToken'),
          localStorage.getItem('doctorToken'),
          localStorage.getItem('patientToken'),
          localStorage.getItem('token'),
        ]
        const token = tokenCandidates.find(Boolean)

        const response = await getAllDoctors(token)
        const doctorsList = Array.isArray(response) ? response : []

        if (isMounted) {
          setDoctors(doctorsList)
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message || 'Failed to load doctors.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchDoctors()

    return () => {
      isMounted = false
    }
  }, [])

  const normalizedDoctors = useMemo(
    () =>
      doctors.map((doctor) => ({
        id: doctor._id || doctor.id,
        name: doctor.name || 'Doctor',
        age: doctor.age ?? 'N/A',
        contactNumber: doctor.contactNumber || 'N/A',
        address: doctor.address || 'N/A',
        specialization: doctor.specialization || 'General',
        experience:
          typeof doctor.experience === 'number'
            ? `${doctor.experience} years`
            : doctor.experience || 'N/A',
        availableTimeSlots: Array.isArray(doctor?.timeSlots?.availableTimeSlots)
          ? doctor.timeSlots.availableTimeSlots
          : [],
        bookedTimeSlots: Array.isArray(doctor?.timeSlots?.bookedTimeSlots)
          ? doctor.timeSlots.bookedTimeSlots
          : [],
        raw: doctor,
      })),
    [doctors]
  )

  const filteredDoctors = normalizedDoctors.filter((doctor) => {
    const value = search.trim().toLowerCase()
    if (!value) return true
    return (
      doctor.name.toLowerCase().includes(value) ||
      doctor.specialization.toLowerCase().includes(value)
    )
  })

  return (
    <section className="min-h-dvh px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/10 sm:p-8">
          <p className="mb-2 inline-flex rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-700">
            Find Doctors
          </p>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Doctor Listing</h1>
          <p className="mt-2 text-slate-600">
            Browse doctors and book your appointment in a few clicks.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by doctor name or specialization"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none ring-teal-200 transition focus:border-teal-600 focus:ring-4"
            />
            <Link
              to="/patient/profile"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            >
              My Profile
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            >
              Back to Login
            </Link>
          </div>
        </header>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {loading && (
            <p className="md:col-span-2 xl:col-span-3 rounded-xl border border-slate-200 bg-white p-5 text-center text-slate-600">
              Loading doctors...
            </p>
          )}

          {!loading && error && (
            <p className="md:col-span-2 xl:col-span-3 rounded-xl border border-rose-200 bg-rose-50 p-5 text-center text-rose-700">
              {error}
            </p>
          )}

          {!loading && !error && filteredDoctors.map((doctor) => (
            <article
              key={doctor.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-900/5 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <h2 className="text-xl font-bold text-slate-900">{doctor.name}</h2>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                <p>
                  <span className="font-semibold text-slate-700">Age:</span> {doctor.age}
                </p>
                <p>
                  <span className="font-semibold text-slate-700">Specialization:</span>{' '}
                  {doctor.specialization}
                </p>
                <p>
                  <span className="font-semibold text-slate-700">Experience:</span>{' '}
                  {doctor.experience}
                </p>
                <p>
                  <span className="font-semibold text-slate-700">Contact:</span>{' '}
                  {doctor.contactNumber}
                </p>
                <p>
                  <span className="font-semibold text-slate-700">Address:</span>{' '}
                  {doctor.address}
                </p>
                <p>
                  <span className="font-semibold text-emerald-700">Available Slots:</span>{' '}
                  {doctor.availableTimeSlots.length}
                </p>
                <p>
                  <span className="font-semibold text-rose-700">Booked Slots:</span>{' '}
                  {doctor.bookedTimeSlots.length}
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/patient/appointment', { state: { doctor: doctor.raw } })}
                className="mt-4 w-full rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-700/25 transition hover:from-teal-700 hover:to-teal-800"
              >
                Book Appointment
              </button>
            </article>
          ))}
        </div>

        {!loading && !error && filteredDoctors.length === 0 && (
          <p className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-5 text-center text-slate-600">
            No doctors found for this search. Try another name or specialization.
          </p>
        )}
      </div>
    </section>
  )
}

export default DoctorListing
