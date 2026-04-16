import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { FiEdit3, FiMapPin, FiCheck, FiSend, FiStar, FiAlertTriangle } from 'react-icons/fi';
import { analyzeSentiment, verifyLocation } from '../utils/safetyEngine';
import 'leaflet/dist/leaflet.css';
import './ReviewForm.css';

const factorLabels = [
    { key: 'lighting', label: 'Street Lighting', desc: 'How well lit is the area?', emoji: '💡', lowLabel: 'Dark', highLabel: 'Well Lit' },
    { key: 'suspiciousActivity', label: 'Suspicious Activity', desc: 'Presence of suspicious individuals', emoji: '👤', lowLabel: 'None', highLabel: 'Frequent' },
    { key: 'crimeHistory', label: 'Crime History', desc: 'Known crime in this area', emoji: '🔒', lowLabel: 'Low Crime', highLabel: 'High Crime' },
    { key: 'strayDogs', label: 'Stray Dog Density', desc: 'How many stray dogs around?', emoji: '🐕', lowLabel: 'Few', highLabel: 'Many' },
    { key: 'overallSafety', label: 'Overall Night Safety', desc: 'How safe do you feel at night?', emoji: '🌙', lowLabel: 'Unsafe', highLabel: 'Very Safe' },
];

const pinIcon = L.divIcon({
    className: 'review-pin',
    html: '<div class="review-pin-marker">📍</div>',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
});

function LocationPicker({ position, setPosition }) {
    useMapEvents({
        click: (e) => setPosition([e.latlng.lat, e.latlng.lng]),
    });
    return position ? <Marker position={position} icon={pinIcon} /> : null;
}

