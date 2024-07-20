// src/components/GoogleLoginButton.jsx
"use client"; // Mark this as a Client Component

import React from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";

interface GoogleLoginButtonProps {
  onSuccess: (credentialResponse: CredentialResponse) => void;
  onFailure?: () => void; // Adjusted to match expected type
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onSuccess, onFailure }) => {
  return (
    <GoogleLogin
      onSuccess={onSuccess}
      onError={onFailure} // Now correctly matches the expected type
    />
  );
};

export default GoogleLoginButton;

