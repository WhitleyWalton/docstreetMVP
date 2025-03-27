-- Table for storing user profiles, separate from Supabase auth.users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Matches Supabase Auth user ID
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Specialties table
CREATE TABLE specialties (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

-- Insurances table
CREATE TABLE insurances (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

-- Doctors table
CREATE TABLE doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    specialty_id INT REFERENCES specialties(id) ON DELETE SET NULL,
    insurance_id INT REFERENCES insurances(id) ON DELETE SET NULL,
    location TEXT NOT NULL,
    phone TEXT,
    email TEXT UNIQUE,
    rating FLOAT DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    bio TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile"
ON users
FOR SELECT
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
ON users
FOR UPDATE
USING (auth.uid() = id);
