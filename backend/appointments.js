
const pool = require('./db');

const createAppointment = async (data) => {
    const { service_id, uid_doctor, id_patient, appointment_date } = data;
    if (!service_id || !uid_doctor || !id_patient || !appointment_date) {
        throw new Error('service_id, uid_doctor, and appointment_date are required');
    }

    try {
        const query = `INSERT INTO schedule_appointment (service_id, uid_doctor, id_patient, appointment_date, status)
                       VALUES ($1, $2, $3, $4, $5)
                       RETURNING *`;
        const values = [service_id, uid_doctor, id_patient, appointment_date, 'scheduled'];
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (err) {
        console.error('appointments.js createAppointment', err);
        if (err.code === '23505') {
            throw new Error('Selected time slot is already booked');
        }
        throw new Error(err.message || 'Unable to book appointment');
    }
};

const getAppointmentsForUser = async (user_id, role) => {
    try {
        const query = role === 'Doctor'
            ? `SELECT sa.*, s.service_name, s.duration
               FROM schedule_appointment sa
               JOIN services s ON sa.service_id = s.service_id
               WHERE sa.uid_doctor = $1
               ORDER BY sa.appointment_date`
            : `SELECT sa.*, s.service_name, s.duration
               FROM schedule_appointment sa
               JOIN services s ON sa.service_id = s.service_id
               WHERE sa.id_patient = $1
               ORDER BY sa.appointment_date`;

        const res = await pool.query(query, [user_id]);
        return res.rows;
    } catch (err) {
        console.error('appointments.js getAppointmentsForUser', err);
        throw new Error('Internal server error');
    }
};

// Pure function — no DB access. Generates every 30-min slot from 09:00-17:00 (16 slots/day).
function generateDaySlots(date) {
    const slots = [];
    let current = new Date(`${date}T09:00:00`);
    const end = new Date(`${date}T17:00:00`);
    while (current < end) {
        slots.push(current.toTimeString().slice(0, 5)); // "09:00", "09:30", ...
        current = new Date(current.getTime() + 30 * 60000);
    }
    return slots;
}

const getDoctorAvailability = async (doctorId, date) => {
    if (!doctorId || !date) {
        throw new Error('Doctor ID and date are required');
    }

    const startOfDay = `${date} 00:00:00`;
    const endOfDay = `${date} 23:59:59`;

    try {
        const query = `SELECT TO_CHAR(appointment_date, 'HH24:MI') AS time
                       FROM schedule_appointment
                       WHERE uid_doctor = $1
                         AND appointment_date BETWEEN $2 AND $3`;
        const res = await pool.query(query, [doctorId, startOfDay, endOfDay]);
        const bookedTimes = new Set(res.rows.map(row => row.time));

        // Merge generated slots with booked times from the DB
        return generateDaySlots(date).map(time => ({
            time,
            status: bookedTimes.has(time) ? 'booked' : 'available'
        }));
    } catch (err) {
        console.error('appointments.js getDoctorAvailability', err);
        throw new Error('Unable to load availability');
    }
};

module.exports = { createAppointment, getAppointmentsForUser, getDoctorAvailability, generateDaySlots };
