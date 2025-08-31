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

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`, {
        withCredentials: true,
      });

      if (data.success) {
        setUser(data.userData);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch user data");
    }
  };

  const getAuthStatus = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/auth/is-authenticated`, {
        withCredentials: true,
      });

      if (res.data.success) {
        setUser(res.data);
        setIsLoggedIn(true);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        // Not logged in → this is normal, not an error
        setUser(null);
        setIsLoggedIn(false);
      } else {
        console.error("Unexpected auth check error:", error);
      }
    }
  };

  // Run auth check when app loads
  useEffect(() => {
    getAuthStatus();
  }, []);

  const values = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    user,
    setUser,
    getUserData,
  };

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};
