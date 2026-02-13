import React from 'react';

export default function StrengthsCard({ strengths }) {
    if (!strengths || strengths.length === 0) return null;

    return (
        <div className="glass-card">
            <div className="glass-card__header">
                <span className="glass-card__icon">💪</span>
                <h3 className="glass-card__title glass-card__title--success">
                    Strengths
                </h3>
            </div>
            <ul className="insight-list">
                {strengths.map((s, i) => (
                    <li className="insight-item" key={i}>
                        <span className="insight-item__icon">✅</span>
                        <span>{s}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
