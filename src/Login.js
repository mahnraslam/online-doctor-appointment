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
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-lg rounded">
                        <div className="card-body p-4">
                            <h3 className="text-center mb-4">Login</h3>
                            <form>
                                <div className="row mb-3">
                                    <label className="col-sm-4 col-form-label" htmlFor="username">Name:</label>
                                    <div className="col-sm-8">
                                        <input id="name" value={name} style={{ backgroundColor: '#dfdadaff' }}
                                            type="text" onChange={(e) => setName(e.target.value)} className="form-control" />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label className="col-sm-4 col-form-label" htmlFor="contactNumber">WhatsApp Number</label>
                                    <div className="col-sm-8">
                                        <input id="contactNumber" value={contactNumber} style={{ backgroundColor: '#dfdadaff' }}
                                            onChange={(e) => setContactNumber(e.target.value)} className="form-control" />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label className="col-sm-4 col-form-label" htmlFor="password">Password:</label>
                                    <div className="col-sm-5">
                                        <input id="password" value={password} style={{ backgroundColor: '#dfdadaff' }}
                                            type="password" onChange={(e) => setPassword(e.target.value)} className="form-control" />
                                    </div>
                                </div>
                                <button className="m-3 btn btn-primary" onClick={handleSubmit}>Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
