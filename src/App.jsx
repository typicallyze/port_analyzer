import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import ProfileHeader from './components/ProfileHeader';
import ScoreRing from './components/ScoreRing';
import CategoryBreakdown from './components/CategoryBreakdown';
import StrengthsCard from './components/StrengthsCard';
import RedFlagsCard from './components/RedFlagsCard';
import RecommendationsCard from './components/RecommendationsCard';
import RepoHighlights from './components/RepoHighlights';
import LanguageChart from './components/LanguageChart';
import LoadingSkeleton from './components/LoadingSkeleton';
import ErrorMessage from './components/ErrorMessage';

import { fetchAllProfileData, parseUsername, setToken } from './services/github';
import { analyzeProfile } from './utils/analyzer';

export default function App() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [profileData, setProfileData] = useState(null);
    const [analysis, setAnalysis] = useState(null);

    const handleAnalyze = useCallback(async (input, token) => {
        setError('');
        setAnalysis(null);
        setProfileData(null);

        const username = parseUsername(input);
        if (!username) {
            setError(
                'Invalid input. Please enter a GitHub username or a profile URL like https://github.com/username'
            );
            return;
        }

        if (token) setToken(token);

        setLoading(true);

        try {
            const data = await fetchAllProfileData(username);
            setProfileData(data);

            const result = analyzeProfile(data);
            setAnalysis(result);
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <div className="app-container">
            <Header />
            <SearchForm onAnalyze={handleAnalyze} isLoading={loading} />
            <ErrorMessage message={error} />

            {loading && <LoadingSkeleton />}

            {analysis && profileData && (
                <div className="results">
                    {/* Profile */}
                    <ProfileHeader
                        profile={profileData.profile}
                        analysis={analysis}
                    />

                    {/* Score + Category Breakdown */}
                    <div className="score-section">
                        <ScoreRing score={analysis.overall} grade={analysis.grade} />
                        <CategoryBreakdown categories={analysis.categories} />
                    </div>

                    {/* Strengths + Red Flags + Languages */}
                    <div className="insights-grid">
                        <StrengthsCard strengths={analysis.strengths} />
                        <RedFlagsCard redFlags={analysis.redFlags} />
                        <LanguageChart languages={analysis.languages} />
                    </div>

                    {/* Recommendations */}
                    <RecommendationsCard recommendations={analysis.recommendations} />

                    {/* Top Repos */}
                    <RepoHighlights repos={analysis.topRepos} />
                </div>
            )}

            <footer className="footer">
                Built with React • Data from the GitHub REST API • Scores are
                indicative, not absolute
            </footer>
        </div>
    );
}
