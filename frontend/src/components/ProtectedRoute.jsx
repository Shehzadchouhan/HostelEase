import { useEffect } from "react";
import "../styles/protected-route-modal.css";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [token]);

  if (!token) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Authentication Required</h2>
          <p>Please login or register first to access this page.</p>
          <div className="modal-buttons">
            <a href="/login" className="modal-btn login-btn">
              Login
            </a>
            <a href="/register" className="modal-btn register-btn">
              Register
            </a>
          </div>
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
