

-- 1️⃣ Table: service
CREATE TABLE IF NOT EXISTS service (
    service_id SERIAL PRIMARY KEY,
    service_name TEXT NOT NULL,
    duration INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER
);

-- 2️⃣ Table: schedule_appointment
CREATE TABLE IF NOT EXISTS schedule_appointment (
    appointment_id SERIAL PRIMARY KEY,
    service_id INTEGER NOT NULL REFERENCES service(service_id) ON DELETE CASCADE,
    uid_doctor INTEGER,
    id_patient INTEGER,
    appointment_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status TEXT
);

-- 3️⃣ Table: "User"
CREATE TABLE IF NOT EXISTS "User" (
    user_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT,
    contact_number TEXT,
    password TEXT NOT NULL,
    role TEXT
);

-- 4️⃣ Table: notification_history
CREATE TABLE IF NOT EXISTS notification_history (
    notification_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "User"(user_id) ON DELETE CASCADE,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
