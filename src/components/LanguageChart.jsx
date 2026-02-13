import React from 'react';

const LANG_COLORS = {
    JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
    Java: '#b07219', Go: '#00ADD8', Rust: '#dea584', 'C++': '#f34b7d',
    C: '#555555', 'C#': '#178600', Ruby: '#701516', PHP: '#4F5D95',
    Swift: '#F05138', Kotlin: '#A97BFF', Dart: '#00B4AB', Shell: '#89e051',
    HTML: '#e34c26', CSS: '#563d7c', Vue: '#41b883', Svelte: '#ff3e00',
};

export default function LanguageChart({ languages }) {
    if (!languages || languages.length === 0) return null;

    return (
        <div className="glass-card">
            <div className="glass-card__header">
                <span className="glass-card__icon">🌐</span>
                <h3 className="glass-card__title glass-card__title--info">
                    Language Distribution
                </h3>
            </div>

            {/* Stacked bar */}
            <div
                style={{
                    display: 'flex',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    height: '14px',
                    marginBottom: '18px',
                    boxShadow: '0 0 15px rgba(255, 23, 68, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                }}
            >
                {languages.map((lang) => (
                    <div
                        key={lang.name}
                        title={`${lang.name}: ${lang.percentage}%`}
                        style={{
                            width: `${lang.percentage}%`,
                            backgroundColor: LANG_COLORS[lang.name] || '#8b8b8b',
                            minWidth: lang.percentage > 0 ? '3px' : 0,
                            transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)',
                            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.15)`,
                        }}
                    />
                ))}
            </div>

            {/* Legend */}
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px 20px',
                }}
            >
                {languages.map((lang) => (
                    <span
                        key={lang.name}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '0.8rem',
                            color: '#b09098',
                        }}
                    >
                        <span
                            style={{
                                width: '9px',
                                height: '9px',
                                borderRadius: '50%',
                                backgroundColor: LANG_COLORS[lang.name] || '#8b8b8b',
                                boxShadow: `0 0 6px ${LANG_COLORS[lang.name] || '#8b8b8b'}50`,
                                display: 'inline-block',
                            }}
                        />
                        {lang.name}
                        <span style={{ color: '#705058' }}>{lang.percentage}%</span>
                    </span>
                ))}
            </div>
        </div>
    );
}
