const pool = require('./db');

const getServices = async () => {
    try {
        return await pool.query('SELECT * FROM services ORDER BY service_id');
    } catch (err) {
        console.error('services.js getServices', err);
        throw new Error('Internal server error');
    }
};

const updateService = async (service, s_id, doctorId) => {
    try {
        const id = parseInt(s_id, 10);
        const { service_name, duration, is_active } = service;
        if (!service_name || typeof duration === 'undefined') {
            throw new Error('Service name and duration are required');
        }

        const query = `UPDATE services
                       SET service_name = $1,
                           duration = $2,
                           is_active = $3,
                           updated_at = CURRENT_TIMESTAMP
                       WHERE service_id = $4
                         AND created_by = $5`;
        const values = [service_name, duration, is_active, id, doctorId];
        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            throw new Error('Service not found or permission denied');
        }

        return 'Successfully updated';
    } catch (err) {
        console.error('services.js updateService', err);
        throw new Error(err.message || 'Internal server error');
    }
};

const addService = async (service, doctorId) => {
    try {
        const { service_name, duration, is_active } = service;
        if (!service_name || typeof duration === 'undefined') {
            throw new Error('Service name and duration are required');
        }

        const query = `INSERT INTO services (service_name, duration, is_active, created_by)
                       VALUES ($1, $2, $3, $4)`;
        const values = [service_name, duration, is_active ?? true, doctorId];
        await pool.query(query, values);
        return 'Successfully added';
    } catch (err) {
        console.error('services.js addService', err);
        throw new Error(err.message || 'Internal server error');
    }
};

const deleteService = async (s_id, doctorId) => {
    try {
        const id = parseInt(s_id, 10);
        const result = await pool.query('DELETE FROM services WHERE service_id = $1 AND created_by = $2', [id, doctorId]);
        if (result.rowCount === 0) {
            throw new Error('Service not found or permission denied');
        }
        return 'Success';
    } catch (err) {
        console.error('services.js deleteService', err);
        throw new Error(err.message || 'Internal server error');
    }
};

module.exports = { addService, getServices, deleteService, updateService };

