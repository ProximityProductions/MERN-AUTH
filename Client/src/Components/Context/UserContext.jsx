import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Ensure axios always sends cookies
  axios.defaults.withCredentials = true;

  // Unified function to get user data and set auth status
  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`, {
        withCredentials: true,
      });

      if (data.success) {
        setUser(data.userData);
        setIsLoggedIn(true);
        return data.userData;
      } else {
        setUser(null);
        setIsLoggedIn(false);
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
      setIsLoggedIn(false);
      
      // Only show error toast if it's not a 401 (unauthorized)
      if (error.response?.status !== 401) {
        toast.error("Failed to fetch user data");
      }
      return null;
    }
  };

  // Check if user is authenticated (simplified version)
  const checkAuthStatus = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/is-authenticated`, {
        withCredentials: true,
      });

      if (data.success) {
        // If authenticated, fetch full user data
        await getUserData();
        return true;
      } else {
        setUser(null);
        setIsLoggedIn(false);
        return false;
      }
    } catch (error) {
      if (error.response?.status === 401) {
        // Not logged in → this is normal, not an error
        setUser(null);
        setIsLoggedIn(false);
        return false;
      } else {
        console.error("Unexpected auth check error:", error);
        setUser(null);
        setIsLoggedIn(false);
        return false;
      }
    }
  };

  // Logout function to clear state
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  // Run auth check when app loads
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const values = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    user,
    setUser,
    getUserData,
    checkAuthStatus,
    logout,
  };

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};