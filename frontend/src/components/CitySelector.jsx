import React from 'react';

const CitySelector = ({ cities, selectedCity, onCityChange, onPredict, loading }) => {
    return (
        <div className="controls">
            <div className="control-group">
                <label>Select City</label>
                <select 
                    value={selectedCity} 
                    onChange={(e) => onCityChange(e.target.value)}
                    disabled={loading}
                >
                    {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                </select>
            </div>
            <button 
                className="predict-btn" 
                onClick={onPredict}
                disabled={!selectedCity || loading}
            >
                {loading ? 'Predicting...' : 'Predict'}
            </button>
        </div>
    );
};

export default CitySelector;
