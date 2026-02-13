import React from 'react';

export default function Header() {
    return (
        <header className="header">
            <div className="header__icon">📊</div>
            <h1 className="header__title">GitHub Portfolio Analyzer</h1>
            <p className="header__subtitle">
                Get an objective portfolio score, uncover strengths &amp; red flags, and
                receive actionable recommendations — from a recruiter's perspective.
            </p>
        </header>
    );
}
