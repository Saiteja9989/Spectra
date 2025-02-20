import React from 'react';
import './PopupBanner.css'; // Import CSS for stylin

const PopupBanner = ({ onClose }) => {
    return (
        <div className="popup-banner">
            <div className="popup-content">
                <img src="/event.jpg" alt="Banner" className="banner-image" />
                <button onClick={onClose} className="close-button">Close</button>
            </div>
        </div>
    );
};

export default PopupBanner;
