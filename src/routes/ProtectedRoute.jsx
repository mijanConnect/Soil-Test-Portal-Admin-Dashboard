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

const PrivateRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const { user } = useUser();

  if (!user) {
    // Not logged in → send to login
    return <Navigate to="/auth/login" state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Logged in but not authorized → show 403
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>403 - Forbidden</h1>
        <p>You don’t have permission to access this page.</p>
      </div>
    );
  }

  return children;
};

export default PrivateRoute;
