import React, { useState } from 'react';
import './Login.css';
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import LogiImage from '../../../assets/land.jpg';

const API_URL = `http://localhost:8000`;

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("prince");
    const [password, setPassword] = useState("heisenberg");
    const [error, setError] = useState(null);

    function login(e) {
        e.preventDefault();

        let loginData = {
            identifier: username,
            password: password
        };

        fetch(`${API_URL}/api/accounts/login`, {
            body: JSON.stringify(loginData),
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST"
        })
        .then(async (response) => {
            if (response.status === 200) {
                let data = await response.json();
                console.log(`The data from the server:`, data);

                const { role } = data;
                switch (role) {
                    case 'land_surveyor':
                        navigate('/Landsurveyor');
                        break;
                    case 'land_registrar':
                        navigate('/Landregistrer');
                        break;
                    case 'land_buyer':
                        navigate('/landbuyer');
                        break;
                    case 'land_owner':
                        navigate('/Landowner');
                        break;
                    case 'notary':
                        navigate('/Notary');
                        break;
                    default:
                        navigate('/default-dashboard');
                }
            } else {
                setError('Login failed. Please check your credentials.');
            }
        })
        .catch(error => {
            setError('An error occurred. Please try again.');
        });
    }

    return (
        <>
        <div className="login-wrapper" style={{backgroundImage: `url(${LogiImage})`}}>
            <div className='wrapper1'>
                <form style={{background: 'transparent'}} onSubmit={login}>
                    <h1>Login</h1>
                    <div className='input-box'>
                        <input type='text' placeholder='Username' required value={username} onChange={(e) => setUsername(e.target.value)} />
                        <FaUser className='icon' />
                    </div>
                    <div className='input-box'>
                        <input type='password' placeholder='Password' required value={password} onChange={(e) => setPassword(e.target.value)} />
                        <FaLock className='icon' />
                    </div>

                    <div className="remember-forgot">
                        <label><input type="checkbox" />Remember me</label>
                        <a href='#'>Forgot password</a>
                    </div>

                    <button type='submit'>Login</button>

                    {error && <p>{error}</p>}

                    <div className='register-link'>
                        <p>Don't have an account?<a href="/signup">Register here</a></p>
                    </div>
                </form>
            </div>
        </div>
        </>
    );
};

export default Login;
