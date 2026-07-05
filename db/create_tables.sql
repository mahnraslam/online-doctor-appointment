-- 1️⃣ Table: users
CREATE TABLE IF NOT EXISTS "users" (
    user_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT,
    contact_number TEXT UNIQUE,
    password TEXT NOT NULL,          -- bcrypt hash, never plaintext
    role TEXT NOT NULL DEFAULT 'Patient',  -- 'Patient' | 'Doctor' — set by the server, never by the client
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2️⃣ Table: services  (renamed from "service" to match services.js queries)
CREATE TABLE IF NOT EXISTS services (
    service_id SERIAL PRIMARY KEY,
    service_name TEXT NOT NULL,
    duration INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES "users"(user_id) ON DELETE SET NULL
);

-- 3️⃣ Table: schedule_appointment
CREATE TABLE IF NOT EXISTS schedule_appointment (
    appointment_id SERIAL PRIMARY KEY,
    service_id INTEGER NOT NULL REFERENCES services(service_id) ON DELETE CASCADE,
    uid_doctor INTEGER REFERENCES "users"(user_id) ON DELETE SET NULL,
    id_patient INTEGER REFERENCES "users"(user_id) ON DELETE SET NULL,
    appointment_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'scheduled', 
    CONSTRAINT unique_doctor_slot UNIQUE (uid_doctor, appointment_date)
);

-- 4️⃣ Table: notification_history
CREATE TABLE IF NOT EXISTS notification_history (
    notification_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "users"(user_id) ON DELETE CASCADE,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 
INSERT INTO "users" (name, contact_number, address, password, role)
VALUES (
    'Dr. Ayesha Khan',
    '0300-1234567',
    '123 Clinic Road, Lahore',
    '$2b$10$4mhcjh8Qj3FTr5VZ91b3We93csj4d/2Ddz0Gapvcd7mnuTybFg3Da',
    'Doctor'
)
ON CONFLICT (contact_number) DO NOTHING;
