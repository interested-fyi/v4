"use client";
import React from "react";
import AuthedUIController from "../../../context/AuthedUIController";
import AuthedNav from "./AuthedNav";
import UnauthedNav from "./UnauthedNav";

const AuthControlledNav = () => {
  return (
    <AuthedUIController
      authedUI={({ logout, user }) => <AuthedNav user={user} logout={logout} />}
      unauthedUI={({ login }) => <UnauthedNav login={login} />}
    />
  );
};

export default AuthControlledNav;