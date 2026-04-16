import { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Polyline, Circle, Popup, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { FiNavigation, FiClock, FiShield, FiAlertTriangle, FiPhone, FiStar, FiSearch, FiX, FiMapPin, FiArrowDown, FiMap } from 'react-icons/fi';
import { zones, cabServices } from '../data/mockData';
import { getZoneColor, getSafetyCategory } from '../utils/safetyEngine';
import 'leaflet/dist/leaflet.css';
import './RouteFinder.css';


// ═══ Custom Marker Icons ═══

const startIcon = L.divIcon({
    className: 'route-marker',
    html: '<div class="route-marker-start">A</div>',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
});

const endIcon = L.divIcon({
    className: 'route-marker',
    html: '<div class="route-marker-end">B</div>',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
});


// ═══ Polyline Decoder (OSRM returns encoded polyline) ═══

function decodePolyline(encoded) {
    const points = [];
    let index = 0, lat = 0, lng = 0;

    while (index < encoded.length) {
        let b, shift = 0, result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        const dlat = (result & 1) ? ~(result >> 1) : (result >> 1);
        lat += dlat;

        shift = 0;
        result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        const dlng = (result & 1) ? ~(result >> 1) : (result >> 1);
        lng += dlng;

        points.push([lat / 1e5, lng / 1e5]);
    }
    return points;
}


// ═══ OSRM Routing API ═══

async function fetchOSRMRoute(startCoords, endCoords, profile = 'driving') {
    // OSRM expects lng,lat format (opposite of Leaflet's lat,lng)
    const startStr = `${startCoords[1]},${startCoords[0]}`;
    const endStr = `${endCoords[1]},${endCoords[0]}`;

    const url = `https://router.project-osrm.org/route/v1/${profile}/${startStr};${endStr}?overview=full&geometries=polyline&alternatives=true&steps=true`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
        throw new Error(data.message || 'No route found');
    }

    return data.routes.map((route, i) => ({
        geometry: decodePolyline(route.geometry),
        distance: (route.distance / 1000).toFixed(1), // km
        duration: Math.round(route.duration / 60),      // minutes
        steps: route.legs[0]?.steps || [],
        isAlternative: i > 0,
    }));
}


// ═══ Safety Score for Route ═══

function calculateRouteSafety(routeGeometry, zones) {
    let totalScore = 0;
    let scoredPoints = 0;

    // Sample every Nth point to avoid excessive computation
    const step = Math.max(1, Math.floor(routeGeometry.length / 40));

    for (let i = 0; i < routeGeometry.length; i += step) {
        const [lat, lng] = routeGeometry[i];

        for (const zone of zones) {
            const dist = haversine([lat, lng], zone.center);
            const radiusKm = zone.radius / 1000;

            if (dist <= radiusKm) {
                totalScore += zone.currentScore;
                scoredPoints++;
                break;
            }
        }
    }

    if (scoredPoints === 0) return 6.5; // neutral score for unknown areas
    return Math.round((totalScore / scoredPoints) * 10) / 10;
}

function haversine(c1, c2) {
    const R = 6371;
    const dLat = (c2[0] - c1[0]) * Math.PI / 180;
    const dLon = (c2[1] - c1[1]) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(c1[0] * Math.PI / 180) * Math.cos(c2[0] * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}


// ═══ Map Controller ═══

function FitBounds({ bounds }) {
    const map = useMap();
    useEffect(() => {
        if (bounds && bounds.length >= 2) {
            map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15, duration: 1.2 });
        }
    }, [bounds, map]);
    return null;
}


// ═══ Nominatim Geocoding Hook ═══

