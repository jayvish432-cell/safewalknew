import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMap, FiNavigation, FiEdit3, FiShield, FiAlertTriangle, FiUsers, FiStar, FiArrowRight, FiZap } from 'react-icons/fi';
import './LandingPage.css';

const features = [
    {
        icon: <FiMap />,
        title: 'Interactive Safety Map',
        desc: 'Real-time color-coded zones showing safe, moderate, and unsafe areas across your city.',
        color: 'var(--safe-green)',
        link: '/map',
    },
    {
        icon: <FiNavigation />,
        title: 'AI Safe Routes',
        desc: 'Smart routing that prioritizes your safety over shortest distance. Walk confidently at night.',
        color: 'var(--accent-purple)',
        link: '/route',
    },
    {
        icon: <FiEdit3 />,
        title: 'Community Reviews',
        desc: 'Rate streets on lighting, safety, and more. Your reviews help keep everyone safe.',
        color: 'var(--accent-cyan)',
        link: '/review',
    },
    {
        icon: <FiAlertTriangle />,
        title: 'Emergency SOS',
        desc: 'One-tap emergency alert with live location sharing to authorities and your contacts.',
        color: 'var(--danger-red)',
        link: '#',
    },
];

const stats = [
    { value: 12847, label: 'Safe Routes Calculated', suffix: '+' },
    { value: 3456, label: 'Community Reviews', suffix: '+' },
    { value: 156, label: 'Zones Mapped', suffix: '' },
    { value: 98.2, label: 'Safety Accuracy', suffix: '%' },
];

function AnimatedCounter({ target, suffix, duration = 2000 }) {
    const [count, setCount] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setHasStarted(true), 500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!hasStarted) return;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        const interval = setInterval(() => {
            current += increment;
            if (current >= target) {
                setCount(target);
                clearInterval(interval);
            } else {
                setCount(Math.floor(current * 10) / 10);
            }
        }, duration / steps);
        return () => clearInterval(interval);
    }, [hasStarted, target, duration]);

    return <span>{Number.isInteger(target) ? Math.floor(count).toLocaleString() : count.toFixed(1)}{suffix}</span>;
}

export default function LandingPage() {
    return (
        <div className="landing page-enter">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-bg">
                    <div className="hero-orb hero-orb-1" />
                    <div className="hero-orb hero-orb-2" />
                    <div className="hero-orb hero-orb-3" />
                    <div className="hero-grid" />
                </div>

                <div className="container hero-content">
                    <div className="hero-badge animate-fade-in-up stagger-1">
                        <FiShield />
                        <span>AI-Powered Night Safety</span>
                    </div>

                    <h1 className="hero-title animate-fade-in-up stagger-2">
                        Travel Smarter, Safer,<br />
                        <span className="gradient-text">and with Confidence</span><br />
                        at Night
                    </h1>

                    <p className="hero-subtitle animate-fade-in-up stagger-3">
                        SafeWalk uses AI and community insights to map safe zones, calculate protected
                        routes, and keep you connected to help — wherever you go after dark.
                    </p>

                    <div className="hero-actions animate-fade-in-up stagger-4">
                        <Link to="/map" className="btn btn-primary btn-lg">
                            <FiMap /> Explore Safety Map
                        </Link>
                        <Link to="/route" className="btn btn-outline btn-lg">
                            <FiNavigation /> Find Safe Route
                        </Link>
                    </div>

                    <div className="hero-trust animate-fade-in-up stagger-5">
                        <div className="hero-trust-avatars">
                            {['P', 'A', 'S', 'R'].map((letter, i) => (
                                <div key={i} className="hero-trust-avatar" style={{ zIndex: 4 - i }}>
                                    {letter}
                                </div>
                            ))}
                        </div>
                        <p className="hero-trust-text">
                            <strong>2,400+</strong> community guardians keeping cities safe
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        {stats.map((stat, i) => (
                            <div key={i} className="stat-card">
                                <div className="stat-value">
                                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                                </div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="features-section section">
                <div className="container">
                    <div className="features-header">
                        <span className="badge badge-purple">
                            <FiZap /> Features
                        </span>
                        <h2 className="section-title">
                            Everything You Need to<br />
                            <span className="gradient-text">Stay Safe at Night</span>
                        </h2>
                        <p className="section-subtitle">
                            Powered by AI analysis and real community reviews to give you the most
                            accurate safety information.
                        </p>
                    </div>

                    <div className="features-grid">
                        {features.map((feature, i) => (
                            <Link to={feature.link} key={i} className="feature-card glass-card">
                                <div className="feature-icon" style={{ '--feature-color': feature.color }}>
                                    {feature.icon}
                                </div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-desc">{feature.desc}</p>
                                <span className="feature-link">
                                    Learn more <FiArrowRight />
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="how-section section">
                <div className="container">
                    <div className="features-header">
                        <span className="badge badge-safe">
                            <FiShield /> How It Works
                        </span>
                        <h2 className="section-title">
                            Your Safety in<br />
                            <span className="gradient-text-green">Three Simple Steps</span>
                        </h2>
                    </div>

                    <div className="how-steps">
                        <div className="how-step">
                            <div className="how-step-number">01</div>
                            <div className="how-step-content">
                                <h3>Open the Map</h3>
                                <p>See color-coded safety zones across your city instantly. Green means safe, red means avoid.</p>
                            </div>
                        </div>
                        <div className="how-step-connector" />
                        <div className="how-step">
                            <div className="how-step-number">02</div>
                            <div className="how-step-content">
                                <h3>Get Your Safe Route</h3>
                                <p>Enter your destination and our AI calculates the safest path — not just the shortest one.</p>
                            </div>
                        </div>
                        <div className="how-step-connector" />
                        <div className="how-step">
                            <div className="how-step-number">03</div>
                            <div className="how-step-content">
                                <h3>Walk with Confidence</h3>
                                <p>Follow the guided route, contribute reviews, and help make your city safer for everyone.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section section">
                <div className="container">
                    <div className="cta-card glass-card-strong">
                        <div className="cta-glow" />
                        <h2 className="cta-title">
                            Ready to Walk <span className="gradient-text">Safely</span> Tonight?
                        </h2>
                        <p className="cta-desc">
                            Join thousands of community guardians making cities safer. Your reviews help
                            protect others.
                        </p>
                        <div className="cta-actions">
                            <Link to="/map" className="btn btn-primary btn-lg">
                                <FiMap /> Open Safety Map
                            </Link>
                            <Link to="/review" className="btn btn-success btn-lg">
                                <FiEdit3 /> Submit a Review
                            </Link>
                        </div>
                        <div className="cta-badges">
                            <FiUsers /> <span>Trusted by students, women, and night workers</span>
                            <FiStar /> <span>4.9/5 community rating</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container footer-inner">
                    <div className="footer-brand">
                        <FiShield className="footer-logo" />
                        <span>SafeWalk</span>
                    </div>
                    <p className="footer-text">Your Safe Night Companion — Making cities safer, one review at a time.</p>
                    <p className="footer-copy">&copy; 2026 SafeWalk. Built with 💜 for safer nights.</p>
                </div>
            </footer>
        </div>
    );
}
