// ═══════════════════════════════════════════════════
// SafeWalk Safety Engine — AI Logic (Client-Side)
// ═══════════════════════════════════════════════════

/**
 * Calculate weighted safety score from review factors
 * Weights: lighting (25%), suspicious activity (25%), crime history (20%), 
 *          stray dogs (10%), overall safety (20%)
 * Suspicious activity and crime history are inverted (high = dangerous)
 */
export function calculateSafetyScore(reviews) {
    if (!reviews || reviews.length === 0) return 5.0;

    const weights = {
        lighting: 0.25,
        suspiciousActivity: 0.25,
        crimeHistory: 0.20,
        strayDogs: 0.10,
        overallSafety: 0.20,
    };

    let totalScore = 0;

    reviews.forEach(review => {
        const score =
            (review.lighting * weights.lighting) +
            ((10 - review.suspiciousActivity) * weights.suspiciousActivity) +
            ((10 - review.crimeHistory) * weights.crimeHistory) +
            ((10 - review.strayDogs) * weights.strayDogs) +
            (review.overallSafety * weights.overallSafety);
        totalScore += score;
    });

    return Math.round((totalScore / reviews.length) * 10) / 10;
}

/**
 * Keyword-based sentiment analysis for review text
 * Returns: { score: -1 to 1, label: 'positive'|'negative'|'neutral', keywords: [] }
 */
export function analyzeSentiment(text) {
    if (!text) return { score: 0, label: 'neutral', keywords: [] };

    const lowerText = text.toLowerCase();

    const negativeKeywords = [
        'unsafe', 'dangerous', 'dark', 'scared', 'avoid', 'harassment', 'robbery',
        'theft', 'attacked', 'aggressive', 'suspicious', 'lurking', 'sketchy',
        'crime', 'violent', 'broken', 'dimly', 'frightening', 'never walk',
        'pickpocket', 'gang', 'threat', 'assault', 'stalking', 'creepy',
        'no lights', 'no street lights', 'poor lighting', 'worst', 'horrible',
    ];

    const positiveKeywords = [
        'safe', 'well lit', 'well-lit', 'cctv', 'patrol', 'secure', 'comfortable',
        'peaceful', 'friendly', 'clean', 'maintained', 'cameras', 'guards',
        'neighborhood watch', 'excellent', 'recommended', 'trustworthy',
        'calm', 'good lighting', 'bright', 'best', 'amazing', 'great',
    ];

    const foundNegative = negativeKeywords.filter(kw => lowerText.includes(kw));
    const foundPositive = positiveKeywords.filter(kw => lowerText.includes(kw));

    const negCount = foundNegative.length;
    const posCount = foundPositive.length;
    const total = negCount + posCount || 1;

    const score = (posCount - negCount) / total;

    let label = 'neutral';
    if (score > 0.2) label = 'positive';
    else if (score < -0.2) label = 'negative';

    return {
        score: Math.round(score * 100) / 100,
        label,
        keywords: [...foundNegative.map(k => ({ word: k, type: 'negative' })),
        ...foundPositive.map(k => ({ word: k, type: 'positive' }))],
    };
}

/**
 * Check if auto-alert should trigger
 * Condition: 3+ harassment/danger reports in same zone within 1 hour
 */
export function checkAutoAlert(zoneReports) {
    if (!zoneReports || zoneReports.length < 3) return { shouldAlert: false };

    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const recentReports = zoneReports.filter(report => {
        const reportTime = new Date(report.timestamp);
        return reportTime >= oneHourAgo;
    });

    const dangerReports = recentReports.filter(report => {
        const isDanger = report.overallSafety <= 3 ||
            report.suspiciousActivity >= 7 ||
            analyzeSentiment(report.textComment).label === 'negative';
        return isDanger;
    });

    if (dangerReports.length >= 3) {
        return {
            shouldAlert: true,
            alertLevel: 'critical',
            reportCount: dangerReports.length,
            message: `⚠️ DANGER ALERT: ${dangerReports.length} safety reports received in the last hour. Exercise extreme caution in this area.`,
        };
    }

    return { shouldAlert: false };
}

/**
 * Get safety category from score
 */
export function getSafetyCategory(score) {
    if (score >= 7) return { label: 'Safe', color: '#10b981', class: 'safe' };
    if (score >= 4) return { label: 'Moderate', color: '#f59e0b', class: 'moderate' };
    return { label: 'Unsafe', color: '#ef4444', class: 'unsafe' };
}

