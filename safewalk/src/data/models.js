// ═══════════════════════════════════════════════════
// SafeWalk Database Schema Models
// ═══════════════════════════════════════════════════

/**
 * User Model
 * Represents a registered SafeWalk community member
 */
export const UserSchema = {
    id: 'string',           // Unique identifier
    name: 'string',         // Full name
    email: 'string',        // Email address
    avatar: 'string|null',  // Profile picture URL
    verifiedLocation: '[lat, lng]', // Last verified GPS coordinates
    safetyPoints: 'number', // Gamification points earned
    level: 'number',        // User level (1-10)
    badges: 'string[]',     // Achievement badges earned
    contactInfo: 'string',  // Emergency contact number
    reviewCount: 'number',  // Total reviews submitted
    joinedAt: 'date',       // ISO date string
};

/**
 * Review Model
 * Community-sourced safety review for a specific zone
 */
export const ReviewSchema = {
    id: 'string',
    userId: 'string',       // Reference to user
    zoneId: 'string',       // Reference to zone
    coordinates: '[lat, lng]', // Exact review location
    timestamp: 'datetime',  // When review was submitted

    // 5 Safety Factors (1-10 scale)
    lighting: 'number',           // Street lighting quality
    suspiciousActivity: 'number', // Presence of suspicious individuals (high = more suspicious)
    crimeHistory: 'number',       // Known crime in area (high = more crime)
    strayDogs: 'number',          // Stray dog density (high = more dogs)
    overallSafety: 'number',      // Overall night safety feeling

    textComment: 'string',  // Detailed text review
    verified: 'boolean',    // Whether location was GPS-verified
};

/**
 * Zone Model
 * Geographic area with aggregated safety data
 */
export const ZoneSchema = {
    id: 'string',
    name: 'string',         // Area name
    center: '[lat, lng]',   // Center coordinates
    radius: 'number',       // Zone radius in meters
    currentScore: 'number', // Current AI-calculated safety score (0-10)
    historicalScore: 'number', // Historical average score
    reviewCount: 'number',  // Number of reviews for this zone
    govCrimeStats: '{incidents, year}', // Government crime statistics
    recentAlerts: 'string[]', // Recent danger alerts
    category: "'safe' | 'moderate' | 'unsafe'", // Classification
};

/**
 * Map level thresholds for gamification
 */
export const levelThresholds = [
    { level: 1, minPoints: 0, title: 'Newcomer' },
    { level: 2, minPoints: 500, title: 'Scout' },
    { level: 3, minPoints: 1200, title: 'Watchdog' },
    { level: 4, minPoints: 2000, title: 'Protector' },
    { level: 5, minPoints: 2800, title: 'Guardian' },
    { level: 6, minPoints: 3500, title: 'Sentinel' },
    { level: 7, minPoints: 5000, title: 'Champion' },
    { level: 8, minPoints: 7500, title: 'Legend' },
    { level: 9, minPoints: 10000, title: 'Mythic' },
    { level: 10, minPoints: 15000, title: 'SafeWalk Hero' },
];

export function getLevelInfo(points) {
    let current = levelThresholds[0];
    let next = levelThresholds[1];

    for (let i = 0; i < levelThresholds.length; i++) {
        if (points >= levelThresholds[i].minPoints) {
            current = levelThresholds[i];
            next = levelThresholds[i + 1] || null;
        }
    }

    const progress = next
        ? ((points - current.minPoints) / (next.minPoints - current.minPoints)) * 100
        : 100;

    return { current, next, progress: Math.min(progress, 100) };
}
