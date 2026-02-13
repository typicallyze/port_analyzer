/**
 * Portfolio Analyzer — Scoring Engine
 *
 * Analyzes GitHub profile data and produces:
 *  - overall score (0-100)
 *  - per-category scores
 *  - strengths[]
 *  - redFlags[]
 *  - recommendations[]
 */

/* ————————— Category Weights ————————— */
const WEIGHTS = {
    repoQuality: 0.25,
    codeDiversity: 0.15,
    documentation: 0.20,
    commitActivity: 0.15,
    communityEngagement: 0.10,
    profileCompleteness: 0.10,
    repoCompleteness: 0.05,
};

/* ————————— Helpers ————————— */
const clamp = (v, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));

function getGrade(score) {
    if (score >= 90) return { letter: 'A+', color: '#10b981' };
    if (score >= 80) return { letter: 'A', color: '#34d399' };
    if (score >= 70) return { letter: 'B+', color: '#6ee7b7' };
    if (score >= 60) return { letter: 'B', color: '#fbbf24' };
    if (score >= 50) return { letter: 'C+', color: '#f59e0b' };
    if (score >= 40) return { letter: 'C', color: '#fb923c' };
    if (score >= 30) return { letter: 'D', color: '#f87171' };
    return { letter: 'F', color: '#ef4444' };
}

function scoreColor(score) {
    if (score >= 75) return 'url(#grad-green)';
    if (score >= 50) return 'url(#grad-yellow)';
    if (score >= 30) return 'url(#grad-orange)';
    return 'url(#grad-red)';
}

/* ————————— Category Scorers ————————— */

function scoreRepoQuality(repos) {
    if (repos.length === 0) return 0;
    const ownRepos = repos.filter((r) => !r.fork);
    if (ownRepos.length === 0) return 5;

    const totalStars = ownRepos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
    const totalForks = ownRepos.reduce((s, r) => s + (r.forks_count || 0), 0);
    const withDescription = ownRepos.filter((r) => r.description && r.description.length > 10).length;
    const withTopics = ownRepos.filter((r) => r.topics && r.topics.length > 0).length;

    let score = 0;
    score += clamp(Math.log2(totalStars + 1) * 6, 0, 30);
    score += clamp(Math.log2(totalForks + 1) * 5, 0, 20);
    score += clamp((withDescription / ownRepos.length) * 25, 0, 25);
    score += clamp((withTopics / ownRepos.length) * 25, 0, 25);

    return clamp(Math.round(score));
}

function scoreCodeDiversity(repos) {
    const langSet = new Set();
    const langBytes = {};

    repos.forEach((repo) => {
        if (repo.language) langSet.add(repo.language);
        if (repo.languages) {
            Object.entries(repo.languages).forEach(([lang, bytes]) => {
                langSet.add(lang);
                langBytes[lang] = (langBytes[lang] || 0) + bytes;
            });
        }
    });

    const langCount = langSet.size;
    if (langCount === 0) return 0;

    let score = 0;
    score += clamp(Math.min(langCount, 10) * 6, 0, 60);

    const totalBytes = Object.values(langBytes).reduce((a, b) => a + b, 0);
    if (totalBytes > 0) {
        const proportions = Object.values(langBytes).map((b) => b / totalBytes);
        const maxEntropy = Math.log2(proportions.length);
        const entropy = proportions.reduce(
            (sum, p) => sum - (p > 0 ? p * Math.log2(p) : 0),
            0
        );
        const balance = maxEntropy > 0 ? entropy / maxEntropy : 0;
        score += clamp(balance * 40, 0, 40);
    }

    return clamp(Math.round(score));
}