export default function ReviewForm() {
    const [position, setPosition] = useState(null);
    const [factors, setFactors] = useState({
        lighting: 5, suspiciousActivity: 5, crimeHistory: 5, strayDogs: 5, overallSafety: 5,
    });
    const [comment, setComment] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [sentiment, setSentiment] = useState(null);

    const handleFactorChange = (key, value) => {
        setFactors(prev => ({ ...prev, [key]: parseInt(value) }));
    };

    const handleVerifyLocation = () => {
        setIsVerifying(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const userCoords = [pos.coords.latitude, pos.coords.longitude];
                    if (position) {
                        const verified = verifyLocation(userCoords, position, 2);
                        setIsVerified(verified);
                    } else {
                        setPosition(userCoords);
                        setIsVerified(true);
                    }
                    setIsVerifying(false);
                },
                () => {
                    setIsVerified(true);
                    setIsVerifying(false);
                }
            );
        } else {
            setIsVerified(true);
            setIsVerifying(false);
        }
    };

    const handleCommentChange = (text) => {
        setComment(text);
        if (text.length > 20) {
            setSentiment(analyzeSentiment(text));
        } else {
            setSentiment(null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!position) return;
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 4000);
    };

    if (isSubmitted) {
        return (
            <div className="review-page page-enter">
                <div className="container">
                    <div className="review-success animate-fade-in-up">
                        <div className="review-success-icon">
                            <svg viewBox="0 0 24 24" className="review-success-svg">
                                <circle cx="12" cy="12" r="10" className="review-success-circle" />
                                <path d="M8 12l2.5 2.5L16 9" className="review-success-check" />
                            </svg>
                        </div>
                        <h2>Review Submitted! 🎉</h2>
                        <p>Thank you for helping keep our community safe.</p>
                        <div className="review-success-points">
                            <FiStar /> +50 Safety Points Earned
                        </div>
                        <button className="btn btn-primary" onClick={() => {
                            setIsSubmitted(false);
                            setPosition(null);
                            setComment('');
                            setFactors({ lighting: 5, suspiciousActivity: 5, crimeHistory: 5, strayDogs: 5, overallSafety: 5 });
                            setIsVerified(false);
                            setSentiment(null);
                        }}>
                            Submit Another Review
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="review-page page-enter">
            <div className="container">
                <div className="review-header">
                    <h1 className="review-title">
                        <FiEdit3 className="gradient-text" /> Submit Safety Review
                    </h1>
                    <p className="review-subtitle">
                        Rate an area to help others stay safe. Your reviews power our AI safety scores.
                    </p>
                </div>

                <div className="review-layout">
                    {/* Map Section */}
                    <div className="review-map-section">
                        <div className="review-map-header">
                            <h3><FiMapPin /> Select Location</h3>
                            <p>Click on the map or use current location</p>
                        </div>
                        <div className="review-map-wrap">
                            <MapContainer
                                center={[12.9716, 77.5946]}
                                zoom={12}
                                className="review-map"
                                zoomControl={false}
                            >
                                <TileLayer
                                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                    attribution='&copy; OSM &copy; CARTO'
                                />
                                <LocationPicker position={position} setPosition={setPosition} />
                            </MapContainer>
                        </div>
                        <div className="review-map-actions">
                            <button
                                className={`btn ${isVerified ? 'btn-success' : 'btn-outline'}`}
                                onClick={handleVerifyLocation}
                                disabled={isVerifying}
                            >
                                {isVerifying ? (
                                    <><span className="spinner" /> Verifying...</>
                                ) : isVerified ? (
                                    <><FiCheck /> Location Verified</>
                                ) : (
                                    <><FiMapPin /> Verify My Location</>
                                )}
                            </button>
                            {position && (
                                <span className="review-coords">
                                    📍 {position[0].toFixed(4)}, {position[1].toFixed(4)}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Form Section */}
                    <form className="review-form glass-card-strong" onSubmit={handleSubmit}>
                        <h3 className="review-form-title">Safety Ratings</h3>

                        {factorLabels.map(factor => (
                            <div key={factor.key} className="review-factor">
                                <div className="review-factor-header">
                                    <span className="review-factor-emoji">{factor.emoji}</span>
                                    <div>
                                        <span className="review-factor-label">{factor.label}</span>
                                        <span className="review-factor-desc">{factor.desc}</span>
                                    </div>
                                    <span className="review-factor-value" style={{
                                        color: factor.key === 'overallSafety' || factor.key === 'lighting'
                                            ? factors[factor.key] >= 7 ? 'var(--safe-green)' : factors[factor.key] >= 4 ? 'var(--moderate-yellow)' : 'var(--danger-red)'
                                            : factors[factor.key] <= 3 ? 'var(--safe-green)' : factors[factor.key] <= 6 ? 'var(--moderate-yellow)' : 'var(--danger-red)'
                                    }}>
                                        {factors[factor.key]}
                                    </span>
                                </div>
                                <div className="review-slider-wrap">
                                    <span className="review-slider-label">{factor.lowLabel}</span>
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={factors[factor.key]}
                                        onChange={e => handleFactorChange(factor.key, e.target.value)}
                                        className="review-slider"
                                    />
                                    <span className="review-slider-label">{factor.highLabel}</span>
                                </div>
                            </div>
                        ))}

                        <div className="review-comment-section">
                            <label className="form-label">Your Review</label>
                            <textarea
                                className="form-input form-textarea"
                                placeholder="Describe your experience... (e.g., 'Well-lit streets with CCTV cameras' or 'Very dark and deserted after 10 PM')"
                                value={comment}
                                onChange={e => handleCommentChange(e.target.value)}
                                maxLength={500}
                            />
                            <div className="review-comment-meta">
                                <span className="review-char-count">{comment.length}/500</span>
                                {sentiment && (
                                    <span className={`review-sentiment badge badge-${sentiment.label === 'positive' ? 'safe' : sentiment.label === 'negative' ? 'danger' : 'moderate'}`}>
                                        {sentiment.label === 'positive' ? '😊' : sentiment.label === 'negative' ? '😟' : '😐'} {sentiment.label} sentiment
                                    </span>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg review-submit-btn"
                            disabled={!position}
                        >
                            <FiSend /> Submit Review
                        </button>

                        {!position && (
                            <p className="review-warning">
                                <FiAlertTriangle /> Please select a location on the map first
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
