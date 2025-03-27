import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DoctorFinder() {
    const [specialties, setSpecialties] = useState([]);
    const [insurances, setInsurances] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [selectedInsurance, setSelectedInsurance] = useState('');

    useEffect(() => {
        fetchFilters();
    }, []);

    const fetchFilters = async () => {
        try {
            const specialtyRes = await axios.get('/api/specialties');
            const insuranceRes = await axios.get('/api/insurances');
            setSpecialties(specialtyRes.data);
            setInsurances(insuranceRes.data);
        } catch (error) {
            console.error("Error fetching filters:", error);
        }
    };

    const fetchDoctors = async () => {
        try {
            const response = await axios.get('/api/doctors', {
                params: { specialty: selectedSpecialty, insurance: selectedInsurance }
            });
            setDoctors(response.data);
        } catch (error) {
            console.error("Error fetching doctors:", error);
        }
    };

    return (
        <div>
            <h2>Find a Doctor</h2>
            <div>
                <label>Specialty:</label>
                <select onChange={(e) => setSelectedSpecialty(e.target.value)}>
                    <option value="">All</option>
                    {specialties.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>

                <label>Insurance:</label>
                <select onChange={(e) => setSelectedInsurance(e.target.value)}>
                    <option value="">All</option>
                    {insurances.map((i) => (
                        <option key={i.id} value={i.id}>{i.name}</option>
                    ))}
                </select>

                <button onClick={fetchDoctors}>Search</button>
            </div>

            <h3>Results</h3>
            <ul>
                {doctors.map((doc) => (
                    <li key={doc.id}>
                        <h4>{doc.name}</h4>
                        <p>Specialty: {doc.specialty_name}</p>
                        <p>Insurance: {doc.insurance_name}</p>
                        <p>Rating: {doc.rating}</p>
                        <p>{doc.bio}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DoctorFinder;