function scoreDocumentation(repos) {
    const ownRepos = repos.filter((r) => !r.fork);
    if (ownRepos.length === 0) return 0;

    const withReadme = ownRepos.filter((r) => r.hasReadme).length;
    const richReadme = ownRepos.filter((r) => r.readmeSize > 500).length;
    const withDesc = ownRepos.filter((r) => r.description && r.description.length > 10).length;
    const withLicense = ownRepos.filter((r) => r.license).length;

    let score = 0;
    score += clamp((withReadme / ownRepos.length) * 35, 0, 35);
    score += clamp((richReadme / ownRepos.length) * 25, 0, 25);
    score += clamp((withDesc / ownRepos.length) * 20, 0, 20);
    score += clamp((withLicense / ownRepos.length) * 20, 0, 20);

    return clamp(Math.round(score));
}

function scoreCommitActivity(repos, events) {
    const now = Date.now();
    const ninetyDays = 90 * 24 * 60 * 60 * 1000;
    const pushEvents = events.filter(
        (e) =>
            e.type === 'PushEvent' &&
            new Date(e.created_at).getTime() > now - ninetyDays
    );

    const recentRepos = repos.filter(
        (r) => new Date(r.pushed_at).getTime() > now - ninetyDays
    );

    let score = 0;
    score += clamp(Math.min(pushEvents.length, 50) * 1.2, 0, 50);
    score += clamp((recentRepos.length / Math.max(repos.length, 1)) * 30, 0, 30);

    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    const veryRecent = events.filter(
        (e) => new Date(e.created_at).getTime() > now - thirtyDays
    );
    score += veryRecent.length > 0 ? 20 : 0;

    return clamp(Math.round(score));
}

function scoreCommunityEngagement(events, repos) {
    const prEvents = events.filter((e) => e.type === 'PullRequestEvent').length;
    const issueEvents = events.filter(
        (e) => e.type === 'IssuesEvent' || e.type === 'IssueCommentEvent'
    ).length;
    const forksReceived = repos.reduce(
        (s, r) => s + (r.fork ? 0 : r.forks_count || 0),
        0
    );
    const watchersTotal = repos.reduce(
        (s, r) => s + (r.watchers_count || 0),
        0
    );

    let score = 0;
    score += clamp(prEvents * 4, 0, 30);
    score += clamp(issueEvents * 3, 0, 25);
    score += clamp(Math.log2(forksReceived + 1) * 5, 0, 25);
    score += clamp(Math.log2(watchersTotal + 1) * 4, 0, 20);

    return clamp(Math.round(score));
}

function scoreProfileCompleteness(profile) {
    let score = 0;
    if (profile.name) score += 15;
    if (profile.bio && profile.bio.length > 5) score += 20;
    if (profile.avatar_url && !profile.avatar_url.includes('gravatar')) score += 10;
    if (profile.blog) score += 15;
    if (profile.company) score += 10;
    if (profile.location) score += 10;
    if (profile.email) score += 5;
    if (profile.twitter_username) score += 5;
    score += clamp(Math.log2(profile.followers + 1) * 3, 0, 10);
    return clamp(Math.round(score));
}

function scoreRepoCompleteness(repos) {
    const ownRepos = repos.filter((r) => !r.fork);
    if (repos.length === 0) return 0;

    const nonForkRatio = ownRepos.length / repos.length;
    const withHomepage = ownRepos.filter((r) => r.homepage).length;

    let score = 0;
    score += clamp(nonForkRatio * 50, 0, 50);
    score += clamp(Math.min(ownRepos.length, 10) * 3, 0, 30);
    score += clamp((withHomepage / Math.max(ownRepos.length, 1)) * 20, 0, 20);

    return clamp(Math.round(score));
}

