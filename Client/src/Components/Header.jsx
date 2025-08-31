import React from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { UserContext } from "./Context/UserContext";
import { useContext } from "react";
const Header = () => {
  const {user} = useContext(UserContext);
  // console.log("User in Header:", user);
  const { backendUrl } = useContext(UserContext);

  return (
    <header className="flex flex-col items-center justify-center px-6 sm:px-12 py-12 max-w-5xl mx-auto text-center">
      {/* Top Image inside Circle */}
      <div className="w-48 h-48 sm:w-60 sm:h-60 bg-white rounded-full flex items-center justify-center mb-8 ">
        <img
          src={assets.header_img}
          alt="Header"
          className="w-32 h-32 sm:w-40 sm:h-40 object-contain"
        />
      </div>

      {/* Bottom Text */}
      <div className="w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 flex items-center justify-center gap-2">
          Hey {user ? user.username : 'Guest'}{" "}
          <img
            src={assets.hand_wave}
            alt="👋"
            className="w-8 h-8 inline-block"
          />
        </h1>
        <h2 className="mt-2 text-xl sm:text-2xl text-gray-600">
          Welcome to our platform
        </h2>
        <p className="mt-4 text-gray-500">
          Get started by logging in or signing up
        </p>
        <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition">
          Get Started
        </button>
      </div>
    </header>
  );
};

export default Header;
