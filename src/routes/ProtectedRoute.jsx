// import React, { useEffect, useState } from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { useProfileQuery } from "../redux/apiSlices/authSlice";

// const PrivateRoute = ({ children }) => {
//   const location = useLocation();
//   const { data: profile, isLoading, isError, isFetching } = useProfileQuery();

//   if (isLoading || isFetching) {
//     return <div>Loading...</div>;
//   }

//   if (isError) {
//     return <Navigate to="/auth/login" state={{ from: location }} />;
//   }

//   if (
//     profile?.role &&
//     (profile?.role === "ADMIN" || profile?.role === "SUPER_ADMIN")
//   ) {
//     return children;
//   }

//   return <Navigate to="/auth/login" state={{ from: location }} />;
// };

// export default PrivateRoute;

// import React from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { useUser } from "../provider/User";

// const PrivateRoute = ({ children, allowedRoles }) => {
//   const location = useLocation();
//   const { user } = useUser(); // 👈 get dummy user

//   if (!user) {
//     // no user found, redirect
//     return <Navigate to="/auth/login" state={{ from: location }} />;
//   }

//   // if role not allowed
//   if (allowedRoles && !allowedRoles.includes(user.role)) {
//     return <Navigate to="/auth/login" state={{ from: location }} />;
//   }

//   return children;
// };

// export default PrivateRoute;

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../provider/User";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

const PrivateRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const navigate = useNavigate();
  // const { user } = useUser();

  const userToken = localStorage.getItem("accessToken");
  // decord token
  const decoded = jwtDecode(userToken);
  if (!userToken) {
    // Not logged in → send to login
    return <Navigate to="/auth/login" state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(decoded.role)) {
    // Logged in but not authorized → show 403
    return (
      <div
        className="min-h-screen flex flex-col justify-center items-center p-6"
        style={{
          backgroundColor: "#181818",
        }}
      >
        {/* Lock Icon */}
        <div className="mb-6 animate-bounce">
          <Lock size={80} className="text-[#48B14C]" />
        </div>

        {/* Main Text */}
        <h1 className="text-6xl font-bold mb-4" style={{ color: "#48B14C" }}>
          403
        </h1>
        <p className="text-xl mb-2" style={{ color: "#ffffff" }}>
          Forbidden
        </p>
        <p className="text-center max-w-md mb-6 text-gray-300">
          You don’t have permission to access this page. Only Super Admin can
          access this section.
        </p>

        {/* Login Button */}
        <button
          onClick={() => navigate("/auth/login")}
          className="font-semibold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition transform"
          style={{
            backgroundColor: "#48B14C",
            color: "#ffffff",
          }}
        >
          Go to Login
        </button>

        {/* Optional footer */}
        <p className="text-gray-400 mt-10 text-sm">
          © {new Date().getFullYear()} YourCompany. All rights reserved.
        </p>
      </div>
    );
  }

  return children;
};

export default PrivateRoute;
