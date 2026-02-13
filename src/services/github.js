/**
 * GitHub API Service
 * Handles all GitHub REST API calls with pagination, rate-limit awareness,
 * and optional personal access token support.
 */

const BASE_URL = 'https://api.github.com';

let authToken = '';

export function setToken(token) {
    authToken = token.trim();
}

function headers() {
    const h = {
        Accept: 'application/vnd.github.v3+json',
    };
    if (authToken) {
        h.Authorization = `Bearer ${authToken}`;
    }
    return h;
}

async function apiFetch(url) {
    const res = await fetch(url, { headers: headers() });

    if (res.status === 404) {
        throw new Error('User not found. Please check the username and try again.');
    }
    if (res.status === 403) {
        const rateLimitReset = res.headers.get('X-RateLimit-Reset');
        const resetTime = rateLimitReset
            ? new Date(rateLimitReset * 1000).toLocaleTimeString()
            : 'soon';
        throw new Error(
            `GitHub API rate limit exceeded. Resets at ${resetTime}. Add a personal access token to increase your limit.`
        );
    }
    if (!res.ok) {
        throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
    }
    return res.json();
}

/**
 * Fetch a user's public profile.
 */
export async function fetchUserProfile(username) {
    return apiFetch(`${BASE_URL}/users/${username}`);
}

/**
 * Fetch public repos (up to 100) sorted by most recently pushed.
 */
export async function fetchRepos(username) {
    return apiFetch(
        `${BASE_URL}/users/${username}/repos?per_page=100&sort=pushed&direction=desc`
    );
}

/**
 * Fetch the languages object for a single repo.
 */
export async function fetchRepoLanguages(owner, repo) {
    try {
        return await apiFetch(`${BASE_URL}/repos/${owner}/${repo}/languages`);
    } catch {
        return {};
    }
}

/**
 * Check if a repo has a README by trying to fetch its contents.
 * Returns { hasReadme, readmeSize }.
 */
export async function fetchReadmeInfo(owner, repo) {
    try {
        const data = await apiFetch(`${BASE_URL}/repos/${owner}/${repo}/readme`);
        return { hasReadme: true, readmeSize: data.size || 0 };
    } catch {
        return { hasReadme: false, readmeSize: 0 };
    }
}

/**
 * Fetch recent public events for a user (up to 100).
 * Useful for deriving PR, issue, and push activity.
 */
export async function fetchUserEvents(username) {
    try {
        return await apiFetch(
            `${BASE_URL}/users/${username}/events/public?per_page=100`
        );
    } catch {
        return [];
    }
}

/**
 * Fetch commit activity (weekly additions / deletions) for a repo.
 * Returns an array of weekly stats or empty array on failure.
 */
export async function fetchCommitActivity(owner, repo) {
    try {
        const data = await apiFetch(
            `${BASE_URL}/repos/${owner}/${repo}/stats/commit_activity`
        );
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

/**
 * High-level convenience: gather all data needed for analysis.
 * Batches sub-requests to stay within rate limits.
 */
export async function fetchAllProfileData(username) {
    // Phase 1 — profile + repos + events (in parallel)
    const [profile, repos, events] = await Promise.all([
        fetchUserProfile(username),
        fetchRepos(username),
        fetchUserEvents(username),
    ]);

    // Phase 2 — per-repo details (languages + readme) for top 15 repos
    const topRepos = repos.slice(0, 15);
    const repoDetails = await Promise.all(
        topRepos.map(async (repo) => {
            const [languages, readmeInfo] = await Promise.all([
                fetchRepoLanguages(username, repo.name),
                fetchReadmeInfo(username, repo.name),
            ]);
            return { ...repo, languages, ...readmeInfo };
        })
    );

    // Merge details back — repos beyond top 15 keep bare data
    const enrichedRepos = repos.map((repo) => {
        const detailed = repoDetails.find((d) => d.id === repo.id);
        return detailed || repo;
    });

    return { profile, repos: enrichedRepos, events };
}

/**
 * Extract a GitHub username from either a URL or plain text.
 */
export function parseUsername(input) {
    const trimmed = input.trim().replace(/\/+$/, '');

    // Try URL patterns
    const urlMatch = trimmed.match(
        /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38})\/?$/
    );
    if (urlMatch) return urlMatch[1];

    // Plain username
    const usernameMatch = trimmed.match(
        /^([a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38})$/
    );
    if (usernameMatch) return usernameMatch[1];

    return null;
}
