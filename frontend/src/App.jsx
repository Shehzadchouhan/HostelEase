import { Routes, Route } from "react-router-dom"

import Landing from "./pages/landing"
import Login from "./pages/login"
import Register from "./pages/register"
import MapView from "./pages/MapView"
import Services from "./pages/Services"
import ServiceDetails from "./pages/ServiceDetails"
import Contact from "./pages/contact"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/map" element={<MapView />} />
      <Route path="/services" element={<Services />} />
      <Route path="/service/:id" element={<ServiceDetails />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

export default App