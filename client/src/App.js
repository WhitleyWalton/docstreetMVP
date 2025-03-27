import React, { useState, useEffect } from 'react';
import axios from 'axios';
import supabase from './supabaseClient';

const specialties = [
    "Family Medicine", "OBGYN", "Pediatrics", "Internal Medicine", 
    "Cardiology", "Dermatology", "Endocrinology", "Neurology", "Orthopedics"
];

const insurancePlans = [
    "Medicare", "Medicaid", "Blue Cross Blue Shield", "UnitedHealthcare",
    "Cigna", "Aetna", "Humana", "Kaiser Permanente", "Tricare"
];

function App() {
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [selectedInsurance, setSelectedInsurance] = useState('');
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        fetchDoctors();
    }, [selectedSpecialty, selectedInsurance]);

    const fetchDoctors = async () => {
        let query = supabase.from("doctors").select("*");

        if (selectedSpecialty) query = query.eq("specialty", selectedSpecialty);
        if (selectedInsurance) query = query.contains("insurance_accepted", [selectedInsurance]);

        const { data, error } = await query;
        if (error) console.error("Error fetching doctors:", error);
        else setDoctors(data);
    };

    return (
        <div className="App">
            <h1>Doc Street - Black Doctor Finder</h1>

            <label>Specialty:</label>
            <select value={selectedSpecialty} onChange={(e) => setSelectedSpecialty(e.target.value)}>
                <option value="">All Specialties</option>
                {specialties.map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                ))}
            </select>

            <label>Insurance:</label>
            <select value={selectedInsurance} onChange={(e) => setSelectedInsurance(e.target.value)}>
                <option value="">All Insurance Plans</option>
                {insurancePlans.map((ins) => (
                    <option key={ins} value={ins}>{ins}</option>
                ))}
            </select>

            <h2>Doctors</h2>
            <ul>
                {doctors.length > 0 ? (
                    doctors.map((doc) => (
                        <li key={doc.id}>
                            <strong>{doc.name}</strong> - {doc.specialty} <br />
                            Accepts: {doc.insurance_accepted.join(", ")}
                        </li>
                    ))
                ) : (
                    <p>No doctors found.</p>
                )}
            </ul>
        </div>
    );
}

export default App;
