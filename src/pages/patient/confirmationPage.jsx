import { Link, useLocation } from 'react-router-dom'

const ConfirmationPage = () => {
  const { state } = useLocation()

  const doctor = state?.doctor
  const date = state?.date
  const slot = state?.slot
  const reason = state?.reason

  const isBooked = Boolean(doctor && date && slot)

  return (
    <section className="min-h-dvh px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/10 sm:p-8">
        {isBooked ? (
          <>
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-teal-100 text-2xl text-teal-700">
              ✓
            </div>
            <h1 className="text-center text-3xl font-bold text-slate-900 sm:text-4xl">
              Appointment Confirmed
            </h1>
            <p className="mt-2 text-center text-slate-600">
              Your booking is successful. Please arrive 10 minutes before your slot.
            </p>

            <article className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-xl font-bold text-slate-900">Booking Details</h2>
              <div className="mt-3 space-y-2 text-sm text-slate-700">
                <p>
                  <span className="font-semibold">Doctor:</span> {doctor.name}
                </p>
                <p>
                  <span className="font-semibold">Specialization:</span>{' '}
                  {doctor.specialization}
                </p>
                <p>
                  <span className="font-semibold">Date:</span> {date}
                </p>
                <p>
                  <span className="font-semibold">Time Slot:</span> {slot}
                </p>
                <p>
                  <span className="font-semibold">Reason:</span>{' '}
                  {reason?.trim() ? reason : 'General consultation'}
                </p>
              </div>
            </article>
          </>
        ) : (
          <>
            <h1 className="text-center text-3xl font-bold text-slate-900 sm:text-4xl">
              No Appointment Found
            </h1>
            <p className="mt-2 text-center text-slate-600">
              Please select a doctor and slot to create an appointment first.
            </p>
          </>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            to="/patient/doctors"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 px-4 py-2.5 font-semibold text-white shadow-lg shadow-teal-700/25 transition hover:from-teal-700 hover:to-teal-800"
          >
            Book Another Appointment
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
          >
            Go To Login
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ConfirmationPage
