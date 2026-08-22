const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// In-memory data store with initial sample entries
let patients = [
    { id: 1, name: 'Ramesh Kumar', age: 45, location: 'East Sector', symptoms: 'High fever, severe fatigue', temperature: 39.1, heartRate: 112, riskLevel: 'High', timestamp: '2026-06-06 10:30 AM' },
    { id: 2, name: 'Lakshmi Devi', age: 32, location: 'North Village', symptoms: 'Mild cough', temperature: 37.0, heartRate: 78, riskLevel: 'Low', timestamp: '2026-06-06 11:15 AM' }
];

app.post('/api/patients', (req, res) => {
    const { name, age, symptoms, temperature, heartRate, location } = req.body;
    
    // Risk Engine Rule
    let riskLevel = 'Low';
    if (temperature > 38.5 || heartRate > 110 || symptoms.toLowerCase().includes('severe')) {
        riskLevel = 'High';
    } else if (temperature > 37.5 || heartRate > 95) {
        riskLevel = 'Moderate';
    }

    const newPatient = {
        id: Date.now(),
        name,
        age,
        symptoms,
        temperature,
        heartRate,
        location,
        riskLevel,
        timestamp: new Date().toLocaleString()
    };

    patients.unshift(newPatient);
    res.status(201).json({ message: 'Success', data: newPatient });
});

app.get('/api/patients', (req, res) => {
    res.json(patients);
});

app.get('/api/stats', (req, res) => {
    res.json({
        total: patients.length,
        highRisk: patients.filter(p => p.riskLevel === 'High').length
    });
});

app.listen(PORT, () => {
    console.log(`Server running smoothly at http://localhost:${PORT}`);
});

