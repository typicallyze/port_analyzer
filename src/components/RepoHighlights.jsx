import React from 'react';

/* GitHub language colors (top languages) */
const LANG_COLORS = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    Java: '#b07219',
    Go: '#00ADD8',
    Rust: '#dea584',
    'C++': '#f34b7d',
    C: '#555555',
    'C#': '#178600',
    Ruby: '#701516',
    PHP: '#4F5D95',
    Swift: '#F05138',
    Kotlin: '#A97BFF',
    Dart: '#00B4AB',
    Shell: '#89e051',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Lua: '#000080',
    Scala: '#c22d40',
    R: '#198CE7',
    Elixir: '#6e4a7e',
    Haskell: '#5e5086',
    Vue: '#41b883',
    Svelte: '#ff3e00',
};

export default function RepoHighlights({ repos }) {
    if (!repos || repos.length === 0) return null;

    return (
        <div className="repo-highlights">
            <h3 className="repo-highlights__title">
                <span>⭐</span> Top Repositories
            </h3>
            <div className="repo-grid">
                {repos.map((repo) => (
                    <a
                        key={repo.id}
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="repo-card"
                    >
                        <div className="repo-card__name">{repo.name}</div>
                        <div className="repo-card__desc">
                            {repo.description || 'No description provided'}
                        </div>
                        <div className="repo-card__meta">
                            {repo.language && (
                                <span className="repo-card__meta-item">
                                    <span
                                        className="lang-dot"
                                        style={{
                                            backgroundColor:
                                                LANG_COLORS[repo.language] || '#8b8b8b',
                                        }}
                                    />
                                    {repo.language}
                                </span>
                            )}
                            <span className="repo-card__meta-item">
                                ⭐ {repo.stargazers_count || 0}
                            </span>
                            <span className="repo-card__meta-item">
                                🍴 {repo.forks_count || 0}
                            </span>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
