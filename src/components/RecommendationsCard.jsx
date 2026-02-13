import React from 'react';

export default function RecommendationsCard({ recommendations }) {
    if (!recommendations || recommendations.length === 0) return null;

    return (
        <div className="recommendations">
            <h3 className="recommendations__title">
                <span>💡</span> Actionable Recommendations
            </h3>
            <div className="recommendation-list">
                {recommendations.map((rec, i) => (
                    <div className="recommendation-item" key={i}>
                        <span
                            className={`recommendation-item__priority priority--${rec.priority}`}
                        >
                            {rec.priority}
                        </span>
                        <p
                            className="recommendation-item__text"
                            dangerouslySetInnerHTML={{
                                __html: rec.text.replace(
                                    /(\d+)/g,
                                    '<strong>$1</strong>'
                                ),
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
