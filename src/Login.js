import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = (props) => {
    const nav = useNavigate();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [contactNumber, setContactNumber] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // POST with JSON body — credentials never go in the URL
        fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, contactNumber, password })
        })
            .then(response => response.json())
            .then(response => {
                if (!response.token) {
                    alert(response.message || 'Login failed');
                    return;
                }
                // Store token so all subsequent requests can attach it
                localStorage.setItem('token', response.token);
                props.setId(response.user_id);
                props.setIsDoctor(response.role === 'Doctor');
                nav('/');
            })
            .catch(error => console.error('Error logging in:', error));
    };

    return (
        <div className="container" style={{ maxWidth: 480, marginTop: '3.5rem' }}>
            <div className="card">
                <div className="card-body p-4">
                    <span className="hero-eyebrow">Welcome back</span>
                    <h3 className="mb-4">Log in</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="name">Name</label>
                            <input id="name" value={name} type="text"
                                onChange={(e) => setName(e.target.value)} className="form-control" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="contactNumber">WhatsApp Number</label>
                            <input id="contactNumber" value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)} className="form-control" />
                        </div>
                        <div className="mb-4">
                            <label className="form-label" htmlFor="password">Password</label>
                            <input id="password" value={password} type="password"
                                onChange={(e) => setPassword(e.target.value)} className="form-control" />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Log in</button>
                    </form>
                    <div className="text-center mt-3">
                        Don't have an account?{' '}
                        <button onClick={() => nav('/register')} className="btn btn-link p-0">Register</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;