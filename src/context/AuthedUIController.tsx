"use client";
import { User, usePrivy } from "@privy-io/react-auth";
import React from "react";

/**
 * Props for the AuthedUIController component.
 */
interface AuthedUIControllerProps {
  /**
   * Function to render the UI when the user is authenticated.
   *
   * @param ready - Boolean indicating if the authentication state is ready.
   * @param authenticated - Boolean indicating if the user is authenticated.
   * @param user - The authenticated user object.
   * @param logout - Function to log out the user.
   * @returns ReactNode - The UI to render when the user is authenticated.
   */
  authedUI: ({
    ready,
    authenticated,
    user,
    logout,
  }: {
    ready: boolean;
    authenticated: boolean;
    user: User | null;
    logout: () => void;
  }) => React.ReactNode;

  /**
   * Function to render the UI when the user is not authenticated.
   *
   * @param ready - Boolean indicating if the authentication state is ready.
   * @param authenticated - Boolean indicating if the user is authenticated.
   * @param user - The authenticated user object.
   * @param login - Function to log in the user.
   * @returns ReactNode - The UI to render when the user is not authenticated.
   */
  unauthedUI: ({
    ready,
    authenticated,
    user,
    login,
  }: {
    ready: boolean;
    authenticated: boolean;
    user: User | null;
    login: () => void;
  }) => React.ReactNode;
}

/**
 * AuthedUIController component to manage and render UI based on authentication state.
 *
 * @param authedUI - Function to render the UI when the user is authenticated.
 * @param unauthedUI - Function to render the UI when the user is not authenticated.
 * @returns ReactNode - The rendered UI based on the authentication state.
 */
const AuthedUIController = ({
  authedUI,
  unauthedUI,
}: AuthedUIControllerProps) => {
  const { ready, authenticated, login, user, logout } = usePrivy();

  return ready && authenticated && user
    ? authedUI({ ready, authenticated, user, logout })
    : unauthedUI({ ready, authenticated, user, login });
};

export default AuthedUIController;
