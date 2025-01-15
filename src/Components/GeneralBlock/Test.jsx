import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ userRole, children }) {

  const [isLoading, setIsLoading] = useState(true);

  const getTokenData = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  };

  const isLoggedIn = () => !!getTokenData();

  const hasRole = (roles) => {
    const data = getTokenData();
    if (data) {
      for (let i = 0; i < roles.length; i++) {
        if (data.role === roles[i]) {
          return true;
        }
      }
    }
    return false;
  };

  const tokenData = getTokenData();
  const userId = tokenData?.Id;

  useEffect(() => {
    if (userId) {
      // Check if the user still exists in the database
      axios
        .get(`https://localhost:7127/api/User/user/${userId}`)
        .then((response) => {
          if (response.data.doctorsCard.firstName == null) {
            // User is deleted, log them out
            localStorage.removeItem("token");
            window.location.href = "/login"; // Redirect to login page
          }
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error checking user data:", error);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [userId]);

  if (isLoading) {
    return <div>Loading...</div>; // Optional: Add a loading state if necessary
  }

  if (!isLoggedIn()) {
    return <Navigate to="/login" />;
  }

  if (hasRole(userRole)) {
    return children;
  }

  return <Navigate to="/unauthorized" />;
}
