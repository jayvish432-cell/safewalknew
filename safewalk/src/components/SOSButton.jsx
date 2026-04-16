import { useState } from 'react';
import { FiAlertTriangle, FiX, FiPhone, FiMapPin } from 'react-icons/fi';
import { emergencyContacts } from '../data/mockData';
import './SOSButton.css';

export default function SOSButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAlertSent, setIsAlertSent] = useState(false);
    const [userLocation, setUserLocation] = useState(null);

    const handleSOS = () => {
        setIsModalOpen(true);
        // Try to get current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
                () => setUserLocation([12.9716, 77.5946]) // Fallback
            );
        }
    };

    const confirmSOS = () => {
        setIsAlertSent(true);
        // Simulate sending alert
        setTimeout(() => {
            setIsAlertSent(false);
            setIsModalOpen(false);
        }, 4000);
    };

    return (
        <>
            <button className="sos-btn" onClick={handleSOS} aria-label="Emergency SOS">
                <div className="sos-btn-pulse" />
                <div className="sos-btn-pulse sos-btn-pulse-2" />
                <span className="sos-btn-text">SOS</span>
            </button>

            {isModalOpen && (
                <div className="sos-modal-overlay" onClick={() => !isAlertSent && setIsModalOpen(false)}>
                    <div className="sos-modal" onClick={e => e.stopPropagation()}>
                        {!isAlertSent ? (
                            <>
                                <button className="sos-modal-close" onClick={() => setIsModalOpen(false)}>
                                    <FiX />
                                </button>
                                <div className="sos-modal-icon">
                                    <FiAlertTriangle />
                                </div>
                                <h2 className="sos-modal-title">Emergency Alert</h2>
                                <p className="sos-modal-desc">
                                    This will send your live location to emergency contacts and local authorities.
                                </p>

                                {userLocation && (
                                    <div className="sos-location-badge">
                                        <FiMapPin />
                                        <span>{userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}</span>
                                    </div>
                                )}

                                <button className="sos-confirm-btn" onClick={confirmSOS}>
                                    <FiAlertTriangle />
                                    SEND EMERGENCY ALERT
                                </button>

                                <div className="sos-contacts">
                                    <p className="sos-contacts-title">Emergency Contacts</p>
                                    {emergencyContacts.map((contact, i) => (
                                        <a key={i} href={`tel:${contact.number}`} className="sos-contact-item">
                                            <span className="sos-contact-icon">{contact.icon}</span>
                                            <span className="sos-contact-name">{contact.name}</span>
                                            <span className="sos-contact-number">{contact.number}</span>
                                            <FiPhone className="sos-contact-phone" />
                                        </a>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="sos-sent">
                                <div className="sos-sent-check">
                                    <svg viewBox="0 0 24 24" className="sos-sent-svg">
                                        <circle cx="12" cy="12" r="10" className="sos-sent-circle" />
                                        <path d="M8 12l2.5 2.5L16 9" className="sos-sent-path" />
                                    </svg>
                                </div>
                                <h2 className="sos-sent-title">Alert Sent!</h2>
                                <p className="sos-sent-desc">
                                    Your location has been shared with emergency services and your saved contacts.
                                </p>
                                <p className="sos-sent-help">Help is on the way. Stay calm and stay safe.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
