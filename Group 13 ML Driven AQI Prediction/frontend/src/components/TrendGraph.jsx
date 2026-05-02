import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TrendGraph = ({ trends }) => {
    if (!trends) return null;

    // Transform the dictionary of arrays into an array of objects for Recharts
    const data = trends.days.map((day, index) => ({
        day: `Day ${day}`,
        LSTM: trends.lstm[index],
        GRU: trends.gru[index],
        'Random Forest': trends.rf[index],
        XGBoost: trends.xgb[index],
        'Linear Regression': trends.lin[index],
        SVM: trends.svm[index]
    }));

    return (
        <div className="section-title" style={{ paddingBottom: '20px' }}>
            AQI Prediction Trend (All Models)
            <div className="graph-container" style={{ height: '450px', marginTop: '20px', fontWeight: 'normal' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="day" stroke="#64748b" />
                        <YAxis 
                            stroke="#64748b" 
                            domain={[0, 'auto']}
                            label={{ value: 'AQI Value', angle: -90, position: 'insideLeft', fill: '#64748b', dy: 40 }} 
                        />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            itemStyle={{ color: '#1e293b', fontWeight: '500' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Line type="monotone" dataKey="LSTM" stroke="#3b82f6" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="GRU" stroke="#ef4444" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="Random Forest" stroke="#10b981" />
                        <Line type="monotone" dataKey="XGBoost" stroke="#f59e0b" />
                        <Line type="monotone" dataKey="Linear Regression" stroke="#8b5cf6" />
                        <Line type="monotone" dataKey="SVM" stroke="#ec4899" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TrendGraph;