/**
 * Get zone color for map overlay
 */
export function getZoneColor(score) {
    if (score >= 7) return { fill: 'rgba(16, 185, 129, 0.25)', stroke: '#10b981' };
    if (score >= 4) return { fill: 'rgba(245, 158, 11, 0.25)', stroke: '#f59e0b' };
    return { fill: 'rgba(239, 68, 68, 0.25)', stroke: '#ef4444' };
}

/**
 * Simulated safe route finding
 * Returns two routes: shortest and safest, with waypoints
 */
export function findSafeRoute(startCoords, endCoords, zones) {
    const directDistance = haversineDistance(startCoords, endCoords);

    // Simulate shortest route (direct)
    const shortestRoute = {
        type: 'shortest',
        distance: `${(directDistance).toFixed(1)} km`,
        duration: `${Math.round(directDistance * 3.5)} min`,
        safetyScore: calculateRouteSafety(startCoords, endCoords, zones, false),
        waypoints: generateWaypoints(startCoords, endCoords, 5, 0),
        color: '#3b82f6',
    };

    // Simulate safest route (avoids unsafe zones, slightly longer)
    const detourFactor = 1.2 + Math.random() * 0.3;
    const safestRoute = {
        type: 'safest',
        distance: `${(directDistance * detourFactor).toFixed(1)} km`,
        duration: `${Math.round(directDistance * detourFactor * 3.5)} min`,
        safetyScore: calculateRouteSafety(startCoords, endCoords, zones, true),
        waypoints: generateWaypoints(startCoords, endCoords, 7, 0.003),
        color: '#10b981',
    };

    return { shortest: shortestRoute, safest: safestRoute };
}

/**
 * Calculate Haversine distance between two points (km)
 */
function haversineDistance(coord1, coord2) {
    const R = 6371;
    const dLat = toRad(coord2[0] - coord1[0]);
    const dLon = toRad(coord2[1] - coord1[1]);
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(coord1[0])) * Math.cos(toRad(coord2[0])) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg) { return deg * (Math.PI / 180); }

/**
 * Generate waypoints between two coordinates
 */
function generateWaypoints(start, end, count, offset) {
    const points = [start];
    for (let i = 1; i < count; i++) {
        const ratio = i / count;
        const lat = start[0] + (end[0] - start[0]) * ratio + (Math.random() - 0.5) * offset;
        const lng = start[1] + (end[1] - start[1]) * ratio + (Math.random() - 0.5) * offset;
        points.push([lat, lng]);
    }
    points.push(end);
    return points;
}

/**
 * Calculate route safety by checking zone scores along path
 */
function calculateRouteSafety(start, end, zones, avoidUnsafe) {
    let totalScore = 0;
    let zonesCrossed = 0;

    zones.forEach(zone => {
        const distToZone = haversineDistance(
            [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2],
            zone.center
        );
        if (distToZone < 2) {
            if (avoidUnsafe && zone.currentScore < 4) return;
            totalScore += zone.currentScore;
            zonesCrossed++;
        }
    });

    if (zonesCrossed === 0) return 7.0;
    const avg = totalScore / zonesCrossed;
    return avoidUnsafe ? Math.min(avg + 1.5, 10) : avg;
}

/**
 * Verify if user is within radius of target location
 * @returns {boolean} true if within 500m
 */
export function verifyLocation(userCoords, targetCoords, maxDistanceKm = 0.5) {
    const distance = haversineDistance(userCoords, targetCoords);
    return distance <= maxDistanceKm;
}

/**
 * Get safety level label and styling
 */
export function getSafetyLevel(score) {
    if (score >= 8.5) return { level: 'Excellent', emoji: '🟢', gradient: 'var(--gradient-green)' };
    if (score >= 7) return { level: 'Good', emoji: '🟢', gradient: 'var(--gradient-green)' };
    if (score >= 5) return { level: 'Moderate', emoji: '🟡', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' };
    if (score >= 3) return { level: 'Poor', emoji: '🟠', gradient: 'linear-gradient(135deg, #f97316, #ea580c)' };
    return { level: 'Dangerous', emoji: '🔴', gradient: 'var(--gradient-danger)' };
}
