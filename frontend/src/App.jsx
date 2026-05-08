import { Routes, Route } from "react-router-dom"

import Landing from "./pages/Landing"
import Login from "./pages/Login"
import Register from "./pages/Register"
import MapView from "./pages/MapView"
import Services from "./pages/Services"
import ServiceDetails from "./pages/ServiceDetails"
import Contact from "./pages/Contact"
import ResetPassword from "./pages/ResetPassword"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Protected Routes - Require Login */}
      <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
      <Route path="/map" element={<ProtectedRoute><MapView /></ProtectedRoute>} />
      <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
      <Route path="/service/:id" element={<ProtectedRoute><ServiceDetails /></ProtectedRoute>} />
    </Routes>
  )
}

export default App