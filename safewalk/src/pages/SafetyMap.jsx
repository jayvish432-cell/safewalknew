import { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Circle, Popup, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { FiInfo, FiAlertTriangle, FiStar, FiMapPin, FiSearch, FiX, FiEdit3, FiNavigation } from 'react-icons/fi';
import { zones, reviews } from '../data/mockData';
import { getSafetyCategory, getZoneColor, calculateSafetyScore } from '../utils/safetyEngine';
import 'leaflet/dist/leaflet.css';
import './SafetyMap.css';

// Fix leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// ═══ Custom Icons ═══

const userIcon = L.divIcon({
    className: 'user-marker-icon',
    html: '<div class="user-marker-dot"><div class="user-marker-pulse"></div></div>',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
});

function createReviewPinIcon(score) {
    let color, glowColor, label;
    if (score >= 7) {
        color = '#10b981'; glowColor = 'rgba(16, 185, 129, 0.4)'; label = 'safe';
    } else if (score >= 4) {
        color = '#f59e0b'; glowColor = 'rgba(245, 158, 11, 0.4)'; label = 'moderate';
    } else {
        color = '#ef4444'; glowColor = 'rgba(239, 68, 68, 0.4)'; label = 'unsafe';
    }
    return L.divIcon({
        className: 'review-pin-icon',
        html: `<div class="review-pin review-pin-${label}" style="--pin-color:${color};--pin-glow:${glowColor}">
      <span class="review-pin-score">${score.toFixed(0)}</span>
    </div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14],
    });
}

const neutralPinIcon = L.divIcon({
    className: 'review-pin-icon',
    html: `<div class="review-pin review-pin-neutral">
    <span class="review-pin-score">?</span>
  </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
});

const searchPinIcon = L.divIcon({
    className: 'review-pin-icon',
    html: `<div class="search-pin-marker">
    <div class="search-pin-ring"></div>
    <div class="search-pin-dot"></div>
  </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
});


// ═══ Map Sub-Components ═══

function LocateControl() {
    const map = useMap();
    useEffect(() => {
        const btn = L.control({ position: 'topright' });
        btn.onAdd = () => {
            const div = L.DomUtil.create('div', 'leaflet-locate-btn');
            div.innerHTML = '📍';
            div.title = 'Go to my location';
            div.onclick = () => map.locate({ setView: true, maxZoom: 15 });
            return div;
        };
        btn.addTo(map);
    }, [map]);
    return null;
}

function FlyToLocation({ coords }) {
    const map = useMap();
    useEffect(() => {
        if (coords) {
            map.flyTo(coords, 15, { duration: 1.2 });
        }
    }, [coords, map]);
    return null;
}


// ═══ Geocoding Search ═══

function useGeocoder() {
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const debounceRef = useRef(null);

    const search = useCallback((query) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (!query || query.length < 3) {
            setResults([]);
            return;
        }
        setIsLoading(true);
        debounceRef.current = setTimeout(async () => {
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?` +
                    `format=json&q=${encodeURIComponent(query)}&limit=6&addressdetails=1` +
                    `&viewbox=77.4,13.1,77.8,12.8&bounded=0`
                );
                const data = await res.json();
                setResults(data.map(item => ({
                    id: item.place_id,
                    name: item.display_name.split(',').slice(0, 3).join(', '),
                    fullName: item.display_name,
                    lat: parseFloat(item.lat),
                    lng: parseFloat(item.lon),
                    type: item.type,
                })));
            } catch (err) {
                console.error('Geocoding error:', err);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 400);
    }, []);

    const clear = useCallback(() => {
        setResults([]);
        if (debounceRef.current) clearTimeout(debounceRef.current);
    }, []);

    return { results, isLoading, search, clear };
}


// ═══ Review Pin Score Calculation ═══

function getReviewScore(review) {
    const score = calculateSafetyScore([review]);
    return Math.round(score * 10) / 10;
}

function getReviewsNearLocation(coords, radiusKm = 0.5) {
    return reviews.filter(r => {
        const dist = haversine(coords, r.coordinates);
        return dist <= radiusKm;
    });
}

