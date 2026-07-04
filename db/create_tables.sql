 
-- 1️⃣ Table: services  (renamed from "service" to match services.js queries)
CREATE TABLE IF NOT EXISTS services (
    service_id SERIAL PRIMARY KEY,
    service_name TEXT NOT NULL,
    duration INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES "users"(user_id) ON DELETE SET NULL
);

-- 2️⃣ Table: schedule_appointment
CREATE TABLE IF NOT EXISTS schedule_appointment (
    appointment_id SERIAL PRIMARY KEY,
    service_id INTEGER NOT NULL REFERENCES services(service_id) ON DELETE CASCADE,
    uid_doctor INTEGER REFERENCES "users"(user_id) ON DELETE SET NULL,
    id_patient INTEGER REFERENCES "users"(user_id) ON DELETE SET NULL,
    appointment_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'scheduled',
    -- Prevents two patients from booking the same doctor at the same time
    CONSTRAINT unique_doctor_slot UNIQUE (uid_doctor, appointment_date)
);

-- 3️⃣ Table: users  (renamed users_id → user_id to match user.js queries)
CREATE TABLE IF NOT EXISTS "users" (
    user_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT,
    contact_number TEXT UNIQUE,
    user_id INTEGER REFERENCES "users"(user_id) ON DELETE CASCADE,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
