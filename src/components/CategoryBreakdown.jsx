import React from 'react';

export default function CategoryBreakdown({ categories }) {
    const barColor = (score) => {
        if (score >= 75) return 'linear-gradient(90deg, #10b981, #34d399)';
        if (score >= 50) return 'linear-gradient(90deg, #f59e0b, #fbbf24)';
        if (score >= 30) return 'linear-gradient(90deg, #fb923c, #fdba74)';
        return 'linear-gradient(90deg, #ff1744, #ff4d6d)';
    };

    const glowColor = (score) => {
        if (score >= 75) return 'rgba(16, 185, 129, 0.25)';
        if (score >= 50) return 'rgba(245, 158, 11, 0.25)';
        if (score >= 30) return 'rgba(251, 146, 60, 0.25)';
        return 'rgba(255, 23, 68, 0.25)';
    };

    return (
        <div className="categories">
            {categories.map((cat, i) => (
                <div
                    className="category"
                    key={cat.key}
                    style={{ animation: `fadeInLeft 0.4s ease ${0.1 + i * 0.06}s both` }}
                >
                    <span className="category__name">{cat.label}</span>
                    <div className="category__bar-bg">
                        <div
                            className="category__bar-fill"
                            style={{
                                width: `${cat.score}%`,
                                background: barColor(cat.score),
                                boxShadow: `0 0 10px ${glowColor(cat.score)}`,
                            }}
                        />
                    </div>
                    <span className="category__score">{cat.score}</span>
                </div>
            ))}
        </div>
    );
}
