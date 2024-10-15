import React, { useState } from 'react';
import axios from 'axios'; // Import Axios
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail, MdOutlineWork } from "react-icons/md";
import { BsTelephoneFill } from "react-icons/bs";
import { ImManWoman } from "react-icons/im";
import { useNavigate } from 'react-router-dom';
import LoginImage from '../../../assets/loginbackimage.jpeg';
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
const API_URL = `http://localhost:8000`

const Signup = () => {
    const navigate = useNavigate();

    // State variables for form fields
    const [username, setUsername] = useState("");
    const [cniId, setCniId] = useState("");
    const [email, setEmail] = useState("");
    const [telephone, setTelephone] = useState("");
    const [profession, setProfession] = useState("");
    const [gender, setGender] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");

    // State variables for form submission
    const [isSubmitting, setIsSubmitting] = useState(false);

    const signup = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const signupData = {
            username,
            cniId,
            email,
            telephone,
            role,
            profession,
            gender,
            password,
        };

        try {
            const response = await axios.post(`${API_URL}/api/accounts/signup`, signupData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.status === 201) {
                
                sessionStorage.setItem('fragmark_user', JSON.stringify(response.data))

                // Show success toast
                toast.success("Registration successful! Please check your email to verify your account.", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                // Redirect based on role after a short delay to allow users to see the success message
                setTimeout(() => {
                    if (role === "land_buyer") {
                        navigate('/landbuyer');
                    } else if (role === "land_owner") {
                        navigate('/landowner');
                    } else {
                        navigate('/');
                    }
                }, 5000); // 5-second delay
            } else {
                // Handle unexpected status codes
                console.error("Failed to sign up:", response.status, response.statusText, response.data);
                toast.error("Failed to sign up. Please try again.", {
                    position: "top-right",
                    autoClose: 5000,
                });
            }
        } catch (error) {
            if (error.response) {
                // Server responded with a status other than 2xx
                console.error("Signup error:", error.response.status, error.response.statusText, error.response.data);
                toast.error(error.response.data.message || "Failed to sign up. Please check your input.", {
                    position: "top-right",
                    autoClose: 5000,
                });
            } else if (error.request) {
                // Request was made but no response received
                console.error("No response from server:", error.request);
                toast.error("No response from server. Please try again later.", {
                    position: "top-right",
                    autoClose: 5000,
                });
            } else {
                // Something else caused the error
                console.error("Error during signup:", error.message);
                toast.error("An unexpected error occurred. Please try again.", {
                    position: "top-right",
                    autoClose: 5000,
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="flex shadow-lg w-11/12 md:w-3/4 max-w-4xl bg-white rounded-lg overflow-hidden">
                {/* Left Side - Image with Overlay */}
                <div className="w-1/2 hidden md:block relative">
                    <img
                        src={LoginImage}
                        alt="Signup"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black opacity-25"></div> {/* Optional Overlay */}
                </div>
                {/* Right Side - Form */}
                <div className="w-full md:w-1/2 p-8">
                    <form onSubmit={signup} className="space-y-6">
                        <h2 className="text-3xl font-bold text-gray-700 text-center">Sign Up</h2>
                        
                        {/* Username */}
                        <div className="relative">
                            <FaUser className="absolute right-3 top-3 text-gray-400" />
                            <input
                                id="username"
                                type='text'
                                placeholder='Username'
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                                aria-label="Username"
                            />
                        </div>
                        
                        {/* CNI ID */}
                        <div className="relative">
                            <FaUser className="absolute right-3 top-3 text-gray-400" />
                            <input
                                id="cniId"
                                type='text'
                                placeholder='Enter CNI Id number'
                                required
                                value={cniId}
                                onChange={(e) => setCniId(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                aria-label="CNI ID"
                            />
                        </div>
                        
                        {/* Email */}
                        <div className="relative">
                            <MdEmail className="absolute right-3 top-3 text-gray-400" />
                            <input
                                id="email"
                                type='email'
                                placeholder='Email'
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                aria-label="Email"
                            />
                        </div>
                        
                        {/* Telephone */}
                        <div className="relative">
                            <BsTelephoneFill className="absolute right-3 top-3 text-gray-400" />
                            <input
                                id="telephone"
                                type='tel'
                                placeholder='Telephone'
                                required
                                value={telephone}
                                onChange={(e) => setTelephone(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                aria-label="Telephone"
                            />
                        </div>
                        
                        {/* Profession */}
                        <div className="relative">
                            <MdOutlineWork className="absolute right-3 top-3 text-gray-400" />
                            <input
                                id="profession"
                                type='text'
                                placeholder='Profession'
                                required
                                value={profession}
                                onChange={(e) => setProfession(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                aria-label="Profession"
                            />
                        </div>
                        
                        {/* Gender */}
                        <div className="relative">
                            <ImManWoman className="absolute right-3 top-3 text-gray-400" />
                            <input
                                id="gender"
                                type='text'
                                placeholder='Gender'
                                required
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                aria-label="Gender"
                            />
                        </div>
                        
                        {/* Role */}
                        <div className="relative">
                            <MdOutlineWork className="absolute right-3 top-3 text-gray-400" />
                            <select
                                id="role"
                                required
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                aria-label="Role"
                            >
                                <option value="">-- Select Role --</option>
                                <option value="land_buyer">Land Buyer</option>
                                <option value="land_owner">Land Owner</option>
                            </select>
                        </div>
                        
                        {/* Password */}
                        <div className="relative">
                            <FaLock className="absolute right-3 top-3 text-gray-400" />
                            <input
                                id="password"
                                type='password'
                                placeholder='Password'
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                aria-label="Password"
                            />
                        </div>
                        
                        {/* Submit Button */}
                        <button
                            type='submit'
                            disabled={isSubmitting}
                            className={`w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-2 rounded-md hover:from-green-500 hover:to-blue-500 transition duration-300 shadow-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                        </button>
                        
                        {/* Login Link */}
                        <div className="text-center">
                            <p className="text-gray-600">
                                Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login here</a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
            {/* Toast Container */}
            <ToastContainer 
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    )
}

export default Signup;
