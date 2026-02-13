import React, { useEffect, useState } from 'react';

const CIRCUMFERENCE = 2 * Math.PI * 68; // radius = 68

export default function ScoreRing({ score, grade }) {
    const [displayScore, setDisplayScore] = useState(0);
    const [offset, setOffset] = useState(CIRCUMFERENCE);

    useEffect(() => {
        // Animate offset
        const target = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;
        const timer = setTimeout(() => setOffset(target), 100);

        // Animate counter
        let frame;
        let start = null;
        const duration = 1600;

        const animate = (ts) => {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayScore(Math.round(eased * score));
            if (progress < 1) {
                frame = requestAnimationFrame(animate);
            }
        };

        frame = requestAnimationFrame(animate);

        return () => {
            clearTimeout(timer);
            cancelAnimationFrame(frame);
        };
    }, [score]);

    // Red-themed color stops
    const strokeColor =
        score >= 75
            ? '#10b981'
            : score >= 50
                ? '#fbbf24'
                : score >= 30
                    ? '#fb923c'
                    : '#ff1744';

    const glowColor =
        score >= 75
            ? 'rgba(16, 185, 129, 0.3)'
            : score >= 50
                ? 'rgba(251, 191, 36, 0.3)'
                : score >= 30
                    ? 'rgba(251, 146, 60, 0.3)'
                    : 'rgba(255, 23, 68, 0.3)';

    return (
        <div className="score-ring-wrapper">
            <div className="score-ring" style={{ filter: `drop-shadow(0 0 25px ${glowColor})` }}>
                <svg viewBox="0 0 160 160">
                    <defs>
                        <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={strokeColor} />
                            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.4" />
                        </linearGradient>
                    </defs>
                    <circle cx="80" cy="80" r="68" className="score-ring__bg" />
                    <circle
                        cx="80"
                        cy="80"
                        r="68"
                        className="score-ring__progress"
                        stroke="url(#ring-grad)"
                        strokeDasharray={CIRCUMFERENCE}
                        strokeDashoffset={offset}
                    />
                </svg>
                <div className="score-ring__value">
                    <span
                        className="score-ring__number"
                        style={{ color: strokeColor, textShadow: `0 0 30px ${glowColor}` }}
                    >
                        {displayScore}
                    </span>
                    <span className="score-ring__label">Portfolio Score</span>
                    <span
                        className="score-ring__grade"
                        style={{ color: grade.color, textShadow: `0 0 12px ${grade.color}` }}
                    >
                        {grade.letter}
                    </span>
                </div>
            </div>
        </div>
    );
}