function useGeocoder(label) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selected, setSelected] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const debounceRef = useRef(null);
    const containerRef = useRef(null);

    const doSearch = useCallback((text) => {
        setQuery(text);
        setSelected(null);

        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (!text || text.length < 3) {
            setResults([]);
            return;
        }

        setIsLoading(true);
        debounceRef.current = setTimeout(async () => {
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?` +
                    `format=json&q=${encodeURIComponent(text)}&limit=6&addressdetails=1` +
                    `&viewbox=77.3,13.15,77.85,12.75&bounded=0`
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
                setShowDropdown(true);
            } catch (err) {
                console.error(`Geocoding error (${label}):`, err);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 400);
    }, [label]);

    const selectResult = useCallback((result) => {
        setSelected(result);
        setQuery(result.name);
        setShowDropdown(false);
        setResults([]);
    }, []);

    const clear = useCallback(() => {
        setQuery('');
        setSelected(null);
        setResults([]);
        setShowDropdown(false);
        if (debounceRef.current) clearTimeout(debounceRef.current);
    }, []);

    useEffect(() => {
        const handleClick = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    return {
        query, results, isLoading, selected, showDropdown,
        containerRef,
        doSearch, selectResult, clear,
        setShowDropdown,
    };
}


// ═══ Autocomplete Input Component ═══

function LocationInput({ geocoder, label, icon, placeholder }) {
    const { query, results, isLoading, selected, showDropdown, containerRef, doSearch, selectResult, clear, setShowDropdown } = geocoder;

    return (
        <div className="form-group route-location-group" ref={containerRef}>
            <label className="form-label">{label}</label>
            <div className="route-autocomplete-wrap">
                <span className="route-autocomplete-icon">{icon}</span>
                <input
                    type="text"
                    className={`form-input route-autocomplete-input ${selected ? 'route-input-selected' : ''}`}
                    placeholder={placeholder}
                    value={query}
                    onChange={e => doSearch(e.target.value)}
                    onFocus={() => results.length > 0 && setShowDropdown(true)}
                />
                {isLoading && <div className="route-autocomplete-spinner" />}
                {query && !isLoading && (
                    <button className="route-autocomplete-clear" onClick={clear}><FiX /></button>
                )}
                {selected && (
                    <div className="route-autocomplete-coords">
                        <FiMapPin />
                        <span>{selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}</span>
                    </div>
                )}
            </div>

            {showDropdown && results.length > 0 && (
                <div className="route-autocomplete-dropdown glass-card-strong">
                    {results.map(result => (
                        <button
                            key={result.id}
                            className="route-autocomplete-item"
                            onClick={() => selectResult(result)}
                        >
                            <FiMapPin className="route-autocomplete-item-icon" />
                            <span className="route-autocomplete-item-name">{result.name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}


// ═══ Main Component ═══

export default function RouteFinder() {
    const sourceGeo = useGeocoder('source');
    const destGeo = useGeocoder('destination');

    const [routeData, setRouteData] = useState(null); // { primary, alternative }
    const [selectedRoute, setSelectedRoute] = useState('primary');
    const [isSearching, setIsSearching] = useState(false);
    const [showCabs, setShowCabs] = useState(false);
    const [routeError, setRouteError] = useState(null);
    const [mapBounds, setMapBounds] = useState(null);

    const sourceCoords = sourceGeo.selected ? [sourceGeo.selected.lat, sourceGeo.selected.lng] : null;
    const destCoords = destGeo.selected ? [destGeo.selected.lat, destGeo.selected.lng] : null;

    // Auto-fit map when both locations selected
    useEffect(() => {
        if (sourceCoords && destCoords) {
            setMapBounds([sourceCoords, destCoords]);
        }
    }, [sourceGeo.selected, destGeo.selected]);

    const handleSwap = () => {
        const srcData = sourceGeo.selected;
        const srcQuery = sourceGeo.query;
        const dstData = destGeo.selected;
        const dstQuery = destGeo.query;

        sourceGeo.clear();
        destGeo.clear();

        if (dstData) {
            sourceGeo.doSearch(dstQuery);
            sourceGeo.selectResult(dstData);
        }
        if (srcData) {
            destGeo.doSearch(srcQuery);
            destGeo.selectResult(srcData);
        }
    };

    const handleSearch = async () => {
        if (!sourceCoords || !destCoords) return;

        setIsSearching(true);
        setRouteError(null);
        setRouteData(null);

        try {
            const osrmRoutes = await fetchOSRMRoute(sourceCoords, destCoords, 'driving');

            // Primary route = first OSRM result
            const primary = osrmRoutes[0];
            primary.safetyScore = calculateRouteSafety(primary.geometry, zones);

            // Alternative route (if OSRM returned one), else create a walking route
            let alternative = osrmRoutes.length > 1 ? osrmRoutes[1] : null;

            if (alternative) {
                alternative.safetyScore = calculateRouteSafety(alternative.geometry, zones);
            } else {
                // Try fetching a walking route as the "safer" alternative
                try {
                    const walkRoutes = await fetchOSRMRoute(sourceCoords, destCoords, 'foot');
                    alternative = walkRoutes[0];
                    alternative.safetyScore = calculateRouteSafety(alternative.geometry, zones);
                    alternative.isWalking = true;
                } catch {
                    // No walking route, that's fine
                }
            }

            // Determine which is safer
            let safest, fastest;
            if (alternative && alternative.safetyScore > primary.safetyScore) {
                safest = alternative;
                fastest = primary;
            } else {
                safest = primary;
                fastest = alternative || primary;
            }

            setRouteData({ safest, fastest });
            setSelectedRoute('safest');

            // Fit bounds to the route
            const routeBounds = safest.geometry;
            if (routeBounds.length > 0) {
                setMapBounds(routeBounds);
            }

            // Check if destination is in unsafe zone
            const destZone = zones.find(z => {
                const dist = haversine(destCoords, z.center);
                return dist < (z.radius / 1000) && z.category === 'unsafe';
            });
            setShowCabs(!!destZone);

        } catch (err) {
            console.error('OSRM routing error:', err);
            setRouteError('Could not calculate route. Please try different locations.');
        } finally {
            setIsSearching(false);
        }
    };

    const currentRoute = routeData && routeData[selectedRoute];

    return (
        <div className="route-finder page-enter">
            <div className="container">
                <div className="route-header">
                    <h1 className="route-title">
                        <FiNavigation className="gradient-text" /> Safe Route Finder
                    </h1>
                    <p className="route-subtitle">Real-time routing powered by OpenStreetMap & OSRM — completely free & open-source</p>
                </div>

                <div className="route-layout">
                    {/* ═══ Search Panel ═══ */}
                    <div className="route-panel glass-card-strong">
                        <div className="route-inputs">
                            <LocationInput
                                geocoder={sourceGeo}
                                label="From"
                                icon={<span className="route-dot route-dot-green" />}
                                placeholder="Search starting point..."
                            />

                            <button className="route-swap-btn" onClick={handleSwap} title="Swap locations">
                                <FiArrowDown />
                                <FiArrowDown style={{ transform: 'rotate(180deg)', marginTop: '-6px' }} />
                            </button>

                            <LocationInput
                                geocoder={destGeo}
                                label="To"
                                icon={<span className="route-dot route-dot-purple" />}
                                placeholder="Search destination..."
                            />

                            <button
                                className={`btn btn-primary btn-lg route-search-btn ${isSearching ? 'searching' : ''}`}
                                onClick={handleSearch}
                                disabled={!sourceGeo.selected || !destGeo.selected || isSearching}
                            >
                                {isSearching ? (
                                    <><span className="spinner" /> Calculating Route...</>
                                ) : (
                                    <><FiSearch /> Find Safe Route</>
                                )}
                            </button>
                        </div>

                        {/* Error State */}
                        {routeError && (
                            <div className="route-error animate-fade-in">
                                <FiAlertTriangle />
                                <span>{routeError}</span>
                            </div>
                        )}

                        {/* ═══ Route Results ═══ */}
                        {routeData && (
                            <div className="route-results animate-fade-in-up">
                                <h3 className="route-results-title">Route Options</h3>

                                <div className="route-options">
                                    {/* Safest / Recommended */}
                                    <button
                                        className={`route-option ${selectedRoute === 'safest' ? 'route-option-active route-option-safe' : ''}`}
                                        onClick={() => setSelectedRoute('safest')}
                                    >
                                        <div className="route-option-badge badge-safe">
                                            <FiShield /> RECOMMENDED
                                        </div>
                                        <h4>{routeData.safest.isWalking ? '🚶 Walking Route' : '🛡️ Safest Route'}</h4>
                                        <div className="route-option-stats">
                                            <div className="route-option-stat">
                                                <FiNavigation /><span>{routeData.safest.distance} km</span>
                                            </div>
                                            <div className="route-option-stat">
                                                <FiClock /><span>{routeData.safest.duration} min</span>
                                            </div>
                                        </div>
                                        <div className="route-option-score">
                                            <span className="route-score-value" style={{ color: 'var(--safe-green)' }}>
                                                {routeData.safest.safetyScore.toFixed(1)}
                                            </span>
                                            <span className="route-score-label">/10 Safety</span>
                                        </div>
                                    </button>

                                    {/* Fastest */}
                                    {routeData.fastest !== routeData.safest && (
                                        <button
                                            className={`route-option ${selectedRoute === 'fastest' ? 'route-option-active route-option-short' : ''}`}
                                            onClick={() => setSelectedRoute('fastest')}
                                        >
                                            <div className="route-option-badge badge-moderate">
                                                <FiClock /> FASTEST
                                            </div>
                                            <h4>🚗 Driving Route</h4>
                                            <div className="route-option-stats">
                                                <div className="route-option-stat">
                                                    <FiNavigation /><span>{routeData.fastest.distance} km</span>
                                                </div>
                                                <div className="route-option-stat">
                                                    <FiClock /><span>{routeData.fastest.duration} min</span>
                                                </div>
                                            </div>
                                            <div className="route-option-score">
                                                <span className="route-score-value" style={{ color: 'var(--moderate-yellow)' }}>
                                                    {routeData.fastest.safetyScore.toFixed(1)}
                                                </span>
                                                <span className="route-score-label">/10 Safety</span>
                                            </div>
                                        </button>
                                    )}
                                </div>

                                {/* Safety Comparison */}
                                {routeData.fastest !== routeData.safest && routeData.safest.safetyScore > routeData.fastest.safetyScore && (
                                    <div className="route-comparison">
                                        <FiShield />
                                        <span>
                                            Safer route is <strong>{(routeData.safest.safetyScore - routeData.fastest.safetyScore).toFixed(1)} points</strong> safer
                                            {parseFloat(routeData.safest.distance) > parseFloat(routeData.fastest.distance) && (
                                                <> with <strong>{(parseFloat(routeData.safest.distance) - parseFloat(routeData.fastest.distance)).toFixed(1)} km</strong> extra</>
                                            )}
                                        </span>
                                    </div>
                                )}

                                {/* Route Info */}
                                <div className="route-info-bar">
                                    <FiMap />
                                    <span>Route powered by <strong>OSRM</strong> · Map by <strong>OpenStreetMap</strong></span>
                                </div>
                            </div>
                        )}

                        {/* ═══ Cab Services ═══ */}
                        {showCabs && (
                            <div className="route-cabs animate-fade-in-up">
                                <div className="route-cabs-header">
                                    <FiAlertTriangle style={{ color: 'var(--danger-red)' }} />
                                    <div>
                                        <h3>Destination in Unsafe Zone</h3>
                                        <p>We recommend using a trusted cab service</p>
                                    </div>
                                </div>
                                <div className="route-cabs-list">
                                    {cabServices.map(cab => (
                                        <div key={cab.id} className="route-cab-card glass-card">
                                            <div className="route-cab-info">
                                                <h4>{cab.name}</h4>
                                                <span className="badge badge-purple">{cab.type}</span>
                                            </div>
                                            <div className="route-cab-meta">
                                                <span><FiStar /> {cab.rating}</span>
                                                <span><FiClock /> {cab.estimatedTime}</span>
                                                <span>{cab.priceRange}</span>
                                            </div>
                                            <div className="route-cab-features">
                                                {cab.features.map((f, i) => (
                                                    <span key={i} className="route-cab-feature">✓ {f}</span>
                                                ))}
                                            </div>
                                            <a href={`tel:${cab.phone}`} className="btn btn-success route-cab-call">
                                                <FiPhone /> Call Now
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ═══ Map ═══ */}
                    <div className="route-map-wrap">
                        <MapContainer
                            center={[12.9600, 77.6100]}
                            zoom={12}
                            className="route-map"
                            zoomControl={false}
                        >
                            <TileLayer
                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
                            />
                            {mapBounds && <FitBounds bounds={mapBounds} />}

                            {/* Zone overlays */}
                            {zones.map(zone => {
                                const colors = getZoneColor(zone.currentScore);
                                return (
                                    <Circle
                                        key={zone.id}
                                        center={zone.center}
                                        radius={zone.radius}
                                        pathOptions={{
                                            fillColor: colors.fill,
                                            fillOpacity: 0.25,
                                            color: colors.stroke,
                                            weight: 1,
                                            opacity: 0.4,
                                        }}
                                    />
                                );
                            })}

                            {/* ═══ Route Polylines ═══ */}
                            {/* Draw non-selected route first (underneath, dimmed) */}
                            {routeData && routeData.fastest !== routeData.safest && (
                                <Polyline
                                    positions={
                                        selectedRoute === 'safest'
                                            ? routeData.fastest.geometry
                                            : routeData.safest.geometry
                                    }
                                    pathOptions={{
                                        color: '#475569',
                                        weight: 4,
                                        opacity: 0.4,
                                        dashArray: '8, 12',
                                        lineCap: 'round',
                                        lineJoin: 'round',
                                    }}
                                />
                            )}

                            {/* Draw selected route on top (thick, bright, Uber-style) */}
                            {currentRoute && (
                                <>
                                    {/* Glow/shadow layer */}
                                    <Polyline
                                        positions={currentRoute.geometry}
                                        pathOptions={{
                                            color: selectedRoute === 'safest' ? '#10b981' : '#8b5cf6',
                                            weight: 10,
                                            opacity: 0.2,
                                            lineCap: 'round',
                                            lineJoin: 'round',
                                        }}
                                    />
                                    {/* Main route line */}
                                    <Polyline
                                        positions={currentRoute.geometry}
                                        pathOptions={{
                                            color: selectedRoute === 'safest' ? '#10b981' : '#8b5cf6',
                                            weight: 5,
                                            opacity: 0.9,
                                            lineCap: 'round',
                                            lineJoin: 'round',
                                        }}
                                    />
                                </>
                            )}

                            {/* Markers */}
                            {sourceCoords && (
                                <Marker position={sourceCoords} icon={startIcon}>
                                    <Popup><strong>{sourceGeo.selected.name}</strong><br /><small>Starting Point</small></Popup>
                                </Marker>
                            )}
                            {destCoords && (
                                <Marker position={destCoords} icon={endIcon}>
                                    <Popup><strong>{destGeo.selected.name}</strong><br /><small>Destination</small></Popup>
                                </Marker>
                            )}
                        </MapContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
