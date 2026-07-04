import React from 'react';

const authHeader = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    };
};

const Service = (props) => {
    const [isForm, setIsForm] = React.useState(false);
    const [newService, setNewService] = React.useState(false);
    const [edit, setEdit] = React.useState(false);
    const [serviceId, setServiceId] = React.useState(0);
    const [serviceName, setServiceName] = React.useState('');
    const [duration, setDuration] = React.useState('');
    const [isActive, setIsActive] = React.useState(true);
    const [data, setData] = React.useState([]);
    const [refreshKey, setRefreshKey] = React.useState(0);

    const [bookingService, setBookingService] = React.useState(null);
    const [bookingDoctor, setBookingDoctor] = React.useState(null);
    const [selectedDate, setSelectedDate] = React.useState(new Date().toISOString().split('T')[0]);
    const [slots, setSlots] = React.useState([]);
    const [showPicker, setShowPicker] = React.useState(false);

    const resetForm = () => {
        setServiceId(0);
        setServiceName('');
        setDuration('');
        setIsActive(true);
        setNewService(false);
        setEdit(false);
        setIsForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!serviceName.trim() || !duration) {
            alert('Please fill in all fields');
            return;
        }

        const servicePayload = {
            service_name: serviceName,
            duration: Number(duration),
            is_active: isActive
        };

        try {
            let url = 'http://localhost:5000/services';
            let method = 'POST';

            if (edit) {
                url = `http://localhost:5000/services/${serviceId}`;
                method = 'PUT';
            }

            const response = await fetch(url, {
                method,
                headers: authHeader(),
                body: JSON.stringify(servicePayload)
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Unable to save service');
            }

            alert(result.message);
            setRefreshKey((key) => key + 1);
            resetForm();
        } catch (err) {
            console.error('Error saving service:', err);
            alert(err.message);
        }
    };

    const addService = () => {
        resetForm();
        setNewService(true);
        setIsForm(true);
    };

    const editService = (service) => {
        setEdit(true);
        setNewService(false);
        setServiceId(service.service_id);
        setServiceName(service.service_name || '');
        setDuration(service.duration || '');
        setIsActive(service.is_active ?? true);
        setIsForm(true);
    };

    const deleteServiceById = async (id) => {
        if (!window.confirm('Confirm deletion of this service?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/services/${id}`, {
                method: 'DELETE',
                headers: authHeader()
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Unable to delete service');
            }
            alert(result.message);
            setRefreshKey((key) => key + 1);
        } catch (err) {
            console.error('Error deleting service:', err);
            alert(err.message);
        }
    };

    const bookService = (service) => {
        setBookingService(service.service_id);
        setBookingDoctor(service.created_by);
        setShowPicker(true);
        fetchSlots(service.created_by, selectedDate);
    };

    const fetchSlots = async (doctorId, date) => {
        if (!doctorId) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/availability/${doctorId}/${date}`, {
                headers: authHeader()
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Unable to load availability');
            }
            setSlots(result);
        } catch (err) {
            console.error('Error fetching slots:', err);
            setSlots([]);
        }
    };

    const handleDateChange = (e) => {
        const nextDate = e.target.value;
        setSelectedDate(nextDate);
        fetchSlots(bookingDoctor, nextDate);
    };

    const confirmBooking = async (time) => {
        const appointment_date = `${selectedDate}T${time}:00`;

        try {
            const response = await fetch('http://localhost:5000/appointments', {
                method: 'POST',
                headers: authHeader(),
                body: JSON.stringify({
                    service_id: bookingService,
                    uid_doctor: bookingDoctor,
                    appointment_date
                })
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Booking failed');
            }
            alert(result.message);
            setShowPicker(false);
            fetchSlots(bookingDoctor, selectedDate);
        } catch (err) {
            console.error('Error booking:', err);
            alert(err.message);
        }
    };

    React.useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch('http://localhost:5000/services', {
                    headers: authHeader()
                });
                const result = await response.json();
                setData(result);
            } catch (err) {
                console.error('Error fetching services:', err);
            }
        };

        fetchServices();
    }, [refreshKey]);

    if (showPicker) {
        return (
            <div className="container mt-4">
                <h2>Pick a Time Slot</h2>
                <div className="mb-3">
                    <label className="form-label">Select Date:</label>
                    <input type="date" className="form-control" value={selectedDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={handleDateChange} />
                </div>
                <div className="d-flex flex-wrap gap-2 mt-3">
                    {slots.map(({ time, status }) => (
                        <button
                            key={time}
                            className={`btn ${status === 'booked' ? 'btn-secondary' : 'btn-outline-primary'}`}
                            disabled={status === 'booked'}
                            onClick={() => confirmBooking(time)}
                        >
                            {time} {status === 'booked' ? '(Taken)' : ''}
                        </button>
                    ))}
                </div>
                <button className="btn btn-secondary mt-4" onClick={() => setShowPicker(false)}>Back</button>
            </div>
        );
    }

    if (isForm) {
        return (
            <form className="service-form">
                <h2>{edit ? 'Edit Service' : 'Add Service'}</h2>
                <div className="form-group">
                    <label htmlFor="serviceName">Service Name:</label>
                    <input type="text" placeholder="Laser Eye Surgery" id="serviceName"
                        value={serviceName} onChange={(e) => setServiceName(e.target.value)} className="form-control" />
                </div>
                <div className="form-group">
                    <label htmlFor="duration">Duration in Minutes:</label>
                    <input type="number" placeholder="70" id="duration"
                        value={duration} onChange={(e) => setDuration(e.target.value)} className="form-control" />
                </div>
                <div className="form-group">
                    <label htmlFor="isActive">Is Active:</label>
                    <input type="checkbox" id="isActive" checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)} className="form-check-input" />
                </div>
                <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>
            </form>
        );
    }

    return (
        <div className="container">
            <headers className="headers">
                <h1 className="text-center">Services</h1>
                {props.isDoctor
                    ? <button className="btn btn-secondary mx-auto d-block" onClick={addService}>Add Service</button>
                    : <p className="text-center">We offer a variety of medical services to cater to your health needs.</p>}
            </headers>

            <div className="Service-list">
                {data && data.map((service) => (
                    service.is_active && (
                        <div key={service.service_id} className="service-card">
                            <div className="service-row">
                                <div className="service-details">
                                    <h3 className="service-name">{service.service_name}</h3>
                                    <p className="service-info"><strong>Duration:</strong> {service.duration} min</p>
                                </div>
                                {props.isDoctor
                                    ? <div>
                                        <button className="btn btn-primary me-3" onClick={() => editService(service)}>Edit Service</button>
                                        <button className="btn btn-danger" onClick={() => deleteServiceById(service.service_id)}>Delete Service</button>
                                    </div>
                                    : <button className="btn btn-primary" onClick={() => bookService(service)}>Book Service</button>
                                }
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
};

export default Service;