function haversine(c1, c2) {
    const R = 6371;
    const dLat = (c2[0] - c1[0]) * Math.PI / 180;
    const dLon = (c2[1] - c1[1]) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(c1[0] * Math.PI / 180) * Math.cos(c2[0] * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}


// ═══ Main Component ═══

export default function SafetyMap() {
    const [selectedZone, setSelectedZone] = useState(null);
    const [filter, setFilter] = useState('all');
    const [userLocation, setUserLocation] = useState(null);

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchedLocation, setSearchedLocation] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [flyTarget, setFlyTarget] = useState(null);
    const { results: searchResults, isLoading: isSearching, search: doSearch, clear: clearSearch } = useGeocoder();
    const searchRef = useRef(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                pos => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
                () => setUserLocation([12.9716, 77.5946])
            );
        } else {
            setUserLocation([12.9716, 77.5946]);
        }
    }, []);

    // Close search dropdown on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleSearchInput = (value) => {
        setSearchQuery(value);
        doSearch(value);
        setShowResults(true);
    };

    const handleSelectResult = (result) => {
        const coords = [result.lat, result.lng];
        setSearchQuery(result.name);
        setShowResults(false);
        clearSearch();

        // Check if this location has nearby reviews
        const nearby = getReviewsNearLocation(coords);
        setSearchedLocation({
            coords,
            name: result.name,
            fullName: result.fullName,
            hasReviews: nearby.length > 0,
            nearbyReviews: nearby,
            avgScore: nearby.length > 0 ? calculateSafetyScore(nearby) : null,
        });
        setFlyTarget(coords);
        setSelectedZone(null);
    };

    const clearSearchedLocation = () => {
        setSearchedLocation(null);
        setSearchQuery('');
        setFlyTarget(null);
    };

    const filteredZones = zones.filter(z => {
        if (filter === 'all') return true;
        return z.category === filter;
    });

    // Filter review pins by category
    const filteredReviews = reviews.filter(r => {
        if (filter === 'all') return true;
        const score = getReviewScore(r);
        if (filter === 'safe') return score >= 7;
        if (filter === 'moderate') return score >= 4 && score < 7;
        if (filter === 'unsafe') return score < 4;
        return true;
    });

    return (
        <div className="safety-map page-enter">
            <div className="map-header">
                <div className="container map-header-inner">
                    <div className="map-header-left">
                        <h1 className="map-title">
                            <FiMapPin /> Safety Map
                        </h1>
                        <p className="map-subtitle">Real-time safety data from community reviews</p>
                    </div>

                    {/* ═══ Search Bar ═══ */}
                    <div className="map-search-wrap" ref={searchRef}>
                        <div className="map-search-input-wrap">
                            <FiSearch className="map-search-icon" />
                            <input
                                type="text"
                                className="map-search-input"
                                placeholder="Search any location in the city..."
                                value={searchQuery}
                                onChange={e => handleSearchInput(e.target.value)}
                                onFocus={() => searchResults.length > 0 && setShowResults(true)}
                            />
                            {searchQuery && (
                                <button className="map-search-clear" onClick={() => { setSearchQuery(''); clearSearch(); clearSearchedLocation(); }}>
                                    <FiX />
                                </button>
                            )}
                            {isSearching && <div className="map-search-spinner" />}
                        </div>

                        {showResults && searchResults.length > 0 && (
                            <div className="map-search-results glass-card-strong">
                                {searchResults.map(result => (
                                    <button
                                        key={result.id}
                                        className="map-search-result-item"
                                        onClick={() => handleSelectResult(result)}
                                    >
                                        <FiMapPin className="map-search-result-icon" />
                                        <div className="map-search-result-text">
                                            <span className="map-search-result-name">{result.name}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="map-filters">
                        {['all', 'safe', 'moderate', 'unsafe'].map(f => (
                            <button
                                key={f}
                                className={`map-filter-btn ${filter === f ? 'map-filter-active' : ''} ${f !== 'all' ? `map-filter-${f}` : ''}`}
                                onClick={() => setFilter(f)}
                            >
                                {f === 'all' ? 'All Zones' : f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="map-container">
                <MapContainer
                    center={[12.9716, 77.5946]}
                    zoom={12}
                    className="map-leaflet"
                    zoomControl={false}
                >
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
                    />
                    <LocateControl />
                    {flyTarget && <FlyToLocation coords={flyTarget} />}

                    {/* User location */}
                    {userLocation && (
                        <Marker position={userLocation} icon={userIcon}>
                            <Popup>
                                <div className="zone-popup">
                                    <strong>📍 Your Location</strong>
                                </div>
                            </Popup>
                        </Marker>
                    )}

                    {/* ═══ Zone Overlays (circles) ═══ */}
                    {filteredZones.map(zone => {
                        const colors = getZoneColor(zone.currentScore);
                        const safety = getSafetyCategory(zone.currentScore);
                        return (
                            <Circle
                                key={zone.id}
                                center={zone.center}
                                radius={zone.radius}
                                pathOptions={{
                                    fillColor: colors.fill,
                                    fillOpacity: 0.35,
                                    color: colors.stroke,
                                    weight: 1.5,
                                    opacity: 0.6,
                                }}
                                eventHandlers={{
                                    click: () => setSelectedZone(zone),
                                }}
                            >
                                <Popup>
                                    <div className="zone-popup">
                                        <div className="zone-popup-header">
                                            <h3>{zone.name}</h3>
                                            <span className={`badge badge-${safety.class}`}>{safety.label}</span>
                                        </div>
                                        <div className="zone-popup-score">
                                            <span className="zone-popup-score-num" style={{ color: safety.color }}>{zone.currentScore}</span>
                                            <span className="zone-popup-score-label">/10 Safety Score</span>
                                        </div>
                                        <div className="zone-popup-stats">
                                            <div className="zone-popup-stat"><FiStar /> {zone.reviewCount} reviews</div>
                                            <div className="zone-popup-stat"><FiAlertTriangle /> {zone.govCrimeStats.incidents} incidents ({zone.govCrimeStats.year})</div>
                                        </div>
                                        {zone.recentAlerts.length > 0 && (
                                            <div className="zone-popup-alerts">
                                                {zone.recentAlerts.slice(0, 2).map((alert, i) => (
                                                    <div key={i} className="zone-popup-alert">⚠️ {alert}</div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </Popup>
                            </Circle>
                        );
                    })}

                    {/* ═══ Review Pins ═══ */}
                    {filteredReviews.map(review => {
                        const score = getReviewScore(review);
                        const icon = createReviewPinIcon(score);
                        const safety = getSafetyCategory(score);
                        const zone = zones.find(z => z.id === review.zoneId);
                        return (
                            <Marker key={review.id} position={review.coordinates} icon={icon}>
                                <Popup>
                                    <div className="zone-popup">
                                        <div className="zone-popup-header">
                                            <h3>{zone?.name || 'Community Review'}</h3>
                                            <span className={`badge badge-${safety.class}`}>{safety.label}</span>
                                        </div>
                                        <div className="zone-popup-score">
                                            <span className="zone-popup-score-num" style={{ color: safety.color }}>{score.toFixed(1)}</span>
                                            <span className="zone-popup-score-label">/10 Review Score</span>
                                        </div>
                                        <div className="review-pin-factors">
                                            <span>💡 Lighting: {review.lighting}/10</span>
                                            <span>👤 Suspicious: {review.suspiciousActivity}/10</span>
                                            <span>🔒 Crime: {review.crimeHistory}/10</span>
                                            <span>🐕 Dogs: {review.strayDogs}/10</span>
                                        </div>
                                        {review.textComment && (
                                            <p className="review-pin-comment">"{review.textComment.substring(0, 120)}..."</p>
                                        )}
                                        <div className="review-pin-meta">
                                            {review.verified && <span className="badge badge-safe">✓ Verified</span>}
                                            <span className="review-pin-time">
                                                {new Date(review.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}

                    {/* ═══ Searched Location Pin ═══ */}
                    {searchedLocation && (
                        <Marker position={searchedLocation.coords} icon={searchedLocation.hasReviews ? createReviewPinIcon(searchedLocation.avgScore) : neutralPinIcon}>
                            <Popup>
                                <div className="zone-popup search-result-popup">
                                    <h3 className="search-popup-name">{searchedLocation.name}</h3>

                                    {searchedLocation.hasReviews ? (
                                        <>
                                            <div className="zone-popup-score">
                                                <span className="zone-popup-score-num" style={{ color: getSafetyCategory(searchedLocation.avgScore).color }}>
                                                    {searchedLocation.avgScore.toFixed(1)}
                                                </span>
                                                <span className="zone-popup-score-label">/10 Avg Safety</span>
                                            </div>
                                            <div className="zone-popup-stat">
                                                <FiStar /> {searchedLocation.nearbyReviews.length} reviews nearby
                                            </div>
                                        </>
                                    ) : (
                                        <div className="search-popup-neutral">
                                            <div className="search-popup-neutral-icon">🗺️</div>
                                            <p className="search-popup-neutral-text">No reviews for this area yet</p>
                                            <Link to="/review" className="btn btn-primary search-popup-rate-btn">
                                                <FiEdit3 /> Be the first to rate this area
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>

                {/* Legend */}
                <div className="map-legend glass-card-strong">
                    <h4 className="map-legend-title"><FiInfo /> Legend</h4>
                    <div className="map-legend-items">
                        <div className="map-legend-item">
                            <div className="map-legend-dot" style={{ background: 'var(--safe-green)' }} />
                            <span>Safe (7-10)</span>
                        </div>
                        <div className="map-legend-item">
                            <div className="map-legend-dot" style={{ background: 'var(--moderate-yellow)' }} />
                            <span>Moderate (4-6)</span>
                        </div>
                        <div className="map-legend-item">
                            <div className="map-legend-dot" style={{ background: 'var(--danger-red)' }} />
                            <span>Unsafe (0-3)</span>
                        </div>
                        <div className="map-legend-item">
                            <div className="map-legend-dot" style={{ background: '#64748b', border: '2px dashed rgba(148,163,184,0.4)' }} />
                            <span>No Reviews</span>
                        </div>
                    </div>
                    <div className="map-legend-section">
                        <span className="map-legend-section-label">Markers</span>
                        <div className="map-legend-item">
                            <div className="map-legend-pin-example">8</div>
                            <span>Review pin (score)</span>
                        </div>
                    </div>
                </div>

                {/* Zone Details Panel */}
                {selectedZone && (
                    <div className="map-detail-panel glass-card-strong">
                        <button className="map-detail-close" onClick={() => setSelectedZone(null)}>✕</button>
                        <h3 className="map-detail-name">{selectedZone.name}</h3>
                        <div className="map-detail-score" style={{ color: getSafetyCategory(selectedZone.currentScore).color }}>
                            {selectedZone.currentScore}<span>/10</span>
                        </div>
                        <span className={`badge badge-${getSafetyCategory(selectedZone.currentScore).class}`}>
                            {getSafetyCategory(selectedZone.currentScore).label}
                        </span>
                        <div className="map-detail-info">
                            <div className="map-detail-row"><span>Reviews</span><strong>{selectedZone.reviewCount}</strong></div>
                            <div className="map-detail-row"><span>Crime Incidents</span><strong>{selectedZone.govCrimeStats.incidents}</strong></div>
                            <div className="map-detail-row"><span>Historical Score</span><strong>{selectedZone.historicalScore}</strong></div>
                        </div>
                        {selectedZone.recentAlerts.length > 0 && (
                            <div className="map-detail-alerts">
                                <p className="map-detail-alerts-title">⚠️ Recent Alerts</p>
                                {selectedZone.recentAlerts.map((alert, i) => (
                                    <p key={i} className="map-detail-alert">{alert}</p>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Searched Location Detail Panel */}
                {searchedLocation && !searchedLocation.hasReviews && (
                    <div className="map-search-panel glass-card-strong animate-slide-right">
                        <button className="map-detail-close" onClick={clearSearchedLocation}>✕</button>
                        <div className="map-search-panel-neutral">
                            <div className="map-search-panel-icon">🗺️</div>
                            <h3>{searchedLocation.name}</h3>
                            <p className="map-search-panel-desc">
                                This area hasn't been reviewed yet. Be a Community Guardian and help others stay safe!
                            </p>
                            <Link to="/review" className="btn btn-primary btn-lg map-search-panel-btn">
                                <FiEdit3 /> Be the first to rate this area
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
