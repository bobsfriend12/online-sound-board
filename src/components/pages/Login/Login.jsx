import React from "react";
import { Navigate } from "react-router-dom";

import { useSignInWithGoogle, useSignOut } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase";

import Loading from "../../core/Loading/Loading";

import "./Login.css";

export default function Login() {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
  const [signOut, signOutLoading, soerr] = useSignOut(auth);

  console.log(user);

  if (loading || signOutLoading) {
    return <Loading />;
  }

  if (soerr) {
    return <div>Error signing out: {soerr.message}</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="login">
      <button className="login__google" onClick={() => signInWithGoogle()}>
        Login with Google
      </button>
    </div>
  );
}
