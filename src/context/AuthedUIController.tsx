"use client";
import { User, usePrivy } from "@privy-io/react-auth";
import React, { useEffect } from "react";

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
   * @param getAccessToken - Function to get the access token.
   * @returns ReactNode - The UI to render when the user is authenticated.
   */
  authedUI: ({
    ready,
    authenticated,
    user,
    logout,
    getAccessToken,
  }: {
    ready: boolean;
    authenticated: boolean;
    user: User | null;
    logout: () => void;
    getAccessToken: () => Promise<string | null>;
  }) => React.ReactNode;

  /**
   * Function to render the UI when the user is not authenticated.
   *
   * @param ready - Boolean indicating if the authentication state is ready.
   * @param authenticated - Boolean indicating if the user is authenticated.
   * @param user - The authenticated user object.
   * @param login - Function to log in the user.
   * @param getAccessToken - Function to get the access token.
   * @returns ReactNode - The UI to render when the user is not authenticated.
   */
  unauthedUI: ({
    ready,
    authenticated,
    user,
    login,
    getAccessToken,
  }: {
    ready: boolean;
    authenticated: boolean;
    user: User | null;
    login: () => void;
    getAccessToken: () => Promise<string | null>;
  }) => React.ReactNode;
}

/**
 * AuthedUIController component to manage and render UI based on authentication state.
 *
 * @param authedUI - Function to render the UI when the user is authenticated.
 * @param unauthedUI - Function to render the UI when the user is not authenticated.
 * @returns ReactNode - The rendered UI based on the authentication state.
 *
 * @example
 * <AuthedUIController
 *  authedUI={({ logout, user }) => <AuthedNav user={user} logout={logout} />}
 *  unauthedUI={({ login }) => <UnauthedNav login={login} />}
 * />
 *
 */
const AuthedUIController = ({
  authedUI,
  unauthedUI,
}: AuthedUIControllerProps) => {
  const { ready, authenticated, user, logout, login, getAccessToken } =
    usePrivy();
  useEffect(() => {
    async function saveUser() {
      if (authenticated) {
        const accessToken = await getAccessToken();
        const res = await fetch(`/api/users/save-user`, {
          method: "POST",
          cache: "no-store",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            privy_did: user?.id,
            email: user?.google?.email,
            name: user?.google?.name,
            subject: user?.google?.subject,
          }),
        });
      }
    }

    saveUser();
  }, [authenticated]);

  return ready && authenticated && user
    ? authedUI({ ready, authenticated, user, logout, getAccessToken })
    : unauthedUI({ ready, authenticated, user, login, getAccessToken });
};

export default AuthedUIController;
