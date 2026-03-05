import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Landing from "./pages/landing";
import MapView from "./pages/MapView";
import Services from "./pages/Services"
import Contact from "./pages/contact"
import Register from "./pages/register";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/map" element={<MapView />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
