const bcrypt = require('bcryptjs'); // 'bcrypt' isn't installed — bcryptjs has the same hash/compare API
const pool = require('./db');

const addUser = async (data) => {
    const { username, contactNumber, password, location } = data;

    if (!username || !contactNumber || !password) {
        throw new Error('Name, contact number, and password are required');
    }

    const existing = await pool.query('SELECT user_id FROM users WHERE contact_number = $1', [contactNumber]);
    if (existing.rows.length) {
        throw new Error('Contact number already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO users (name, contact_number, password, role, address)
                   VALUES ($1, $2, $3, 'Patient', $4)
                   RETURNING user_id, role`;
    const values = [username, contactNumber, hashedPassword, location];

    const res = await pool.query(query, values);
    return [res.rows[0].user_id, res.rows[0].role];
};

const getUserByCredentials = async (name, contactNumber, plainPassword) => {
    if (!name || !contactNumber || !plainPassword) {
        throw new Error('Invalid credentials');
    }

    const query = `SELECT user_id, role, password FROM users
                   WHERE name = $1 AND contact_number = $2`;
    const res = await pool.query(query, [name, contactNumber]);

    if (res.rows.length === 0) {
        throw new Error('Invalid credentials');
    }

    const user = res.rows[0];
    const match = await bcrypt.compare(plainPassword, user.password);
    if (!match) {
        throw new Error('Invalid credentials');
    }

    return { user_id: user.user_id, role: user.role };
};

module.exports = { addUser, getUserByCredentials };