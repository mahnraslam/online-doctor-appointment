import './App.css';
import Home from './Home.js';
import Service from './Service.js';
import Appointments from './Appointments.js';
import Contact from './Contact.js';
import Register from './Register.js';
import Login from './Login.js';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

// Redirects to /login instead of rendering a page that will 401 and crash
const RequireAuth = ({ id, children }) => {
    return id ? children : <Navigate to="/login" replace />;
};

// Styles the active route's link differently so users can see where they are
const navLinkClass = ({ isActive }) => `nav-link px-3 ${isActive ? 'active' : ''}`;

function App() {
    const [isDoctor, setIsDoctor] = useState(false);
    const [id, setId] = useState(0);
    const [navOpen, setNavOpen] = useState(false); // mobile menu toggle

    // On mount: read the stored token and re-derive id/isDoctor
    // This keeps the user "logged in" across page refreshes
    // Decoding is safe here because the server always re-verifies the signature on each request
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                if (payload.exp * 1000 > Date.now()) {
                    setId(payload.user_id);
                    setIsDoctor(payload.role === 'Doctor');
                } else {
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

    const closeNav = () => setNavOpen(false);

    return (
        <BrowserRouter>
            <nav className="navbar navbar-expand-lg navbar-light App-header sticky-top">
                <div className="container-fluid">
                    <NavLink to="/" className="navbar-brand brand-mark" onClick={closeNav}>
                        <span className="brand-dot" aria-hidden="true"></span>
                        Online Doctor Appointment
                    </NavLink>
                    <button
                        className="navbar-toggler"
                        type="button"
                        onClick={() => setNavOpen(open => !open)}
                        aria-expanded={navOpen}
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className={`collapse navbar-collapse ${navOpen ? 'show' : ''}`}>
                        <ul className="navbar-nav ms-auto align-items-lg-center">
                            <li className="nav-item"><NavLink to="/" className={navLinkClass} onClick={closeNav}>Home</NavLink></li>
                            <li className="nav-item"><NavLink to="/service" className={navLinkClass} onClick={closeNav}>Services</NavLink></li>
                            <li className="nav-item"><NavLink to="/appointments" className={navLinkClass} onClick={closeNav}>Appointments</NavLink></li>
                            <li className="nav-item"><NavLink to="/contact" className={navLinkClass} onClick={closeNav}>Contact Us</NavLink></li>
                            <li className="nav-item ms-lg-3 mt-2 mt-lg-0">
                                {!id
                                    ? <NavLink to="/login" className="btn btn-light btn-sm" onClick={closeNav}>Sign In</NavLink>
                                    : <button className="btn btn-outline-light btn-sm" onClick={() => { handleLogout(); closeNav(); }}>Logout</button>
                                }
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/service" element={
                    <RequireAuth id={id}><Service isDoctor={isDoctor} d_id={id} /></RequireAuth>
                } />
                <Route path="/appointments" element={
                    <RequireAuth id={id}><Appointments /></RequireAuth>
                } />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login setId={setId} setIsDoctor={setIsDoctor} />} />
                <Route path="/register" element={<Register setId={setId} setIsDoctor={setIsDoctor} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;