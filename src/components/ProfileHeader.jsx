import React from 'react';

export default function ProfileHeader({ profile, analysis }) {
    return (
        <div className="profile-header">
            <img
                className="profile-header__avatar"
                src={profile.avatar_url}
                alt={`${profile.login} avatar`}
            />
            <div className="profile-header__info">
                <h2 className="profile-header__name">
                    {profile.name || profile.login}
                </h2>
                <p className="profile-header__username">
                    <a
                        href={profile.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        @{profile.login}
                    </a>
                </p>
                {profile.bio && (
                    <p className="profile-header__bio">{profile.bio}</p>
                )}
                <div className="profile-header__stats">
                    <span className="profile-header__stat">
                        <strong>{profile.public_repos}</strong> repos
                    </span>
                    <span className="profile-header__stat">
                        <strong>{profile.followers}</strong> followers
                    </span>
                    <span className="profile-header__stat">
                        <strong>{profile.following}</strong> following
                    </span>
                    {analysis && (
                        <span className="profile-header__stat">
                            <strong>{analysis.ownRepoCount}</strong> original
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
