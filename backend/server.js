require('dotenv').config({ path: __dirname + '/.env' });

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { addService, getServices, deleteService, updateService } = require('./services');
const { addUser, getUserByCredentials } = require('./user');
const { createAppointment, getAppointmentsForUser, getDoctorAvailability } = require('./appointments');
const { authenticate, requireRole } = require('./middleware');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.get('/services', authenticate, async (req, res) => {
    try {
        const response = await getServices();
        res.json(response.rows);
    } catch (err) {
        console.error('GET /services', err);
        res.status(500).json({ message: 'Unable to load services' });
    }
});

app.delete('/services/:id', authenticate, requireRole('Doctor'), async (req, res) => {
    try {
        await deleteService(req.params.id, req.user.user_id);
        res.json({ message: 'Service deleted' });
    } catch (err) {
        console.error('DELETE /services/:id', err);
        res.status(404).json({ message: err.message });
    }
});

app.post('/services', authenticate, requireRole('Doctor'), async (req, res) => {
    try {
        await addService(req.body, req.user.user_id);
        res.status(201).json({ message: 'Service created' });
    } catch (err) {
        console.error('POST /services', err);
        res.status(400).json({ message: err.message });
    }
});
app.put('/services/:id', authenticate, requireRole('Doctor'), async (req, res) => {
    try {
        await updateService(req.body, req.params.id, req.user.user_id);
        res.json({ message: 'Service updated' });
    } catch (err) {
        console.error('PUT /services/:id', err);
        res.status(400).json({ message: err.message });
    }
});

app.post('/user', async (req, res) => {
    try {
        const [user_id, role] = await addUser(req.body);
        const token = jwt.sign({ user_id, role }, JWT_SECRET, { expiresIn: '2h' });
        res.status(201).json({ message: 'Successfully registered', token, user_id, role });
    } catch (err) {
        console.error('POST /user', err);
        res.status(400).json({ message: err.message });
    }
});

app.post('/login', async (req, res) => {
    const { name, contactNumber, password } = req.body;
    try {
        const { user_id, role } = await getUserByCredentials(name, contactNumber, password);
        const token = jwt.sign({ user_id, role }, JWT_SECRET, { expiresIn: '2h' });
        res.json({ message: 'Login successful', token, user_id, role });
    } catch (err) {
        console.error('POST /login', err);
        res.status(401).json({ message: err.message });
    }
});

app.post('/appointments', authenticate, requireRole('Patient'), async (req, res) => {
    const { service_id, uid_doctor, appointment_date } = req.body;
    try {
        const appointment = await createAppointment({ service_id, uid_doctor, id_patient: req.user.user_id, appointment_date });
        res.status(201).json({ message: 'Appointment booked', appointment });
    } catch (err) {
        console.error('POST /appointments', err);
        if (err.message && err.message.toLowerCase().includes('already booked')) {
            return res.status(409).json({ message: err.message });
        }
        res.status(400).json({ message: err.message });
    }
});

app.get('/appointments', authenticate, async (req, res) => {
    try {
        const appointments = await getAppointmentsForUser(req.user.user_id, req.user.role);
        res.json(appointments);
    } catch (err) {
        console.error('GET /appointments', err);
        res.status(500).json({ message: 'Unable to load appointments' });
    }
});

app.get('/availability/:doctorId/:date', authenticate, async (req, res) => {
    try {
        const slots = await getDoctorAvailability(req.params.doctorId, req.params.date);
        res.json(slots);
    } catch (err) {
        console.error('GET /availability/:doctorId/:date', err);
        res.status(400).json({ message: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});