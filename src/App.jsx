import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import MapView from "./pages/MapView";
import Services from "./pages/Services"
import Contact from "./pages/contact"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/map" element={<MapView />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<contact />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}

export default App;
