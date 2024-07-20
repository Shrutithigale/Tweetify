"use client";
import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<GoogleOAuthProvider
			clientId={"1005456442290-hrus9icqc743s35v58ljvlt6lqml9qp0.apps.googleusercontent.com"}
		>
	       {children}
		</GoogleOAuthProvider>
	);
};