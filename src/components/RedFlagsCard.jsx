import React from 'react';

export default function RedFlagsCard({ redFlags }) {
    if (!redFlags || redFlags.length === 0) return null;

    return (
        <div className="glass-card">
            <div className="glass-card__header">
                <span className="glass-card__icon">🚩</span>
                <h3 className="glass-card__title glass-card__title--danger">
                    Red Flags
                </h3>
            </div>
            <ul className="insight-list">
                {redFlags.map((f, i) => (
                    <li className="insight-item" key={i}>
                        <span className="insight-item__icon">⚠️</span>
                        <span>{f}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
