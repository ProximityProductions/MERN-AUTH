import React, { useContext, useState, useRef, useEffect } from "react";
import { UserContext } from "../Components/Context/UserContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const EmailVerify = () => {
  const navigate = useNavigate();
  const { backendUrl,setUser, isLoggedIn, user } = useContext(UserContext);

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);
  axios.defaults.withCredentials = true;

  // Handle change
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return; // only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto move next
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };
  useEffect(() => {
  if (!isLoggedIn || !user) {
    navigate("/login"); // not logged in
  } else if (user.isVerified) {
    navigate("/"); // already verified
  }
}, [isLoggedIn, user, navigate]);
  // Handle backspace navigation
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle paste event
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(paste)) return; // only digits

    const pasteArray = paste.split("").slice(0, 6);
    const newOtp = [...otp];

    pasteArray.forEach((char, i) => {
      newOtp[i] = char;
      if (inputRefs.current[i]) {
        inputRefs.current[i].value = char;
      }
    });

    setOtp(newOtp);
  };

  // Submit OTP
  const onSubmitHandle = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/verify-user`,
        { otp: enteredOtp }
      );

      if (data.success) {
        toast.success(data.message);  
        setUser(data.user);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Email Verification
        </h2>
        <p className="text-gray-500 mb-6">
          Enter the 6-digit code sent to your email
        </p>

        <form onSubmit={onSubmitHandle}>
          <div
            className="flex justify-between mb-6"
            onPaste={handlePaste}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                ref={(el) => (inputRefs.current[index] = el)}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 border-2 border-gray-300 rounded-xl text-center text-xl font-semibold focus:outline-none focus:border-blue-500"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Verify Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailVerify;
