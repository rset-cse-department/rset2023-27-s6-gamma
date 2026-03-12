import React from 'react';

const ModelComparison = ({ comparison }) => {
    if (!comparison) return null;

    return (
        <div className="section-title" style={{ paddingBottom: '20px' }}>
            Model Comparison
            <div style={{ marginTop: '20px' }}>
                <table style={{ width: '100%', fontSize: '15px', fontWeight: 'normal' }}>
                    <thead>
                        <tr>
                            <th>Model</th>
                            <th>Predicted AQI</th>
                            <th>Category</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comparison.map((row, idx) => (
                            <tr key={idx}>
                                <td>{row.model}</td>
                                <td>{row.predictedAqi}</td>
                                <td>{row.category}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ModelComparison;
