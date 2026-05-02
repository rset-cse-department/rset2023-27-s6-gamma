import React from 'react';

const KpiCards = ({ kpis }) => {
    if (!kpis) return null;

    const { predictedAqi, category, trend, dominantPollutant, color } = kpis;

    return (
        <>
            <hr style={{ borderColor: '#374151', margin: '30px 0' }} />
            <div className="card-grid">
                <div className="card" style={{ backgroundColor: color }}>
                    <p>Predicted AQI</p>
                    <h2>{predictedAqi}</h2>
                    {category}
                </div>
                <div className="card" style={{ backgroundColor: color }}>
                    <p>AQI Trend</p>
                    <h2>{trend}</h2>
                </div>
                <div className="card" style={{ backgroundColor: color }}>
                    <p>Dominant Pollutant</p>
                    <h2>{dominantPollutant}</h2>
                </div>
                <div className="card" style={{ backgroundColor: color }}>
                    <p>Health Risk</p>
                    <h2>{category}</h2>
                </div>
            </div>
        </>
    );
};

export default KpiCards;
