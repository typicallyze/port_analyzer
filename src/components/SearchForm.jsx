import React, { useState } from 'react';

export default function SearchForm({ onAnalyze, isLoading }) {
    const [input, setInput] = useState('');
    const [showToken, setShowToken] = useState(false);
    const [token, setToken] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            onAnalyze(input.trim(), token.trim());
        }
    };

    return (
        <>
            <form className="search-form" onSubmit={handleSubmit}>
                <div className="search-form__input-wrapper">
                    <span className="search-form__icon">🔍</span>
                    <input
                        id="github-input"
                        type="text"
                        className="search-form__input"
                        placeholder="Enter GitHub username or profile URL..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                        autoFocus
                    />
                </div>
                <button
                    id="analyze-btn"
                    type="submit"
                    className="search-form__btn"
                    disabled={isLoading || !input.trim()}
                >
                    {isLoading ? 'Analyzing…' : 'Analyze'}
                </button>
            </form>

            <div className="token-section">
                <button
                    type="button"
                    className="token-toggle"
                    onClick={() => setShowToken(!showToken)}
                >
                    🔑 {showToken ? 'Hide' : 'Add'} GitHub Token (optional)
                </button>

                {showToken && (
                    <div className="token-input-wrapper">
                        <input
                            id="token-input"
                            type="password"
                            className="token-input"
                            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                        />
                        <p className="token-hint">
                            A personal access token increases the API rate limit from 60 to
                            5,000 requests/hour. No scopes required.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}
