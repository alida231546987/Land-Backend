import React, { useState } from 'react';
import './Signup.css'; // Make sure to create a corresponding CSS file
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail, MdOutlineWork } from "react-icons/md";
import { BsTelephoneFill } from "react-icons/bs";
import { ImManWoman } from "react-icons/im";
import { useNavigate } from 'react-router-dom';
import LoginImage from '../../../assets/land.jpg';

export const API_URL = `http://localhost:8000`;

const Signup = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [cniId, setCniId] = useState("");
    const [email, setEmail] = useState("");
    const [telephone, setTelephone] = useState("");
    const [profession, setProfession] = useState("");
    const [gender, setGender] = useState("");
    const [password, setPassword] = useState("");

    const signup = async (e) => {
        e.preventDefault();

        let signupData = {
            username: username,
            cniId: cniId,
            email: email,
            telephone: telephone,
            role: "buyer",
            profession: profession,
            gender: gender,
            password: password,
        };

        try {
            const response = await fetch(`${API_URL}/api/accounts/signup`, {
                body: JSON.stringify(signupData),
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST"
            });

            if (response.status === 201) {
                const data = await response.json();
                console.log(`User created:`, data);
                navigate('/');
            } else {
                console.log("Failed to sign up", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Error during signup:", error);
        }
    }

    return (
        <div className='wrapper' style={{backgroundImage: `url(${LoginImage})`, width:'screen', backgroundSize: 'cover'}}>
            <form onSubmit={signup} style={{backgroundColor: 'red', width: '25%', backgroundSize: 'cover', background: 'no-repeat'}}>
                <h1>Sign Up</h1>
                <div className='input-box'>
                    <input type='text' placeholder='Username' required value={username} onChange={(e) => setUsername(e.target.value)} />
                    <FaUser className='icon' />
                </div>
                <div className='input-box'>
                    <input type='text' placeholder='Enter CNI Id number' required value={cniId} onChange={(e) => setCniId(e.target.value)} />
                    <FaUser className='icon' />
                </div>
                <div className='input-box'>
                    <input type='email' placeholder='Email' required value={email} onChange={(e) => setEmail(e.target.value)} />
                    <MdEmail className='icon' />
                </div>
                <div className='input-box'>
                    <input type='telephone' placeholder='Tel' required value={telephone} onChange={(e) => setTelephone(e.target.value)} />
                    <BsTelephoneFill className='icon' />
                </div>
                <div className='input-box'>
                    <input type='text' placeholder='Profession' required value={profession} onChange={(e) => setProfession(e.target.value)} />
                    <MdOutlineWork className='icon' />
                </div>
                <div className='input-box'>
                    <input type='text' placeholder='Gender' required value={gender} onChange={(e) => setGender(e.target.value)} />
                    <ImManWoman className='icon' />
                </div>
                <div className='input-box'>
                    <input type='password' placeholder='Password' required value={password} onChange={(e) => setPassword(e.target.value)} />
                    <FaLock className='icon' />
                </div>

                <button type='submit'>Sign Up</button>

                <div className='login-link'>
                    <p>Already have an account? <a href="/login">Login here</a></p>
                </div>
            </form>
        </div>
    )
}

export default Signup;
