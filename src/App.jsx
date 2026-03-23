import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import DoctorListing from './pages/patient/doctorListing'
import AppointmnentPage from './pages/patient/AppointmnentPage'
import ConfirmationPage from './pages/patient/confirmationPage'
import Profile from './pages/patient/profile'
import AppointmentDashbaord from './pages/doctor/AppointmentDashbaord'
import DoctorProfile from './pages/doctor/profile'

const App = () => {
  return (
    <div>
        <Routes>
          <Route path="/" element={<h1>Doctor's Appointment application</h1>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/patient/doctors" element={<DoctorListing />} />
          <Route path="/patient/appointment" element={<AppointmnentPage />} />
          <Route path="/patient/confirmation" element={<ConfirmationPage />} />
          <Route path="/patient/profile" element={<Profile />} />
          <Route path="/doctor/appointments" element={<AppointmentDashbaord />} />
          <Route path="/doctor/profile" element={<DoctorProfile />} />
        </Routes>
    </div>
  )
}

export default App