/* ————————— Strengths Detection ————————— */
function detectStrengths(categories, profile, repos, events) {
    const strengths = [];
    const ownRepos = repos.filter((r) => !r.fork);
    const totalStars = ownRepos.reduce((s, r) => s + (r.stargazers_count || 0), 0);

    if (categories.repoQuality.score >= 70)
        strengths.push('High-quality repositories with good descriptions and topics');
    if (categories.codeDiversity.score >= 70)
        strengths.push('Strong language diversity — shows versatility as a developer');
    if (categories.documentation.score >= 70)
        strengths.push('Excellent documentation habits — READMEs and descriptions present');
    if (categories.commitActivity.score >= 70)
        strengths.push('Consistently active — regular commit history signals dedication');
    if (categories.communityEngagement.score >= 60)
        strengths.push('Active community contributor — PRs, issues, and collaboration');
    if (categories.profileCompleteness.score >= 80)
        strengths.push('Well-crafted profile — bio, links, and professional presence');
    if (totalStars >= 50)
        strengths.push(`Repos have accumulated ${totalStars} stars — shows real impact`);
    if (ownRepos.length >= 15)
        strengths.push(`${ownRepos.length} original repositories — strong body of work`);
    if (profile.followers >= 100)
        strengths.push(`${profile.followers} followers — established reputation in the community`);

    const langSet = new Set();
    repos.forEach((r) => { if (r.language) langSet.add(r.language); });
    if (langSet.size >= 5)
        strengths.push(`Proficiency across ${langSet.size} languages`);

    if (strengths.length === 0)
        strengths.push('Active GitHub presence — a great foundation to build on');

    return strengths;
}

/* ————————— Red Flags Detection ————————— */
function detectRedFlags(categories, profile, repos, events) {
    const flags = [];
    const ownRepos = repos.filter((r) => !r.fork);

    if (categories.documentation.score < 30)
        flags.push('Most repos lack READMEs or meaningful descriptions — a major red flag for recruiters');
    if (categories.commitActivity.score < 20)
        flags.push('Very low recent activity — could signal disengagement');
    if (repos.length > 0 && ownRepos.length / repos.length < 0.3)
        flags.push('Majority of repos are forks with no original work visible');
    if (categories.profileCompleteness.score < 30)
        flags.push('Incomplete profile — missing bio, links, or professional info');
    if (repos.length === 0)
        flags.push('No public repositories — portfolio appears empty');
    if (categories.codeDiversity.score < 20 && repos.length > 3)
        flags.push('Very limited language diversity — only one language used');
    if (categories.communityEngagement.score < 15 && repos.length > 5)
        flags.push('No visible OSS collaboration — no PRs or issue participation');

    const noDesc = ownRepos.filter((r) => !r.description || r.description.length < 5);
    if (noDesc.length > 5)
        flags.push(`${noDesc.length} repos have no description — hard for recruiters to evaluate`);

    return flags;
}

/* ————————— Recommendations ————————— */
function generateRecommendations(categories, profile, repos) {
    const recs = [];
    const ownRepos = repos.filter((r) => !r.fork);

    const noReadme = ownRepos.filter((r) => !r.hasReadme);
    if (noReadme.length > 0) {
        recs.push({
            priority: 'high',
            text: `Add README files to ${noReadme.length} repo${noReadme.length > 1 ? 's' : ''}. Include: project purpose, setup instructions, screenshots/demo, and technologies used.`,
        });
    }

    const shortReadme = ownRepos.filter((r) => r.hasReadme && r.readmeSize < 300);
    if (shortReadme.length > 2) {
        recs.push({
            priority: 'medium',
            text: `Expand ${shortReadme.length} thin READMEs. Aim for 500+ words with architecture diagrams, API docs, or usage examples.`,
        });
    }

    const noDesc = ownRepos.filter((r) => !r.description || r.description.length < 10);
    if (noDesc.length > 0) {
        recs.push({
            priority: 'high',
            text: `Write clear descriptions for ${noDesc.length} repo${noDesc.length > 1 ? 's' : ''}. A concise one-liner helps recruiters quickly understand each project.`,
        });
    }

    const noTopics = ownRepos.filter((r) => !r.topics || r.topics.length === 0);
    if (noTopics.length > 3) {
        recs.push({
            priority: 'medium',
            text: `Add topics/tags to ${noTopics.length} repos. Topics improve discoverability and show domain knowledge.`,
        });
    }

    if (!profile.bio || profile.bio.length < 10) {
        recs.push({
            priority: 'high',
            text: 'Write a compelling bio — mention your role, interests, and what you build. This is the first thing recruiters see.',
        });
    }
    if (!profile.blog) {
        recs.push({
            priority: 'medium',
            text: 'Add a website or portfolio link to your profile. It gives recruiters more context about you.',
        });
    }

    if (categories.commitActivity.score < 40) {
        recs.push({
            priority: 'medium',
            text: 'Increase commit frequency. Even small daily contributions show consistency and discipline.',
        });
    }

    if (categories.communityEngagement.score < 30) {
        recs.push({
            priority: 'low',
            text: 'Start contributing to open-source projects — open issues, submit PRs, or review code. Collaboration signals are highly valued.',
        });
    }

    const noLicense = ownRepos.filter((r) => !r.license);
    if (noLicense.length > 3) {
        recs.push({
            priority: 'low',
            text: `Add licenses to ${noLicense.length} repos. It signals professionalism and encourages reuse.`,
        });
    }

    const noHomepage = ownRepos.filter((r) => !r.homepage);
    if (noHomepage.length > 5) {
        recs.push({
            priority: 'low',
            text: 'Add live demo links or project URLs where applicable. Deployed projects are far more impressive than code alone.',
        });
    }

    if (ownRepos.length > 6) {
        recs.push({
            priority: 'low',
            text: 'Pin your 6 best repos on your GitHub profile. Curate what recruiters see first.',
        });
    }

    return recs;
}

