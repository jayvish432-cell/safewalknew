import { useState } from 'react';
import { FiUser, FiShield, FiStar, FiEdit3, FiAward, FiTrendingUp, FiMapPin, FiClock, FiChevronRight } from 'react-icons/fi';
import { users, leaderboard, achievements, reviews, zones } from '../data/mockData';
import { getLevelInfo } from '../data/models';
import './Dashboard.css';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const user = users[0]; // Current user (Priya Sharma)
    const levelInfo = getLevelInfo(user.safetyPoints);
    const userReviews = reviews.filter(r => r.userId === user.id);

    const getZoneName = (zoneId) => zones.find(z => z.id === zoneId)?.name || 'Unknown';

    return (
        <div className="dashboard page-enter">
            <div className="container">
                {/* Profile Header */}
                <div className="dash-profile glass-card-strong">
                    <div className="dash-profile-left">
                        <div className="dash-avatar">
                            <span className="dash-avatar-letter">{user.name.charAt(0)}</span>
                            <div className="dash-avatar-badge">🛡️</div>
                        </div>
                        <div className="dash-profile-info">
                            <h1 className="dash-name">{user.name}</h1>
                            <div className="dash-badges-row">
                                {user.badges.includes('Community Guardian') && (
                                    <span className="badge badge-purple">🛡️ Community Guardian</span>
                                )}
                                <span className="badge badge-safe">Level {user.level} — {levelInfo.current.title}</span>
                            </div>
                            <p className="dash-email">{user.email}</p>
                        </div>
                    </div>
                    <div className="dash-profile-stats">
                        <div className="dash-profile-stat">
                            <FiStar />
                            <span className="dash-profile-stat-value">{user.safetyPoints.toLocaleString()}</span>
                            <span className="dash-profile-stat-label">Points</span>
                        </div>
                        <div className="dash-profile-stat">
                            <FiEdit3 />
                            <span className="dash-profile-stat-value">{user.reviewCount}</span>
                            <span className="dash-profile-stat-label">Reviews</span>
                        </div>
                        <div className="dash-profile-stat">
                            <FiAward />
                            <span className="dash-profile-stat-value">{user.badges.length}</span>
                            <span className="dash-profile-stat-label">Badges</span>
                        </div>
                    </div>
                </div>

                {/* Level Progress */}
                <div className="dash-level glass-card">
                    <div className="dash-level-header">
                        <span className="dash-level-current">Level {levelInfo.current.level}</span>
                        <span className="dash-level-title">{levelInfo.current.title}</span>
                        {levelInfo.next && (
                            <span className="dash-level-next">
                                Next: Level {levelInfo.next.level} — {levelInfo.next.title} ({levelInfo.next.minPoints} pts)
                            </span>
                        )}
                    </div>
                    <div className="dash-level-bar">
                        <div
                            className="dash-level-fill"
                            style={{ width: `${levelInfo.progress}%` }}
                        />
                    </div>
                    <div className="dash-level-meta">
                        <span>{user.safetyPoints} pts</span>
                        <span>{Math.round(levelInfo.progress)}%</span>
                        {levelInfo.next && <span>{levelInfo.next.minPoints} pts</span>}
                    </div>
                </div>

                {/* Tabs */}
                <div className="dash-tabs">
                    {[
                        { key: 'overview', label: 'Overview', icon: <FiTrendingUp /> },
                        { key: 'reviews', label: 'My Reviews', icon: <FiEdit3 /> },
                        { key: 'badges', label: 'Achievements', icon: <FiAward /> },
                        { key: 'leaderboard', label: 'Leaderboard', icon: <FiStar /> },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            className={`dash-tab ${activeTab === tab.key ? 'dash-tab-active' : ''}`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="dash-content">
                    {activeTab === 'overview' && (
                        <div className="dash-overview animate-fade-in">
                            <div className="dash-overview-grid">
                                <div className="dash-card glass-card">
                                    <div className="dash-card-icon" style={{ background: 'var(--safe-green-glow)', color: 'var(--safe-green)' }}>
                                        <FiShield />
                                    </div>
                                    <div className="dash-card-info">
                                        <span className="dash-card-value">12</span>
                                        <span className="dash-card-label">Safe Zones Reviewed</span>
                                    </div>
                                </div>
                                <div className="dash-card glass-card">
                                    <div className="dash-card-icon" style={{ background: 'var(--danger-red-glow)', color: 'var(--danger-red)' }}>
                                        <FiAward />
                                    </div>
                                    <div className="dash-card-info">
                                        <span className="dash-card-value">8</span>
                                        <span className="dash-card-label">Danger Alerts Reported</span>
                                    </div>
                                </div>
                                <div className="dash-card glass-card">
                                    <div className="dash-card-icon" style={{ background: 'var(--accent-purple-glow)', color: 'var(--accent-purple)' }}>
                                        <FiTrendingUp />
                                    </div>
                                    <div className="dash-card-info">
                                        <span className="dash-card-value">#2</span>
                                        <span className="dash-card-label">Leaderboard Rank</span>
                                    </div>
                                </div>
                                <div className="dash-card glass-card">
                                    <div className="dash-card-icon" style={{ background: 'var(--moderate-yellow-glow)', color: 'var(--moderate-yellow)' }}>
                                        <FiMapPin />
                                    </div>
                                    <div className="dash-card-info">
                                        <span className="dash-card-value">27</span>
                                        <span className="dash-card-label">Areas Explored</span>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <h3 className="dash-section-title">Recent Activity</h3>
                            <div className="dash-activity-list">
                                {userReviews.slice(0, 3).map(review => (
                                    <div key={review.id} className="dash-activity-item glass-card">
                                        <div className="dash-activity-icon">
                                            <FiEdit3 />
                                        </div>
                                        <div className="dash-activity-info">
                                            <span className="dash-activity-text">
                                                Reviewed <strong>{getZoneName(review.zoneId)}</strong>
                                            </span>
                                            <span className="dash-activity-time">
                                                <FiClock /> {new Date(review.timestamp).toLocaleDateString('en-IN', {
                                                    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        <span className={`badge badge-${review.overallSafety >= 7 ? 'safe' : review.overallSafety >= 4 ? 'moderate' : 'danger'}`}>
                                            {review.overallSafety}/10
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div className="dash-reviews animate-fade-in">
                            {userReviews.length === 0 ? (
                                <div className="dash-empty">
                                    <FiEdit3 />
                                    <p>You haven't submitted any reviews yet.</p>
                                </div>
                            ) : (
                                <div className="dash-reviews-list">
                                    {userReviews.map(review => (
                                        <div key={review.id} className="dash-review-card glass-card">
                                            <div className="dash-review-header">
                                                <h4>{getZoneName(review.zoneId)}</h4>
                                                <span className={`badge badge-${review.overallSafety >= 7 ? 'safe' : review.overallSafety >= 4 ? 'moderate' : 'danger'}`}>
                                                    {review.overallSafety}/10
                                                </span>
                                            </div>
                                            <div className="dash-review-factors">
                                                <span>💡 Lighting: {review.lighting}</span>
                                                <span>👤 Suspicious: {review.suspiciousActivity}</span>
                                                <span>🔒 Crime: {review.crimeHistory}</span>
                                                <span>🐕 Dogs: {review.strayDogs}</span>
                                            </div>
                                            <p className="dash-review-comment">{review.textComment}</p>
                                            <div className="dash-review-meta">
                                                <span><FiClock /> {new Date(review.timestamp).toLocaleDateString()}</span>
                                                {review.verified && <span className="badge badge-safe">✓ Verified</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'badges' && (
                        <div className="dash-badges animate-fade-in">
                            <div className="dash-badges-grid">
                                {achievements.map(achievement => {
                                    const earned = user.badges.includes(achievement.name);
                                    return (
                                        <div key={achievement.id} className={`dash-badge-card glass-card ${earned ? 'dash-badge-earned' : 'dash-badge-locked'}`}>
                                            <div className="dash-badge-icon">{achievement.icon}</div>
                                            <h4 className="dash-badge-name">{achievement.name}</h4>
                                            <p className="dash-badge-desc">{achievement.description}</p>
                                            <div className="dash-badge-points">
                                                <FiStar /> {achievement.points} pts
                                            </div>
                                            {earned ? (
                                                <span className="badge badge-safe">Earned</span>
                                            ) : (
                                                <span className="badge badge-moderate">Locked</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {activeTab === 'leaderboard' && (
                        <div className="dash-leaderboard animate-fade-in">
                            <div className="dash-lb-list">
                                {leaderboard.map((entry, i) => (
                                    <div
                                        key={entry.id}
                                        className={`dash-lb-item glass-card ${entry.id === user.id ? 'dash-lb-item-self' : ''}`}
                                    >
                                        <div className="dash-lb-rank">
                                            {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${entry.rank}`}
                                        </div>
                                        <div className="dash-lb-avatar">
                                            {entry.name.charAt(0)}
                                        </div>
                                        <div className="dash-lb-info">
                                            <span className="dash-lb-name">{entry.name}</span>
                                            <span className="dash-lb-meta">
                                                Level {entry.level} · {entry.reviewCount} reviews
                                            </span>
                                        </div>
                                        <div className="dash-lb-points">
                                            <strong>{entry.safetyPoints.toLocaleString()}</strong>
                                            <span>pts</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
