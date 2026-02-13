import React from 'react';

export default function LoadingSkeleton() {
    return (
        <div className="loading-container">
            <div className="loading-header">
                <div className="loading-spinner" />
                <p className="loading-text">Analyzing GitHub profile…</p>
                <p className="loading-subtext">
                    Fetching repos, commits, languages & more
                </p>
            </div>

            <div className="skeleton-grid">
                <div className="skeleton-card">
                    <div className="skeleton-line skeleton-line--circle" />
                    <div className="skeleton-line skeleton-line--medium" />
                    <div className="skeleton-line skeleton-line--short" />
                </div>
                <div className="skeleton-card">
                    <div className="skeleton-line skeleton-line--long" />
                    <div className="skeleton-line skeleton-line--medium" />
                    <div className="skeleton-line skeleton-line--long" />
                    <div className="skeleton-line skeleton-line--short" />
                    <div className="skeleton-line skeleton-line--medium" />
                </div>
                <div className="skeleton-card">
                    <div className="skeleton-line skeleton-line--medium" />
                    <div className="skeleton-line skeleton-line--long" />
                    <div className="skeleton-line skeleton-line--short" />
                    <div className="skeleton-line skeleton-line--medium" />
                </div>
            </div>
        </div>
    );
}
