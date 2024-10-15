// src/components/ConfirmEmail.js

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const API_URL = `http://localhost:8000`;

const ConfirmEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState("Verifying...");
    const [error, setError] = useState("");

    // Utility to parse query parameters
    const useQuery = () => {
        return new URLSearchParams(location.search);
    };

    useEffect(() => {
        const query = useQuery();
        const token = query.get('token');

        if (!token) {
            setError("Invalid verification link.");
            setStatus(null);
            return;
        }

        const verifyEmail = async () => {
            try {
                const response = await fetch(`${API_URL}/api/accounts/verify-email`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                });

                if (response.status === 200) {
                    const data = await response.json();
                    setStatus("Email verified successfully!");

                    // Optionally, store authentication tokens here if the server logs in the user upon verification

                    // Redirect based on role after a short delay
                    setTimeout(() => {
                        if (data.role === "land_buyer") {
                            navigate('/landbuyer');
                        } else if (data.role === "land_owner") {
                            navigate('/landowner');
                        } else {
                            navigate('/');
                        }
                    }, 3000); // 3-second delay to show success message
                } else {
                    const errorData = await response.json();
                    setError(errorData.message || "Failed to verify email.");
                    setStatus(null);
                }
            } catch (err) {
                console.error("Error during email verification:", err);
                setError("An unexpected error occurred. Please try again.");
                setStatus(null);
            }
        };

        verifyEmail();
    }, [location.search, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="p-8 bg-white rounded shadow-md max-w-md w-full text-center">
                {status && <p className="text-green-500">{status}</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!status && !error && <p>Verifying your email...</p>}
            </div>
        </div>
    );
};

export default ConfirmEmail;
