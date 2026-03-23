import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { createAppointment } from '../../api/appointment'

const AppointmnentPage = () => {
  const navigate = useNavigate()
  const { state } = useLocation()

  const fallbackDoctor = useMemo(
    () => ({
      _id: 'demo-doctor-id',
      name: 'Dr. Aanya Sharma',
      age: 38,
      specialization: 'Cardiologist',
      experience: 12,
      timeSlots: {
        availableTimeSlots: [
          { start: '9:00 AM', end: '10:00 AM' },
          { start: '10:00 AM', end: '11:00 AM' },
        ],
        bookedTimeSlots: [{ start: '11:00 AM', end: '12:00 PM' }],
      },
    }),
    []
  )

  const doctor = state?.doctor ?? fallbackDoctor

  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const formatSlot = (slot) => {
    if (!slot) return ''

    if (typeof slot === 'string') {
      return slot
    }

    const start = slot.start || ''
    const end = slot.end || ''
    return `${start} - ${end}`.trim()
  }

  const availableSlots = Array.isArray(doctor?.timeSlots?.availableTimeSlots)
    ? doctor.timeSlots.availableTimeSlots
    : []

  const bookedSlots = Array.isArray(doctor?.timeSlots?.bookedTimeSlots)
    ? doctor.timeSlots.bookedTimeSlots
    : []

  const getTokenFromStorage = () => {
    const tokenCandidates = [
      localStorage.getItem('patientToken'),
      localStorage.getItem('token'),
      localStorage.getItem('doctorToken'),
      localStorage.getItem('adminToken'),
    ]

    return tokenCandidates.find(Boolean)
  }

  const decodeUserIdFromToken = (token) => {
    if (!token || !token.includes('.')) {
      return null
    }

    try {
      const base64Payload = token.split('.')[1]
      const normalizedPayload = base64Payload.replace(/-/g, '+').replace(/_/g, '/')
      const payloadText = window.atob(normalizedPayload)
      const payload = JSON.parse(payloadText)
      return payload?.id || null
    } catch {
      return null
    }
  }

  const handleAppointment = async (event) => {
    event.preventDefault()

    if (!selectedDate || !selectedSlot) {
      setError('Please select appointment date and time slot.')
      return
    }

    const token = getTokenFromStorage()
    const patientId = localStorage.getItem('patientId') || decodeUserIdFromToken(token)
    const doctorId = doctor?._id || doctor?.id

    if (!patientId || !doctorId) {
      setError('Patient and doctor details are required to create appointment.')
      return
    }

    try {
      setIsSubmitting(true)
      setError('')

      const appointmentPayload = {
        patientId,
        doctorId,
        appointmentDate: selectedDate,
        appointmentTime: selectedSlot,
      }

      const appointmentResponse = await createAppointment(appointmentPayload, token)

      navigate('/patient/confirmation', {
        state: {
          doctor,
          date: selectedDate,
          slot: selectedSlot,
          reason,
          appointmentResponse,
        },
      })
    } catch (requestError) {
      setError(requestError.message || 'Failed to create appointment.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="min-h-dvh px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Book Appointment</h1>
          <Link
            to="/patient/doctors"
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
          >
            Back to Doctors
          </Link>
        </header>

        <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/10">
            <p className="mb-2 inline-flex rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-700">
              Selected Doctor
            </p>
            <h2 className="text-2xl font-bold text-slate-900">{doctor.name}</h2>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p>
                <span className="font-semibold text-slate-700">Age:</span> {doctor.age}
              </p>
              <p>
                <span className="font-semibold text-slate-700">Specialization:</span>{' '}
                {doctor.specialization}
              </p>
              <p>
                <span className="font-semibold text-slate-700">Experience:</span>{' '}
                {typeof doctor.experience === 'number'
                  ? `${doctor.experience} years`
                  : doctor.experience}
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-teal-100 bg-teal-50/50 p-4 text-sm text-teal-900">
              Choose a date and available slot, then confirm your appointment.
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/10">
            <form onSubmit={handleAppointment} className="space-y-4">
              <div>
                <label htmlFor="appointmentDate" className="mb-1 block text-sm font-medium text-slate-700">
                  Appointment Date
                </label>
                <input
                  id="appointmentDate"
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(event) => setSelectedDate(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none ring-teal-200 transition focus:border-teal-600 focus:ring-4"
                  required
                />
              </div>

              <div>
                <p className="mb-2 block text-sm font-medium text-slate-700">Available Time Slots</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {availableSlots.length === 0 && (
                    <p className="col-span-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                      No available slots configured for this doctor.
                    </p>
                  )}

                  {availableSlots.map((slot) => {
                    const slotLabel = formatSlot(slot)
                    const active = selectedSlot === slotLabel
                    return (
                      <button
                        key={slotLabel}
                        type="button"
                        onClick={() => {
                          setSelectedSlot(slotLabel)
                          setError('')
                        }}
                        className={`rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                          active
                            ? 'scale-[1.03] border border-teal-700 bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-700/25 ring-2 ring-teal-200'
                            : 'border border-slate-300 bg-white text-slate-700 hover:border-teal-400 hover:text-teal-700'
                        }`}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          {active ? <span className="text-xs">✓</span> : null}
                          {slotLabel}
                        </span>
                      </button>
                    )
                  })}
                </div>

                <div
                  className={`mt-3 overflow-hidden rounded-xl border px-3 py-2 text-sm transition-all duration-200 ${
                    selectedSlot
                      ? 'max-h-24 border-emerald-200 bg-emerald-50 text-emerald-800'
                      : 'max-h-0 border-transparent bg-transparent px-0 py-0 text-transparent'
                  }`}
                >
                  {selectedSlot ? (
                    <p>
                      Selected slot: <span className="font-semibold">{selectedSlot}</span>
                    </p>
                  ) : null}
                </div>
              </div>

              <div>
                <p className="mb-2 block text-sm font-medium text-slate-700">Booked Time Slots</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {bookedSlots.length === 0 && (
                    <p className="col-span-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                      No booked slots yet.
                    </p>
                  )}

                  {bookedSlots.map((slot) => {
                    const slotLabel = formatSlot(slot)

                    return (
                      <span
                        key={slotLabel}
                        className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-center text-sm font-semibold text-rose-700"
                      >
                        {slotLabel}
                      </span>
                    )
                  })}
                </div>
              </div>

              <div>
                <label htmlFor="reason" className="mb-1 block text-sm font-medium text-slate-700">
                  Reason for Visit (optional)
                </label>
                <textarea
                  id="reason"
                  rows={3}
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  placeholder="Briefly describe symptoms or consultation reason"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none ring-teal-200 transition focus:border-teal-600 focus:ring-4"
                />
              </div>

              {error ? (
                <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={!selectedDate || !selectedSlot || isSubmitting}
                className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 px-4 py-2.5 font-semibold text-white shadow-lg shadow-teal-700/25 transition hover:from-teal-700 hover:to-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Creating Appointment...' : 'Confirm Appointment'}
              </button>
            </form>
          </article>
        </div>
      </div>
    </section>
  )
}

export default AppointmnentPage
