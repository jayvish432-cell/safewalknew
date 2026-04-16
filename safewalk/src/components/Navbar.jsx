import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMap, FiNavigation, FiEdit3, FiUser, FiMenu, FiX, FiShield } from 'react-icons/fi';
import './Navbar.css';

const navLinks = [
    { path: '/', label: 'Home', icon: <FiShield /> },
    { path: '/map', label: 'Safety Map', icon: <FiMap /> },
    { path: '/route', label: 'Safe Route', icon: <FiNavigation /> },
    { path: '/review', label: 'Review', icon: <FiEdit3 /> },
    { path: '/dashboard', label: 'Dashboard', icon: <FiUser /> },
];

export default function Navbar() {
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileOpen(false);
    }, [location]);

    return (
        <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
            <div className="navbar-inner">
                <Link to="/" className="navbar-brand">
                    <div className="navbar-logo">
                        <FiShield className="navbar-logo-icon" />
                        <div className="navbar-logo-pulse" />
                    </div>
                    <span className="navbar-name">
                        Safe<span className="navbar-name-accent">Walk</span>
                    </span>
                </Link>

                <div className={`navbar-links ${isMobileOpen ? 'navbar-links-open' : ''}`}>
                    {navLinks.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`navbar-link ${location.pathname === link.path ? 'navbar-link-active' : ''}`}
                        >
                            <span className="navbar-link-icon">{link.icon}</span>
                            <span className="navbar-link-label">{link.label}</span>
                            {location.pathname === link.path && <div className="navbar-link-indicator" />}
                        </Link>
                    ))}
                </div>

                <button
                    className="navbar-mobile-toggle"
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    aria-label="Toggle navigation"
                >
                    {isMobileOpen ? <FiX /> : <FiMenu />}
                </button>
            </div>

            {isMobileOpen && (
                <div className="navbar-mobile-overlay" onClick={() => setIsMobileOpen(false)} />
            )}
        </nav>
    );
}
