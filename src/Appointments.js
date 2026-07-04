import React, { useEffect, useState } from 'react';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('http://localhost:5000/appointments', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(r => r.json())
            .then(data => {
                if (data.message) {
                    setError(data.message);
                } else {
                    setAppointments(data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching appointments:', err);
                setError('Could not load appointments.');
                setLoading(false);
            });
    }, []);

    if (loading) return <p className="text-center mt-4">Loading appointments...</p>;
    if (error) return <p className="text-center text-danger mt-4">{error}</p>;

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">My Appointments</h2>

            {appointments.length === 0
                ? <p className="text-center">No appointments found.</p>
                : (
                    <table className="table table-bordered table-hover">
                        <thead className="table-light">
                            <tr>
                                <th>#</th>
                                <th>Service</th>
                                <th>Duration (min)</th>
                                <th>Date & Time</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((appt, i) => (
                                <tr key={appt.appointment_id}>
                                    <td>{i + 1}</td>
                                    <td>{appt.service_name}</td>
                                    <td>{appt.duration}</td>
                                    <td>{new Date(appt.appointment_date).toLocaleString()}</td>
                                    <td>
                                        <span className={`badge ${appt.status === 'pending' ? 'bg-warning text-dark' : 'bg-success'}`}>
                                            {appt.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )
            }
        </div>
    );
};

export default Appointments;
