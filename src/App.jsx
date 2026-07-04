import './App.css';
import Home from './Home.js';
import Service from './Service.js';
import Appointments from './Appointments.js';
import Contact from './Contact.js';
import Register from './Register.js';
import Login from './Login.js';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

function App() {
    const [isDoctor, setIsDoctor] = useState(false);
    const [id, setId] = useState(0);

    // On mount: read the stored token and re-derive id/isDoctor
    // This keeps the user "logged in" across page refreshes
    // Decoding is safe here because the server always re-verifies the signature on each request
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // JWT payload is Base64-encoded in the second segment
                const payload = JSON.parse(atob(token.split('.')[1]));
                // Check the token hasn't expired (exp is in seconds)
                if (payload.exp * 1000 > Date.now()) {
                    setId(payload.user_id);
                    setIsDoctor(payload.role === 'Doctor');
                } else {
                    // Token expired — clear it so the user sees Sign In again
                    localStorage.removeItem('token');
                }
            } catch (e) {
                localStorage.removeItem('token');
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setId(0);
        setIsDoctor(false);
    };

    return (
        <BrowserRouter>
            <h1 className="App-header">Online Doctor Appointment</h1>
            <nav className="d-flex justify-content-end">
                <Link to="/"><button className="btn btn-secondary mt-2 me-2 mb-0">Home</button></Link>
                <Link to="/service"><button className="btn btn-secondary mt-2 me-2 mb-0">Service</button></Link>
                <Link to="/appointments"><button className="btn btn-secondary mt-2 me-2 mb-0">Appointment</button></Link>
                <Link to="/contact"><button className="btn btn-secondary mt-2 me-2 mb-0">Contact Us</button></Link>
                {!id
                    ? <Link to="/register"><button className="btn btn-secondary mt-2 me-2 mb-0">Sign In</button></Link>
                    : <button className="btn btn-outline-secondary mt-2 me-2 mb-0" onClick={handleLogout}>Logout</button>
                }
            </nav>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/service" element={<Service isDoctor={isDoctor} d_id={id} />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login setId={setId} setIsDoctor={setIsDoctor} />} />
                <Route path="/register" element={<Register setId={setId} setIsDoctor={setIsDoctor} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
