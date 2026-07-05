import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const Register = (props) => {
    const nav = useNavigate();
    const handleLogin = () => nav('/login');

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        // role field is intentionally NOT sent — server hardcodes 'Patient'
        fetch('http://localhost:5000/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(response => {
                if (!response.token) {
                    alert(response.message || 'Registration failed');
                    return;
                }
                localStorage.setItem('token', response.token);
                props.setId(response.user_id);
                props.setIsDoctor(response.role === 'Doctor');
                alert(response.message);
                nav('/');
            })
            .catch(error => console.error('Error registering:', error));
    };

    return (
        <div className="container" style={{ maxWidth: 480, marginTop: '2rem' }}>
            <div className="card">
                <div className="card-body p-4">
                    <span className="hero-eyebrow">New here?</span>
                    <h3 className="mb-4">Create your account</h3>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="username">Name</label>
                            <input type="text" id="username"
                                {...register('username', { required: 'Name is required', minLength: { value: 3, message: 'Name is too short' } })}
                                className="form-control" />
                            {errors.username && <p className="text-danger">{errors.username.message}</p>}
                        </div>

                        <div className="mb-3">
                            <label className="form-label" htmlFor="contactNumber">WhatsApp Number</label>
                            <input type="tel" id="contactNumber" placeholder="0302-1111111"
                                {...register('contactNumber', {
                                    required: 'Contact number is required',
                                    pattern: { value: /^0\d{3}-?\d{7}$/, message: 'Invalid number' }
                                })}
                                className="form-control" />
                            {errors.contactNumber && <p className="text-danger">{errors.contactNumber.message}</p>}
                        </div>

                        <div className="mb-3">
                            <label className="form-label" htmlFor="password">Password</label>
                            <input type="password" id="password"
                                {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'At least 8 characters required' } })}
                                className="form-control" />
                            {errors.password && <p className="text-danger">{errors.password.message}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="form-label" htmlFor="location">Location</label>
                            <input id="location" placeholder="479 Model Town Lahore"
                                {...register('location')}
                                className="form-control" />
                        </div>

                        {/* Role radio buttons removed — all registrations are Patient.
                            Doctor accounts are seeded directly in the database. */}

                        <button type="submit" className="btn btn-primary w-100">Register as patient</button>
                    </form>

                    <div className="text-center mt-3">
                        Already have an account?{' '}
                        <button onClick={handleLogin} className="btn btn-link p-0">Log in</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;