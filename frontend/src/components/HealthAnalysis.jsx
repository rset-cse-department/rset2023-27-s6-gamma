import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    LabelList
} from 'recharts';

const HealthAnalysis = ({ analysis }) => {

    if (!analysis) return null;

    const { dangerousPollutants, identifiedRisks } = analysis;

    return (

        <div className="section-title" style={{ paddingBottom: '20px' }}>

            Health Risk Analysis

            {/* HEALTH GRID */}

            <div
                className="health-grid"
                style={{ marginTop: '20px', fontWeight: 'normal' }}
            >

                {/* POLLUTANT TABLE */}

                <div className="health-box">

                    <h3 className="health-title">
                        Pollutants Above Safe Limits
                    </h3>

                    {dangerousPollutants.length > 0 ? (

                        <table>

                            <thead>
                                <tr>
                                    <th>Pollutant</th>
                                    <th>Level</th>
                                </tr>
                            </thead>

                            <tbody>

                                {dangerousPollutants.map((p, idx) => (

                                    <tr key={idx}>
                                        <td>{p.pollutant}</td>
                                        <td>{p.level}</td>
                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    ) : (

                        <div className="success-msg">
                            All pollutant levels are within safe limits.
                        </div>

                    )}

                </div>

                {/* HEALTH EFFECTS */}

                <div className="health-box">

                    <h3 className="health-title">
                        Possible Health Effects
                    </h3>

                    {identifiedRisks.length > 0 ? (

                        <div className="effects-grid">

                            {identifiedRisks.map((risk, idx) => (

                                <div key={idx} className="effect-item">

                                    <span className="effect-icon">⚠</span>

                                    <span className="effect-text">
                                        {risk}
                                    </span>

                                </div>

                            ))}

                        </div>

                    ) : (

                        <div className="success-msg">
                            No major health risks detected based on pollutant levels.
                        </div>

                    )}

                </div>

            </div>

            {/* BAR CHART SECTION */}

            <h3
                style={{
                    marginTop: '30px',
                    marginBottom: '15px'
                }}
            >
                High Pollutant Levels
            </h3>

            {dangerousPollutants.length > 0 ? (

                <div
                    className="graph-container"
                    style={{ height: '400px', fontWeight: 'normal' }}
                >

                    <ResponsiveContainer width="100%" height="100%">

                        <BarChart
                            data={dangerousPollutants}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >

                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis dataKey="pollutant" />

                            <YAxis
                                label={{
                                    value: 'Concentration Level',
                                    angle: -90,
                                    position: 'insideLeft',
                                    dy: 40
                                }}
                            />

                            <Tooltip />

                            <Bar
                                dataKey="level"
                                fill="#ef4444"
                                radius={[6, 6, 0, 0]}
                            >

                                {dangerousPollutants.map((entry, index) => (

                                    <Cell key={`cell-${index}`} fill="#ef4444" />

                                ))}

                                <LabelList
                                    dataKey="level"
                                    position="top"
                                />

                            </Bar>

                        </BarChart>

                    </ResponsiveContainer>

                </div>

            ) : (

                <div
                    className="success-msg"
                    style={{ marginTop: '10px' }}
                >
                    No pollutants exceed safe limits.
                </div>

            )}

        </div>

    );

};

export default HealthAnalysis;