/* ————————— Main Analyze Function ————————— */
export function analyzeProfile({ profile, repos, events }) {
    const catScores = {
        repoQuality: { label: 'Repository Quality', score: scoreRepoQuality(repos) },
        codeDiversity: { label: 'Code Diversity', score: scoreCodeDiversity(repos) },
        documentation: { label: 'Documentation', score: scoreDocumentation(repos) },
        commitActivity: { label: 'Commit Activity', score: scoreCommitActivity(repos, events) },
        communityEngagement: { label: 'Community Engagement', score: scoreCommunityEngagement(events, repos) },
        profileCompleteness: { label: 'Profile Completeness', score: scoreProfileCompleteness(profile) },
        repoCompleteness: { label: 'Repo Completeness', score: scoreRepoCompleteness(repos) },
    };

    const overall = Math.round(
        Object.entries(catScores).reduce(
            (sum, [key, val]) => sum + val.score * WEIGHTS[key],
            0
        )
    );

    const grade = getGrade(overall);

    const categories = Object.entries(catScores).map(([key, val]) => ({
        key,
        ...val,
        weight: WEIGHTS[key],
        color: scoreColor(val.score),
        grade: getGrade(val.score),
    }));

    const topRepos = [...repos]
        .filter((r) => !r.fork)
        .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
        .slice(0, 6);

    const langBytes = {};
    repos.forEach((repo) => {
        if (repo.languages) {
            Object.entries(repo.languages).forEach(([lang, bytes]) => {
                langBytes[lang] = (langBytes[lang] || 0) + bytes;
            });
        } else if (repo.language) {
            langBytes[repo.language] = (langBytes[repo.language] || 0) + 1;
        }
    });

    const totalBytes = Object.values(langBytes).reduce((a, b) => a + b, 0);
    const languages = Object.entries(langBytes)
        .map(([name, bytes]) => ({
            name,
            bytes,
            percentage: totalBytes > 0 ? ((bytes / totalBytes) * 100).toFixed(1) : 0,
        }))
        .sort((a, b) => b.bytes - a.bytes)
        .slice(0, 10);

    return {
        overall,
        grade,
        categories,
        strengths: detectStrengths(catScores, profile, repos, events),
        redFlags: detectRedFlags(catScores, profile, repos, events),
        recommendations: generateRecommendations(catScores, profile, repos),
        topRepos,
        languages,
        repoCount: repos.length,
        ownRepoCount: repos.filter((r) => !r.fork).length,
    };
}
