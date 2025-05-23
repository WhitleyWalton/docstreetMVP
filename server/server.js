// Import required modules
const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const app = express();
app.use(express.json());

// Serve static files from React build folder
app.use(express.static(path.join(__dirname, '../client/build')));

// ========================================================
// Authentication Routes using Supabase Auth
// ========================================================

// Registration endpoint using Supabase Auth
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    console.log(`Received registration request for email: ${email}`);

    // Email validation
    const emailPattern = /@(spelman\.edu|morehouse\.edu)$/;
    if (!emailPattern.test(email)) {
        console.log("Invalid email domain:", email);
        return res.status(400).json({ success: false, message: 'Email must end with @spelman.edu or @morehouse.edu.' });
    }

    try {
        // Register user in Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { name } } // Store additional user info
        });

        console.log("Supabase response data:", data);
        console.log("Supabase response error:", error);

        if (error) throw error;

        res.json({ success: true, message: 'Registration successful. Check your email for verification.' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: error.message || 'Error registering user' });
    }
});


// Login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(`Received login request for email: ${email}`);

    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        res.json({ success: true, message: 'Login successful', user: data.user });
    } catch (error) {
        console.error('Login error:', error);
        res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
});

// Email verification using 6-digit code
app.post('/verify', async (req, res) => {
    const { email, verificationCode } = req.body;
    console.log(`Verifying email: ${email} with code: ${verificationCode}`);

    try {
        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token: verificationCode,
            type: 'signup'
        });

        if (error) {
            console.error('Verification failed:', error);
            return res.status(400).json({ success: false, message: 'Invalid verification code.' });
        }

        res.json({ success: true, message: 'Email verified successfully' });
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ success: false, message: 'Error verifying email' });
    }
});

// Get list of specialties
app.get('/api/specialties', async (req, res) => {
    const { data, error } = await supabase.from('specialties').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Get list of insurances
app.get('/api/insurances', async (req, res) => {
    const { data, error } = await supabase.from('insurances').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Get list of doctors with filters
app.get('/api/doctors', async (req, res) => {
    const { specialty, insurance } = req.query;
    let query = supabase.from('doctors')
        .select('id, name, bio, rating, specialties(name) as specialty_name, insurances(name) as insurance_name')
        .leftJoin('specialties', 'specialties.id', 'doctors.specialty_id')
        .leftJoin('insurances', 'insurances.id', 'doctors.insurance_id');

    if (specialty) query = query.eq('specialty_id', specialty);
    if (insurance) query = query.eq('insurance_id', insurance);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Get user profile by authenticated user ID
app.get('/api/user-profile', async (req, res) => {
    const { user } = await supabase.auth.getUser();
    
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
});

// Fallback route to serve React frontend for any unmatched routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});