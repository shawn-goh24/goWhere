import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

const user = auth;
console.log(auth);

function Protected({ isSignedIn, children }) {
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
}
export default Protected;
