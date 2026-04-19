import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import CitySelector from './components/CitySelector';
import KpiCards from './components/KpiCards';
import TrendGraph from './components/TrendGraph';
import ModelComparison from './components/ModelComparison';
import HealthAnalysis from './components/HealthAnalysis';
import './index.css';

const API_BASE_URL = 'http://127.0.0.1:8000'; // FastAPI dev server

function App() {
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [predictionData, setPredictionData] = useState(null);

    useEffect(() => {
        // Fetch cities on load
        const fetchCities = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/cities`);
                setCities(response.data.cities);
            } catch (err) {
                console.error('Failed to fetch cities:', err);
                setError('Failed to connect to backend server. Is FastAPI running on port 8000?');
            }
        };

        fetchCities();
    }, []);

    const handlePredict = async () => {
        if (!selectedCity) return;

        setLoading(true);
        setError(null);
        setPredictionData(null);

        try {
            const response = await axios.post(`${API_BASE_URL}/api/predict`, {
                city: selectedCity
            });
            setPredictionData(response.data);
        } catch (err) {
            console.error('Prediction failed:', err);
            setError(err.response?.data?.detail || 'An error occurred during prediction.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container">
            <Header />

            {error && <div className="error-msg">{error}</div>}

            <CitySelector
                cities={cities}
                selectedCity={selectedCity}
                onCityChange={setSelectedCity}
                onPredict={handlePredict}
                loading={loading}
            />

            {predictionData ? (
                <div style={{ animation: 'fadeIn 0.5s ease-in' }}>
                    <KpiCards kpis={predictionData.kpis} />
                    <TrendGraph trends={predictionData.trends} />
                    <ModelComparison comparison={predictionData.comparison} />
                    <HealthAnalysis analysis={predictionData.healthAnalysis} />
                </div>
            ) : null}
        </div>
    );
}

export default App;
